import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../realtime/events.gateway';
import { Response } from 'express';
export declare class PaymentsController {
    private prisma;
    private realtime;
    constructor(prisma: PrismaService, realtime: EventsGateway);
    config(): Promise<{
        keyId: any;
    }>;
    createOrder(req: any, body: {
        invoiceId: string;
    }): Promise<{
        order: any;
        invoiceNumber: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
    }>;
    verify(req: any, body: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<{
        ok: boolean;
        ticketId: string;
    }>;
    remoteOrder(req: any, body: {
        plan: 'BASIC' | 'ADVANCED' | 'PREMIUM';
        title?: string;
        details?: string;
    }): Promise<{
        order: any;
        keyId: any;
        invoiceId: string;
        paymentId: string;
    }>;
    webhook(signature: string, body: any, res: Response): Promise<Response<any, Record<string, any>>>;
    private newTicketCode;
    private newInvoiceNumber;
}
