import { PrismaService } from '../../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): import(".prisma/client").Prisma.Prisma__UserClient<({
        roles: ({
            role: {
                id: number;
                name: string;
            };
        } & {
            userId: string;
            roleId: number;
        })[];
        totpSecret: {
            userId: string;
            secret: string;
            enabled: boolean;
            verifiedAt: Date | null;
        } | null;
    } & {
        id: string;
        email: string;
        emailVerified: Date | null;
        phone: string | null;
        name: string | null;
        passwordHash: string;
        isActive: boolean;
        marketingEmailOptIn: boolean;
        marketingSmsOptIn: boolean;
        privacyAcceptedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findById(id: string): import(".prisma/client").Prisma.Prisma__UserClient<({
        roles: ({
            role: {
                id: number;
                name: string;
            };
        } & {
            userId: string;
            roleId: number;
        })[];
        totpSecret: {
            userId: string;
            secret: string;
            enabled: boolean;
            verifiedAt: Date | null;
        } | null;
    } & {
        id: string;
        email: string;
        emailVerified: Date | null;
        phone: string | null;
        name: string | null;
        passwordHash: string;
        isActive: boolean;
        marketingEmailOptIn: boolean;
        marketingSmsOptIn: boolean;
        privacyAcceptedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    createUser(data: {
        email: string;
        passwordHash: string;
        name?: string;
        defaultRole?: string;
    }): Promise<{
        roles: ({
            role: {
                id: number;
                name: string;
            };
        } & {
            userId: string;
            roleId: number;
        })[];
    } & {
        id: string;
        email: string;
        emailVerified: Date | null;
        phone: string | null;
        name: string | null;
        passwordHash: string;
        isActive: boolean;
        marketingEmailOptIn: boolean;
        marketingSmsOptIn: boolean;
        privacyAcceptedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
