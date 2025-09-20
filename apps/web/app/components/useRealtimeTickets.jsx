"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";

/**
 * useRealtimeTickets - Hook for listening to real-time ticket events
 * @param {Object} options - Callback functions for ticket events
 * @param {Function} options.onTicketCreated - Called when a new ticket is created
 * @param {Function} options.onTicketUpdated - Called when a ticket is updated
 * @param {Function} options.onTicketDeleted - Called when a ticket is deleted
 */
export default function useRealtimeTickets({ onTicketCreated, onTicketUpdated, onTicketDeleted } = {}) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

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
      const id = payload?.id || payload;
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
      socket.off("ticket:created", handleTicketCreated);
      socket.off("ticket:updated", handleTicketUpdated);
      socket.off("ticket:deleted", handleTicketDeleted);
    };
  }, [onTicketCreated, onTicketUpdated, onTicketDeleted]);
}