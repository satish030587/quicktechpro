"use client";

import { useEffect, useState } from 'react';
import { getSocket } from '../lib/socket';

/**
 * Shared hook to wire ticket-related socket events into React components.
 * Consumers provide the callbacks they need; the hook handles wiring and cleanup.
 */
export default function useRealTimeTickets({
  onTicketCreated,
  onTicketUpdated,
  onTicketDeleted,
} = {}) {
  const [socketReadyTick, setSocketReadyTick] = useState(0);

  useEffect(() => {
    const socket = getSocket();
    if (!socket?.io) {
      const retry = setTimeout(() => setSocketReadyTick((tick) => tick + 1), 500);
      return () => clearTimeout(retry);
    }

    const handleCreated = (payload) => {
      if (typeof onTicketCreated === 'function') {
        onTicketCreated(payload);
      }
    };

    const handleUpdated = (payload) => {
      if (typeof onTicketUpdated === 'function') {
        onTicketUpdated(payload);
      }
    };

    const handleDeleted = (payload) => {
      if (typeof onTicketDeleted === 'function') {
        onTicketDeleted(payload);
      }
    };

    if (onTicketCreated) {
      socket.on('ticket:created', handleCreated);
    }

    if (onTicketUpdated) {
      socket.on('ticket:update', handleUpdated);
      socket.on('ticket:updated', handleUpdated);
    }

    if (onTicketDeleted) {
      socket.on('ticket:deleted', handleDeleted);
    }

    return () => {
      if (onTicketCreated) {
        socket.off('ticket:created', handleCreated);
      }
      if (onTicketUpdated) {
        socket.off('ticket:update', handleUpdated);
        socket.off('ticket:updated', handleUpdated);
      }
      if (onTicketDeleted) {
        socket.off('ticket:deleted', handleDeleted);
      }
    };
  }, [onTicketCreated, onTicketUpdated, onTicketDeleted, socketReadyTick]);
}
