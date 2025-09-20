import { OnModuleInit, Logger, UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { WsJwtGuard } from '../modules/auth/guards/ws-jwt.guard';

@UseGuards(WsJwtGuard)
@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class EventsGateway implements OnModuleInit {
  private readonly logger = new Logger(EventsGateway.name);
  
  @WebSocketServer()
  server!: Server;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  private getClientUser(client: Socket): any {
    return client?.data?.user ?? null;
  }

  private isPrivileged(user: any): boolean {
    const roles: string[] = Array.isArray(user?.roles) ? user.roles : [];
    return roles.some((role) => ['admin', 'manager', 'technician'].includes(role));
  }

  private deny(client: Socket, message: string) {
    this.logger.warn(`Unauthorized socket access (${message}) from client ${client.id}`);
    client.emit('error', { message });
  }

  // For testing socket connection
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    this.logger.debug(`Received ping from client ${client.id}`);
    client.emit('pong', { 
      received: data, 
      serverTime: new Date().toISOString(),
      clientId: client.id
    });
  }
  
  // Handle client-side ticket creation fallback
  @SubscribeMessage('ticket:created:client')
  async handleClientTicketCreated(@ConnectedSocket() client: Socket, @MessageBody() ticket: any) {
    this.logger.debug(`Received client-side ticket creation notification from client ${client.id}`);
    const user = this.getClientUser(client);
    if (!user) {
      this.deny(client, 'Authentication required for ticket creation events');
      return;
    }
    
    // Verify the ticket exists in database to prevent fake events
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
      
      // Only allow the ticket owner or privileged users to broadcast
      if (!this.isPrivileged(user) && dbTicket.customerId !== user.sub) {
        this.deny(client, 'Not authorized to broadcast this ticket event');
        return;
      }
      
      // Broadcast the validated ticket to proper rooms
      this.emitTicketCreated(dbTicket);
      
    } catch (error) {
      this.logger.error(`Error processing client ticket creation: ${error.message}`);
      client.emit('error', { message: 'Failed to process ticket creation event' });
    }
  }
  
  // For testing notifications
  @SubscribeMessage('test:notification')
  handleTestNotification(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
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
    
    // Create a test notification
    const notification = {
      id: `test-${Date.now()}`,
      userId: targetUserId,
      type: 'TEST_NOTIFICATION',
      message: data.message || 'This is a test notification',
      createdAt: new Date().toISOString(),
      read: false
    };
    
    // Emit the notification
    this.emitNotification(notification);
    
    // Also send back a confirmation
    client.emit('test:notification:sent', { 
      success: true,
      notification
    });
  }

  @SubscribeMessage('join-ticket')
  async handleJoinTicket(@ConnectedSocket() client: Socket, @MessageBody() data: { ticketId: string }) {
    if (!data?.ticketId) return;
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

  @SubscribeMessage('leave-ticket')
  handleLeaveTicket(@ConnectedSocket() client: Socket, @MessageBody() data: { ticketId: string }) {
    if (data?.ticketId) client.leave(`ticket:${data.ticketId}`);
  }

  @SubscribeMessage('join-admin')
  handleJoinAdmin(@ConnectedSocket() client: Socket) {
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

  @SubscribeMessage('leave-admin')
  handleLeaveAdmin(@ConnectedSocket() client: Socket) {
    client.leave('admin');
  }

  @SubscribeMessage('join-user')
  handleJoinUser(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
    if (!data?.userId) return;
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

  @SubscribeMessage('leave-user')
  handleLeaveUser(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
    if (data?.userId) client.leave(`user:${data.userId}`);
  }

  emitTicketMessage(ticketId: string, message: any) {
    this.server.to(`ticket:${ticketId}`).emit('ticket:message', message);
  }

  emitTicketUpdate(ticketId: string, payload?: any) {
    const data = { ticketId, ...(payload || {}) };
    this.server.to(`ticket:${ticketId}`).emit('ticket:update', data);
    this.server.to('admin').emit('ticket:updated', data);
    if (payload?.customerId) {
      this.server.to(`user:${payload.customerId}`).emit('ticket:update', data);
    }
  }

  emitTicketSession(ticketId: string, payload?: any) {
    this.server.to(`ticket:${ticketId}`).emit('ticket:session', payload || {});
  }

  emitTicketCreated(ticket: { id: string; customerId?: string | null } | string) {
    const ticketId = typeof ticket === 'string' ? ticket : ticket?.id;
    if (!ticketId) return;
    
    let payload: any;
    
    // If we have the full ticket object, use it
    if (typeof ticket !== 'string') {
      payload = ticket;
    } else {
      // Otherwise just use the ID
      payload = { ticketId };
    }
    
    // Log the emission for debugging
    this.logger.debug(`Emitting ticket:created event for ticket ${ticketId}`);
    
    // Emit to admin room
    this.server.to('admin').emit('ticket:created', payload);
    
    // Emit to customer's room if available
    if (typeof ticket !== 'string' && ticket?.customerId) {
      this.server.to(`user:${ticket.customerId}`).emit('ticket:created', payload);
    }
  }

  emitTicketDeleted(ticketId: string, payload?: any) {
    if (!ticketId) return;
    const data = { ticketId, ...(payload || {}) };
    this.server.to(`ticket:${ticketId}`).emit('ticket:deleted', data);
    this.server.to('admin').emit('ticket:deleted', data);
    if (payload?.customerId) {
      this.server.to(`user:${payload.customerId}`).emit('ticket:deleted', data);
    }
  }

  emitAppointmentUpsert(appointment: any) {
    if (!appointment) return;
    this.server.to('admin').emit('appointment:upsert', appointment);
    const customerId = appointment?.ticket?.customerId;
    if (customerId) {
      this.server.to(`user:${customerId}`).emit('appointment:update', appointment);
    }
  }

  emitNotification(notification: { userId?: string | null }) {
    if (!notification) return;
    const room = notification.userId ? `user:${notification.userId}` : 'admin';
    this.server.to(room).emit('notification:new', notification);
  }
}
