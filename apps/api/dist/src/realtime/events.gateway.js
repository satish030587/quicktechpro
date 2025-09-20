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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EventsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const prisma_service_1 = require("../prisma/prisma.service");
const ws_jwt_guard_1 = require("../modules/auth/guards/ws-jwt.guard");
let EventsGateway = EventsGateway_1 = class EventsGateway {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(EventsGateway_1.name);
    }
    onModuleInit() {
        this.logger.log('WebSocket Gateway initialized');
    }
    getClientUser(client) {
        return client?.data?.user ?? null;
    }
    isPrivileged(user) {
        const roles = Array.isArray(user?.roles) ? user.roles : [];
        return roles.some((role) => ['admin', 'manager', 'technician'].includes(role));
    }
    deny(client, message) {
        this.logger.warn(`Unauthorized socket access (${message}) from client ${client.id}`);
        client.emit('error', { message });
    }
    handlePing(client, data) {
        this.logger.debug(`Received ping from client ${client.id}`);
        client.emit('pong', {
            received: data,
            serverTime: new Date().toISOString(),
            clientId: client.id
        });
    }
    async handleClientTicketCreated(client, ticket) {
        this.logger.debug(`Received client-side ticket creation notification from client ${client.id}`);
        const user = this.getClientUser(client);
        if (!user) {
            this.deny(client, 'Authentication required for ticket creation events');
            return;
        }
        try {
            const ticketId = ticket?.id;
            if (!ticketId) {
                this.deny(client, 'Invalid ticket data');
                return;
            }
            const dbTicket = await this.prisma.ticket.findUnique({
                where: { id: ticketId },
                select: {
                    id: true,
                    customerId: true,
                    assignedToId: true,
                    code: true,
                    title: true,
                    status: true,
                    type: true,
                    priority: true
                }
            });
            if (!dbTicket) {
                this.deny(client, `Ticket ${ticketId} not found in database`);
                return;
            }
            if (!this.isPrivileged(user) && dbTicket.customerId !== user.sub) {
                this.deny(client, 'Not authorized to broadcast this ticket event');
                return;
            }
            this.emitTicketCreated(dbTicket);
        }
        catch (error) {
            this.logger.error(`Error processing client ticket creation: ${error.message}`);
            client.emit('error', { message: 'Failed to process ticket creation event' });
        }
    }
    handleTestNotification(client, data) {
        this.logger.debug(`Received test notification request from client ${client.id}`);
        const user = this.getClientUser(client);
        if (!user) {
            this.deny(client, 'Authentication required for test notifications');
            return;
        }
        const targetUserId = data.userId || user.sub;
        if (!this.isPrivileged(user) && targetUserId !== user.sub) {
            this.deny(client, 'Not authorized to send notifications for other users');
            return;
        }
        const notification = {
            id: `test-${Date.now()}`,
            userId: targetUserId,
            type: 'TEST_NOTIFICATION',
            message: data.message || 'This is a test notification',
            createdAt: new Date().toISOString(),
            read: false
        };
        this.emitNotification(notification);
        client.emit('test:notification:sent', {
            success: true,
            notification
        });
    }
    async handleJoinTicket(client, data) {
        if (!data?.ticketId)
            return;
        const user = this.getClientUser(client);
        if (!user) {
            this.deny(client, 'Authentication required for ticket rooms');
            return;
        }
        if (this.isPrivileged(user)) {
            client.join(`ticket:${data.ticketId}`);
            return;
        }
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: data.ticketId },
            select: { customerId: true, assignedToId: true },
        });
        if (!ticket) {
            client.emit('error', { message: 'Ticket not found' });
            return;
        }
        if (ticket.customerId === user.sub || ticket.assignedToId === user.sub) {
            client.join(`ticket:${data.ticketId}`);
            return;
        }
        this.deny(client, `Access denied for ticket ${data.ticketId}`);
    }
    handleLeaveTicket(client, data) {
        if (data?.ticketId)
            client.leave(`ticket:${data.ticketId}`);
    }
    handleJoinAdmin(client) {
        const user = this.getClientUser(client);
        if (!user) {
            this.deny(client, 'Authentication required for admin room');
            return;
        }
        if (!this.isPrivileged(user)) {
            this.deny(client, 'Admin role required to join admin room');
            return;
        }
        client.join('admin');
    }
    handleLeaveAdmin(client) {
        client.leave('admin');
    }
    handleJoinUser(client, data) {
        if (!data?.userId)
            return;
        const user = this.getClientUser(client);
        if (!user) {
            this.deny(client, 'Authentication required for user room');
            return;
        }
        if (user.sub !== data.userId && !this.isPrivileged(user)) {
            this.deny(client, `Cannot join room for user ${data.userId}`);
            return;
        }
        client.join(`user:${data.userId}`);
    }
    handleLeaveUser(client, data) {
        if (data?.userId)
            client.leave(`user:${data.userId}`);
    }
    emitTicketMessage(ticketId, message) {
        this.server.to(`ticket:${ticketId}`).emit('ticket:message', message);
    }
    emitTicketUpdate(ticketId, payload) {
        const data = { ticketId, ...(payload || {}) };
        this.server.to(`ticket:${ticketId}`).emit('ticket:update', data);
        this.server.to('admin').emit('ticket:updated', data);
        if (payload?.customerId) {
            this.server.to(`user:${payload.customerId}`).emit('ticket:update', data);
        }
    }
    emitTicketSession(ticketId, payload) {
        this.server.to(`ticket:${ticketId}`).emit('ticket:session', payload || {});
    }
    emitTicketCreated(ticket) {
        const ticketId = typeof ticket === 'string' ? ticket : ticket?.id;
        if (!ticketId)
            return;
        let payload;
        if (typeof ticket !== 'string') {
            payload = ticket;
        }
        else {
            payload = { ticketId };
        }
        this.logger.debug(`Emitting ticket:created event for ticket ${ticketId}`);
        this.server.to('admin').emit('ticket:created', payload);
        if (typeof ticket !== 'string' && ticket?.customerId) {
            this.server.to(`user:${ticket.customerId}`).emit('ticket:created', payload);
        }
    }
    emitTicketDeleted(ticketId, payload) {
        if (!ticketId)
            return;
        const data = { ticketId, ...(payload || {}) };
        this.server.to(`ticket:${ticketId}`).emit('ticket:deleted', data);
        this.server.to('admin').emit('ticket:deleted', data);
        if (payload?.customerId) {
            this.server.to(`user:${payload.customerId}`).emit('ticket:deleted', data);
        }
    }
    emitAppointmentUpsert(appointment) {
        if (!appointment)
            return;
        this.server.to('admin').emit('appointment:upsert', appointment);
        const customerId = appointment?.ticket?.customerId;
        if (customerId) {
            this.server.to(`user:${customerId}`).emit('appointment:update', appointment);
        }
    }
    emitNotification(notification) {
        if (!notification)
            return;
        const room = notification.userId ? `user:${notification.userId}` : 'admin';
        this.server.to(room).emit('notification:new', notification);
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handlePing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ticket:created:client'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleClientTicketCreated", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('test:notification'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleTestNotification", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-ticket'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleJoinTicket", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-ticket'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLeaveTicket", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-admin'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleJoinAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-admin'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLeaveAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-user'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleJoinUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-user'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLeaveUser", null);
exports.EventsGateway = EventsGateway = EventsGateway_1 = __decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.WebSocketGateway)({ cors: { origin: true, credentials: true } }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map