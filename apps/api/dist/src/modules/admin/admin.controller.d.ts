import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminController {
    private prisma;
    constructor(prisma: PrismaService);
    summary(): Promise<{
        users: number;
        tickets: any;
        invoices: any;
        payments: any;
    }>;
    listUsers(): Promise<{
        items: {
            id: string;
            email: string;
            roles: string[];
        }[];
    }>;
    promote(body: {
        email: string;
        role: string;
    }): Promise<{
        ok: boolean;
        message: string;
    } | {
        ok: boolean;
        message?: undefined;
    }>;
}
