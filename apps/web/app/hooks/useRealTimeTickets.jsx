"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAuth } from "../providers";

/**
 * useRealTimeTickets - Hook for listening to real-time ticket events
 * @param {Object} options - Callback functions for ticket events
 * @param {Function} options.onTicketCreated - Called when a new ticket is created
 * @param {Function} options.onTicketUpdated - Called when a ticket is updated
 * @param {Function} options.onTicketDeleted - Called when a ticket is deleted
 * @param {boolean} options.joinRooms - Whether to join ticket-related rooms (default: true)
 */
export default function useRealTimeTickets({ 
  onTicketCreated, 
  onTicketUpdated, 
  onTicketDeleted,
  joinRooms = true
} = {}) {
  const { user } = useAuth();
  
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Join appropriate rooms based on user role
    if (joinRooms && user) {
      const isAdmin = user.roles && (
        user.roles.includes('admin') || 
        user.roles.includes('manager') || 
        user.roles.includes('technician')
      );
      
      if (isAdmin) {
        console.log('Joining admin room for ticket events');
        socket.emit('join-admin');
      }
      
      if (user.id) {
        console.log(`Joining user room (${user.id}) for ticket events`);
        socket.emit('join-user', { userId: user.id });
      }
    }

    const handleTicketCreated = (ticket) => {
      console.log('Ticket created received:', ticket);
      try {
        onTicketCreated && onTicketCreated(ticket);
      } catch (err) {
        console.error('Error handling ticket:created', err);
      }
    };

    const handleTicketUpdated = (ticket) => {
      console.log('Ticket updated received:', ticket);
      try {
        onTicketUpdated && onTicketUpdated(ticket);
      } catch (err) {
        console.error('Error handling ticket:updated', err);
      }
    };

    const handleTicketDeleted = (payload) => {
      const id = payload?.id || payload?.ticketId || payload;
      console.log('Ticket deleted received:', id);
      try {
        onTicketDeleted && onTicketDeleted(id);
      } catch (err) {
        console.error('Error handling ticket:deleted', err);
      }
    };

    // Listen for ticket events
    socket.on("ticket:created", handleTicketCreated);
    socket.on("ticket:updated", handleTicketUpdated);
    socket.on("ticket:deleted", handleTicketDeleted);

    return () => {
      // Leave rooms when unmounting
      if (joinRooms && user) {
        const isAdmin = user.roles && (
          user.roles.includes('admin') || 
          user.roles.includes('manager') || 
          user.roles.includes('technician')
        );
        
        if (isAdmin) {
          socket.emit('leave-admin');
        }
        
        if (user.id) {
          socket.emit('leave-user', { userId: user.id });
        }
      }
      
      // Unsubscribe from events
      socket.off("ticket:created", handleTicketCreated);
      socket.off("ticket:updated", handleTicketUpdated);
      socket.off("ticket:deleted", handleTicketDeleted);
    };
  }, [onTicketCreated, onTicketUpdated, onTicketDeleted, joinRooms, user]);
}