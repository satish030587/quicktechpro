import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AuthService {
    private users;
    private prisma;
    private jwt;
    constructor(users: UsersService, prisma: PrismaService, jwt: JwtService);
    register(input: {
        email: string;
        password: string;
        name?: string;
        phone?: string;
        acceptPrivacy: boolean;
        marketingEmailOptIn?: boolean;
        marketingSmsOptIn?: boolean;
    }): Promise<{
        id: string;
        email: string;
    }>;
    private signAccess;
    private issueRefresh;
    private recordAttempt;
    login(input: {
        email: string;
        password: string;
        remember?: boolean;
        captcha?: string;
    }, ctx?: {
        userAgent?: string;
        ip?: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        tfaEnabled: boolean;
    }>;
    refresh(input: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
    }>;
    logout(input: {
        refreshToken?: string;
        userId?: string;
    }): Promise<{
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
    requestPasswordReset(email: string): Promise<{
        ok: boolean;
    }>;
    resetPassword(input: {
        token: string;
        newPassword: string;
    }): Promise<{
        ok: boolean;
    }>;
    verifyEmail(input: {
        token: string;
    }): Promise<{
        ok: boolean;
    }>;
    resendVerification(email: string): Promise<{
        ok: boolean;
    }>;
    setup2FA(userId: string): Promise<{
        otpauthUrl: any;
        base32: any;
    }>;
    verify2FA(userId: string, token: string): Promise<{
        enabled: boolean;
        accessToken: string;
    }>;
    disable2FA(userId: string): Promise<{
        enabled: boolean;
        accessToken: string;
    }>;
    generateRecoveryCodes(userId: string): Promise<{
        codes: string[];
    }>;
    verifyRecoveryCode(userId: string, code: string): Promise<{
        ok: boolean;
    }>;
    changePassword(userId: string, input: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        ok: boolean;
    }>;
    history(userId: string): Promise<{
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
