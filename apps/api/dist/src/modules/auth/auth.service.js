"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto = require("crypto");
const speakeasy = require("speakeasy");
function hashToken(raw) {
    return crypto.createHash('sha256').update(raw).digest('hex');
}
let AuthService = class AuthService {
    constructor(users, prisma, jwt) {
        this.users = users;
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(input) {
        if (!input.acceptPrivacy)
            throw new common_1.BadRequestException('Privacy policy must be accepted');
        if (!/[A-Za-z]/.test(input.password) || !/[0-9]/.test(input.password)) {
            throw new common_1.BadRequestException('Password must include letters and numbers');
        }
        const existing = await this.users.findByEmail(input.email);
        if (existing)
            throw new common_1.BadRequestException('Email already registered');
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
        const raw = crypto.randomBytes(32).toString('hex');
        await this.prisma.verificationToken.create({
            data: {
                userId: user.id,
                tokenHash: hashToken(raw),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
            }
        });
        return { id: user.id, email: user.email };
    }
    signAccess(user) {
        const roles = (user.roles || []).map((r) => r.role?.name || r.name).filter(Boolean);
        const tfa = Boolean(user.totpSecret?.enabled);
        return this.jwt.sign({ sub: user.id, email: user.email, roles, tfa });
    }
    async issueRefresh(userId, ctx) {
        const raw = crypto.randomBytes(48).toString('hex');
        const tokenHash = hashToken(raw);
        await this.prisma.refreshToken.create({
            data: {
                userId,
                tokenHash,
                userAgent: ctx?.userAgent,
                ip: ctx?.ip,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
            }
        });
        return raw;
    }
    async recordAttempt(params) {
        await this.prisma.authAttempt.create({ data: { email: params.email, userId: params.userId, success: params.success, ip: params.ip, userAgent: params.userAgent } });
    }
    async login(input, ctx) {
        const now = new Date();
        const windowMs = 15 * 60 * 1000;
        const since = new Date(now.getTime() - windowMs);
        const recentFails = await this.prisma.authAttempt.count({ where: { email: input.email, success: false, createdAt: { gt: since } } });
        const captchaRequired = recentFails >= 5;
        if (captchaRequired && !input.captcha) {
            throw new common_1.UnauthorizedException('CAPTCHA required');
        }
        const user = await this.users.findByEmail(input.email);
        if (!user) {
            await this.recordAttempt({ email: input.email, success: false, ip: ctx?.ip, userAgent: ctx?.userAgent });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive)
            throw new common_1.ForbiddenException('Account is deactivated');
        const ok = await bcrypt.compare(input.password, user.passwordHash);
        await this.recordAttempt({ email: input.email, userId: user.id, success: ok, ip: ctx?.ip, userAgent: ctx?.userAgent });
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if ((process.env.ENFORCE_EMAIL_VERIFIED || 'false').toLowerCase() === 'true') {
            if (!user.emailVerified) {
                throw new common_1.ForbiddenException('Email not verified. Please verify your email.');
            }
        }
        const accessToken = this.signAccess(user);
        const refreshToken = await this.issueRefresh(user.id, ctx);
        return { accessToken, refreshToken, tfaEnabled: Boolean(user.totpSecret?.enabled) };
    }
    async refresh(input) {
        const tokenHash = hashToken(input.refreshToken);
        const rec = await this.prisma.refreshToken.findFirst({ where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } } });
        if (!rec)
            throw new common_1.UnauthorizedException('Invalid refresh token');
        const user = await this.users.findById(rec.userId);
        const accessToken = this.signAccess(user);
        return { accessToken };
    }
    async logout(input) {
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
    async requestPasswordReset(email) {
        const user = await this.users.findByEmail(email);
        if (!user)
            return { ok: true };
        const raw = crypto.randomBytes(32).toString('hex');
        await this.prisma.passwordResetToken.create({
            data: { userId: user.id, tokenHash: hashToken(raw), expiresAt: new Date(Date.now() + 1000 * 60 * 30) }
        });
        return { ok: true };
    }
    async resetPassword(input) {
        const rec = await this.prisma.passwordResetToken.findFirst({ where: { tokenHash: hashToken(input.token), usedAt: null, expiresAt: { gt: new Date() } } });
        if (!rec)
            throw new common_1.BadRequestException('Invalid or expired token');
        const passwordHash = await bcrypt.hash(input.newPassword, 10);
        await this.prisma.user.update({ where: { id: rec.userId }, data: { passwordHash } });
        await this.prisma.passwordResetToken.update({ where: { id: rec.id }, data: { usedAt: new Date() } });
        return { ok: true };
    }
    async verifyEmail(input) {
        const rec = await this.prisma.verificationToken.findFirst({ where: { tokenHash: hashToken(input.token), usedAt: null, expiresAt: { gt: new Date() } } });
        if (!rec)
            throw new common_1.BadRequestException('Invalid or expired token');
        await this.prisma.user.update({ where: { id: rec.userId }, data: { emailVerified: new Date() } });
        await this.prisma.verificationToken.update({ where: { id: rec.id }, data: { usedAt: new Date() } });
        return { ok: true };
    }
    async resendVerification(email) {
        const user = await this.users.findByEmail(email);
        if (!user)
            return { ok: true };
        if (user.emailVerified)
            return { ok: true };
        const raw = crypto.randomBytes(32).toString('hex');
        await this.prisma.verificationToken.create({ data: { userId: user.id, tokenHash: hashToken(raw), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) } });
        return { ok: true };
    }
    async setup2FA(userId) {
        const secret = speakeasy.generateSecret({ name: 'QuickTechPro' });
        await this.prisma.totpSecret.upsert({
            where: { userId },
            update: { secret: secret.base32, enabled: false },
            create: { userId, secret: secret.base32, enabled: false }
        });
        return { otpauthUrl: secret.otpauth_url, base32: secret.base32 };
    }
    async verify2FA(userId, token) {
        const rec = await this.prisma.totpSecret.findUnique({ where: { userId } });
        if (!rec)
            throw new common_1.BadRequestException('No 2FA setup');
        const ok = speakeasy.totp.verify({ secret: rec.secret, encoding: 'base32', token, window: 2 });
        if (!ok)
            throw new common_1.ForbiddenException('Invalid 2FA token');
        await this.prisma.totpSecret.update({ where: { userId }, data: { enabled: true, verifiedAt: new Date() } });
        const user = await this.users.findById(userId);
        const accessToken = this.signAccess(user);
        return { enabled: true, accessToken };
    }
    async disable2FA(userId) {
        await this.prisma.totpSecret.delete({ where: { userId } }).catch(() => { });
        const user = await this.users.findById(userId);
        const accessToken = this.signAccess(user);
        return { enabled: false, accessToken };
    }
    async generateRecoveryCodes(userId) {
        const codes = Array.from({ length: 8 }).map(() => crypto.randomBytes(5).toString('hex'));
        await this.prisma.totpRecoveryCode.deleteMany({ where: { userId } });
        await this.prisma.totpRecoveryCode.createMany({ data: codes.map(c => ({ userId, codeHash: hashToken(c) })) });
        return { codes };
    }
    async verifyRecoveryCode(userId, code) {
        const rec = await this.prisma.totpRecoveryCode.findFirst({ where: { userId, codeHash: hashToken(code), usedAt: null } });
        if (!rec)
            throw new common_1.ForbiddenException('Invalid recovery code');
        await this.prisma.totpRecoveryCode.update({ where: { id: rec.id }, data: { usedAt: new Date() } });
        return { ok: true };
    }
    async changePassword(userId, input) {
        const user = await this.users.findById(userId);
        const ok = await bcrypt.compare(input.currentPassword, user?.passwordHash || '');
        if (!ok)
            throw new common_1.ForbiddenException('Current password incorrect');
        const passwordHash = await bcrypt.hash(input.newPassword, 10);
        await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
        await this.prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
        return { ok: true };
    }
    async history(userId) {
        const items = await this.prisma.authAttempt.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20 });
        return { items };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map