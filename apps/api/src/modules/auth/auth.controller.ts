import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';

class RegisterDto {
  @IsEmail() email!: string;
  @MinLength(8) password!: string;
  @IsOptional() name?: string;
  @IsOptional() phone?: string;
  @IsNotEmpty() acceptPrivacy!: boolean;
  @IsOptional() marketingEmailOptIn?: boolean;
  @IsOptional() marketingSmsOptIn?: boolean;
}
class LoginDto {
  @IsEmail() email!: string;
  @IsNotEmpty() password!: string;
  remember?: boolean;
  captcha?: string;
}
class RefreshDto { @IsNotEmpty() refreshToken!: string; }
class ResetReqDto { @IsEmail() email!: string; }
class ResetDto { @IsNotEmpty() token!: string; @MinLength(8) newPassword!: string; }
class VerifyDto { @IsNotEmpty() token!: string; }
class TwoFaVerifyDto { @IsNotEmpty() token!: string; }

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: any) {
    return this.auth.login(dto, { userAgent: req.headers['user-agent'], ip: req.ip });
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto);
  }

  @Post('logout')
  logout(@Body() dto: Partial<RefreshDto>) {
    return this.auth.logout({ refreshToken: dto.refreshToken });
  }

  @Post('password/request-reset')
  requestReset(@Body() dto: ResetReqDto) {
    return this.auth.requestPasswordReset(dto.email);
  }

  @Post('password/reset')
  reset(@Body() dto: ResetDto) {
    return this.auth.resetPassword(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyDto) {
    return this.auth.verifyEmail(dto);
  }

  @Post('resend-verification')
  resendVerification(@Body() dto: ResetReqDto) {
    return this.auth.resendVerification(dto.email);
  }

  @UseGuards(JwtAccessGuard)
  @Post('2fa/setup')
  setup2FA(@Req() req: any) {
    return this.auth.setup2FA(req.user.sub);
  }

  @UseGuards(JwtAccessGuard)
  @Post('2fa/verify')
  verify2FA(@Req() req: any, @Body() dto: TwoFaVerifyDto) {
    return this.auth.verify2FA(req.user.sub, dto.token);
  }

  @UseGuards(JwtAccessGuard)
  @Post('2fa/disable')
  disable2FA(@Req() req: any) {
    return this.auth.disable2FA(req.user.sub);
  }

  @UseGuards(JwtAccessGuard)
  @Post('2fa/recovery-codes')
  recoveryCodes(@Req() req: any) {
    return this.auth.generateRecoveryCodes(req.user.sub);
  }

  @UseGuards(JwtAccessGuard)
  @Post('2fa/verify-recovery')
  verifyRecovery(@Req() req: any, @Body() dto: TwoFaVerifyDto) {
    return this.auth.verifyRecoveryCode(req.user.sub, dto.token);
  }

  @UseGuards(JwtAccessGuard)
  @Post('password/change')
  changePassword(@Req() req: any, @Body() dto: { currentPassword: string; newPassword: string }) {
    return this.auth.changePassword(req.user.sub, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Post('history')
  history(@Req() req: any) {
    return this.auth.history(req.user.sub);
  }
}
