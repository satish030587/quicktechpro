import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';
import * as speakeasy from 'speakeasy';

function hashToken(raw: string) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async register(input: { email: string; password: string; name?: string; phone?: string; acceptPrivacy: boolean; marketingEmailOptIn?: boolean; marketingSmsOptIn?: boolean }) {
    if (!input.acceptPrivacy) throw new BadRequestException('Privacy policy must be accepted');
    // Basic complexity: at least 1 letter and 1 number
    if (!/[A-Za-z]/.test(input.password) || !/[0-9]/.test(input.password)) {
      throw new BadRequestException('Password must include letters and numbers');
    }
    const existing = await this.users.findByEmail(input.email);
    if (existing) throw new BadRequestException('Email already registered');
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        name: input.name,
        passwordHash,
        marketingEmailOptIn: Boolean(input.marketingEmailOptIn),
        marketingSmsOptIn: Boolean(input.marketingSmsOptIn),
        privacyAcceptedAt: new Date(),
        roles: {
          create: [{ role: { connectOrCreate: { where: { name: 'customer' }, create: { name: 'customer' } } } }]
        }
      }
    });

    // Create email verification token (hashed in DB, raw returned only if you want to email now)
    const raw = crypto.randomBytes(32).toString('hex');
    await this.prisma.verificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24h
      }
    });
    return { id: user.id, email: user.email };
  }

  private signAccess(user: any) {
    const roles = (user.roles || []).map((r: any) => r.role?.name || r.name).filter(Boolean);
    const tfa = Boolean(user.totpSecret?.enabled);
    return this.jwt.sign({ sub: user.id, email: user.email, roles, tfa });
  }

  private async issueRefresh(userId: string, ctx?: { userAgent?: string; ip?: string }) {
    const raw = crypto.randomBytes(48).toString('hex');
    const tokenHash = hashToken(raw);
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        userAgent: ctx?.userAgent,
        ip: ctx?.ip,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30d
      }
    });
    return raw;
  }

  private async recordAttempt(params: { email?: string; userId?: string; success: boolean; ip?: string; userAgent?: string }) {
    await this.prisma.authAttempt.create({ data: { email: params.email, userId: params.userId, success: params.success, ip: params.ip, userAgent: params.userAgent } });
  }

  async login(input: { email: string; password: string; remember?: boolean; captcha?: string }, ctx?: { userAgent?: string; ip?: string }) {
    const now = new Date();
    const windowMs = 15 * 60 * 1000;
    const since = new Date(now.getTime() - windowMs);
    const recentFails = await this.prisma.authAttempt.count({ where: { email: input.email, success: false, createdAt: { gt: since } } });
    const captchaRequired = recentFails >= 5;
    if (captchaRequired && !input.captcha) {
      throw new UnauthorizedException('CAPTCHA required');
    }

    const user = await this.users.findByEmail(input.email);
    if (!user) {
      await this.recordAttempt({ email: input.email, success: false, ip: ctx?.ip, userAgent: ctx?.userAgent });
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) throw new ForbiddenException('Account is deactivated');

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    await this.recordAttempt({ email: input.email, userId: user.id, success: ok, ip: ctx?.ip, userAgent: ctx?.userAgent });
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // Enforce email verification if configured
    if ((process.env.ENFORCE_EMAIL_VERIFIED || 'false').toLowerCase() === 'true') {
      if (!user.emailVerified) {
        throw new ForbiddenException('Email not verified. Please verify your email.');
      }
    }

    const accessToken = this.signAccess(user);
    const refreshToken = await this.issueRefresh(user.id, ctx);
    return { accessToken, refreshToken, tfaEnabled: Boolean(user.totpSecret?.enabled) };
  }

  async refresh(input: { refreshToken: string }) {
    const tokenHash = hashToken(input.refreshToken);
    const rec = await this.prisma.refreshToken.findFirst({ where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } } });
    if (!rec) throw new UnauthorizedException('Invalid refresh token');
    const user = await this.users.findById(rec.userId);
    const accessToken = this.signAccess(user);
    return { accessToken };
  }

  async logout(input: { refreshToken?: string; userId?: string }) {
    if (input.refreshToken) {
      await this.prisma.refreshToken.updateMany({ where: { tokenHash: hashToken(input.refreshToken) }, data: { revokedAt: new Date() } });
      return { revoked: 1 };
    }
    if (input.userId) {
      await this.prisma.refreshToken.updateMany({ where: { userId: input.userId, revokedAt: null }, data: { revokedAt: new Date() } });
      return { revokedAll: true };
    }
    return { ok: true };
  }

  async requestPasswordReset(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return { ok: true }; // do not reveal
    const raw = crypto.randomBytes(32).toString('hex');
    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashToken(raw), expiresAt: new Date(Date.now() + 1000 * 60 * 30) }
    });
    return { ok: true };
  }

  async resetPassword(input: { token: string; newPassword: string }) {
    const rec = await this.prisma.passwordResetToken.findFirst({ where: { tokenHash: hashToken(input.token), usedAt: null, expiresAt: { gt: new Date() } } });
    if (!rec) throw new BadRequestException('Invalid or expired token');
    const passwordHash = await bcrypt.hash(input.newPassword, 10);
    await this.prisma.user.update({ where: { id: rec.userId }, data: { passwordHash } });
    await this.prisma.passwordResetToken.update({ where: { id: rec.id }, data: { usedAt: new Date() } });
    return { ok: true };
  }

  async verifyEmail(input: { token: string }) {
    const rec = await this.prisma.verificationToken.findFirst({ where: { tokenHash: hashToken(input.token), usedAt: null, expiresAt: { gt: new Date() } } });
    if (!rec) throw new BadRequestException('Invalid or expired token');
    await this.prisma.user.update({ where: { id: rec.userId }, data: { emailVerified: new Date() } });
    await this.prisma.verificationToken.update({ where: { id: rec.id }, data: { usedAt: new Date() } });
    return { ok: true };
  }

  async resendVerification(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return { ok: true };
    if (user.emailVerified) return { ok: true };
    const raw = crypto.randomBytes(32).toString('hex');
    await this.prisma.verificationToken.create({ data: { userId: user.id, tokenHash: hashToken(raw), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) } });
    return { ok: true };
  }

  async setup2FA(userId: string) {
    const secret = speakeasy.generateSecret({ name: 'QuickTechPro' });
    await this.prisma.totpSecret.upsert({
      where: { userId },
      update: { secret: secret.base32, enabled: false },
      create: { userId, secret: secret.base32, enabled: false }
    });
    return { otpauthUrl: secret.otpauth_url, base32: secret.base32 };
  }

  async verify2FA(userId: string, token: string) {
    const rec = await this.prisma.totpSecret.findUnique({ where: { userId } });
    if (!rec) throw new BadRequestException('No 2FA setup');
    const ok = speakeasy.totp.verify({ secret: rec.secret, encoding: 'base32', token, window: 2 });
    if (!ok) throw new ForbiddenException('Invalid 2FA token');
    await this.prisma.totpSecret.update({ where: { userId }, data: { enabled: true, verifiedAt: new Date() } });
    const user = await this.users.findById(userId);
    const accessToken = this.signAccess(user);
    return { enabled: true, accessToken };
  }

  async disable2FA(userId: string) {
    await this.prisma.totpSecret.delete({ where: { userId } }).catch(() => {});
    const user = await this.users.findById(userId);
    const accessToken = this.signAccess(user);
    return { enabled: false, accessToken };
  }

  async generateRecoveryCodes(userId: string) {
    // Generate 8 random codes
    const codes: string[] = Array.from({ length: 8 }).map(() => crypto.randomBytes(5).toString('hex'));
    await this.prisma.totpRecoveryCode.deleteMany({ where: { userId } });
    await this.prisma.totpRecoveryCode.createMany({ data: codes.map(c => ({ userId, codeHash: hashToken(c) })) });
    return { codes };
  }

  async verifyRecoveryCode(userId: string, code: string) {
    const rec = await this.prisma.totpRecoveryCode.findFirst({ where: { userId, codeHash: hashToken(code), usedAt: null } });
    if (!rec) throw new ForbiddenException('Invalid recovery code');
    await this.prisma.totpRecoveryCode.update({ where: { id: rec.id }, data: { usedAt: new Date() } });
    return { ok: true };
  }

  async changePassword(userId: string, input: { currentPassword: string; newPassword: string }) {
    const user = await this.users.findById(userId);
    const ok = await bcrypt.compare(input.currentPassword, user?.passwordHash || '');
    if (!ok) throw new ForbiddenException('Current password incorrect');
    const passwordHash = await bcrypt.hash(input.newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    // revoke all refresh tokens
    await this.prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
    return { ok: true };
  }

  async history(userId: string) {
    const items = await this.prisma.authAttempt.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20 });
    return { items };
  }
}
