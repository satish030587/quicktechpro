import { AuthService } from './auth.service';
declare class RegisterDto {
    email: string;
    password: string;
    name?: string;
    phone?: string;
    acceptPrivacy: boolean;
    marketingEmailOptIn?: boolean;
    marketingSmsOptIn?: boolean;
}
declare class LoginDto {
    email: string;
    password: string;
    remember?: boolean;
    captcha?: string;
}
declare class RefreshDto {
    refreshToken: string;
}
declare class ResetReqDto {
    email: string;
}
declare class ResetDto {
    token: string;
    newPassword: string;
}
declare class VerifyDto {
    token: string;
}
declare class TwoFaVerifyDto {
    token: string;
}
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
    }>;
    login(dto: LoginDto, req: any): Promise<{
        accessToken: string;
        refreshToken: string;
        tfaEnabled: boolean;
    }>;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
    }>;
    logout(dto: Partial<RefreshDto>): Promise<{
        revoked: number;
        revokedAll?: undefined;
        ok?: undefined;
    } | {
        revokedAll: boolean;
        revoked?: undefined;
        ok?: undefined;
    } | {
        ok: boolean;
        revoked?: undefined;
        revokedAll?: undefined;
    }>;
    requestReset(dto: ResetReqDto): Promise<{
        ok: boolean;
    }>;
    reset(dto: ResetDto): Promise<{
        ok: boolean;
    }>;
    verifyEmail(dto: VerifyDto): Promise<{
        ok: boolean;
    }>;
    resendVerification(dto: ResetReqDto): Promise<{
        ok: boolean;
    }>;
    setup2FA(req: any): Promise<{
        otpauthUrl: any;
        base32: any;
    }>;
    verify2FA(req: any, dto: TwoFaVerifyDto): Promise<{
        enabled: boolean;
        accessToken: string;
    }>;
    disable2FA(req: any): Promise<{
        enabled: boolean;
        accessToken: string;
    }>;
    recoveryCodes(req: any): Promise<{
        codes: string[];
    }>;
    verifyRecovery(req: any, dto: TwoFaVerifyDto): Promise<{
        ok: boolean;
    }>;
    changePassword(req: any, dto: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        ok: boolean;
    }>;
    history(req: any): Promise<{
        items: {
            id: string;
            userId: string | null;
            email: string | null;
            success: boolean;
            ip: string | null;
            userAgent: string | null;
            createdAt: Date;
        }[];
    }>;
}
export {};
