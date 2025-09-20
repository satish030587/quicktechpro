import { PrismaService } from '../../prisma/prisma.service';
export declare class ReportsController {
    private prisma;
    constructor(prisma: PrismaService);
    summary(from?: string, to?: string): Promise<{
        tickets: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.TicketGroupByOutputType, "status"[]> & {
            _count: number;
        })[];
        payments: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PaymentGroupByOutputType, "status"[]> & {
            _sum: {
                amount: import("@prisma/client/runtime/library").Decimal | null;
            };
        })[];
        invoices: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.InvoiceGroupByOutputType, "status"[]> & {
            _sum: {
                total: import("@prisma/client/runtime/library").Decimal | null;
            };
        })[];
    }>;
}
