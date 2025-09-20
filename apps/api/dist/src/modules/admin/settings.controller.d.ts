import { PrismaService } from '../../prisma/prisma.service';
export declare class SettingsController {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{
        settings: {
            key: string;
            value: string;
            updatedAt: Date;
        }[];
        integrations: {
            id: string;
            key: string;
            jsonValue: import(".prisma/client").Prisma.JsonValue;
            updatedAt: Date;
        }[];
    }>;
    upsert(body: {
        settings?: {
            key: string;
            value: string;
        }[];
        integrations?: {
            key: string;
            jsonValue: any;
        }[];
    }): Promise<{
        ok: boolean;
    }>;
}
