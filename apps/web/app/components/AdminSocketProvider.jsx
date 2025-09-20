"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getSocket } from '../lib/socket';

const AdminSocketContext = createContext({
  socket: null,
  status: 'idle',
  events: [],
  lastEvent: null,
  reconnect: () => {},
  joinTicket: () => {},
  leaveTicket: () => {},
});

export function useAdminSocket() {
  return useContext(AdminSocketContext);
}

export default function AdminSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('idle');
  const [events, setEvents] = useState([]);

  const trackEvent = useCallback((type, payload) => {
    setEvents((prev) => {
      const entry = { type, payload, at: new Date().toISOString() };
      const next = [entry, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  useEffect(() => {
    const instance = getSocket();
    if (!instance || typeof instance.on !== 'function') {
      setStatus('unavailable');
      return;
    }

    setSocket(instance);
    setStatus(instance.connected ? 'connected' : 'connecting');

    const handleConnect = () => {
      setStatus('connected');
      trackEvent('connect');
      instance.emit?.('join-admin');
    };

    const handleDisconnect = (reason) => {
      setStatus('disconnected');
      trackEvent('disconnect', { reason });
    };

    const handleReconnect = (attempts) => {
      setStatus('connected');
      trackEvent('reconnect', { attempts });
      instance.emit?.('join-admin');
    };

    const handleError = (error) => {
      const message = error?.message || 'Realtime connection error';
      setStatus('error');
      trackEvent('error', { message });
      toast.error(message, { id: 'admin-socket-error' });
    };

    const observedEvents = [
      ['ticket:created', (payload) => trackEvent('ticket:created', payload)],
      ['ticket:updated', (payload) => trackEvent('ticket:updated', payload)],
      ['ticket:deleted', (payload) => trackEvent('ticket:deleted', payload)],
      ['ticket:message', (payload) => trackEvent('ticket:message', payload)],
      ['ticket:session', (payload) => trackEvent('ticket:session', payload)],
      ['appointment:upsert', (payload) => trackEvent('appointment:upsert', payload)],
      ['notification:new', (payload) => trackEvent('notification:new', payload)],
      ['error', handleError],
    ];

    instance.on('connect', handleConnect);
    instance.on('disconnect', handleDisconnect);
    instance.on('reconnect', handleReconnect);
    instance.on('connect_error', handleError);

    observedEvents.forEach(([eventName, handler]) => instance.on(eventName, handler));

    if (instance.connected) {
      handleConnect();
    } else {
      setStatus('connecting');
    }

    return () => {
      instance.emit?.('leave-admin');
      instance.off('connect', handleConnect);
      instance.off('disconnect', handleDisconnect);
      instance.off('reconnect', handleReconnect);
      instance.off('connect_error', handleError);
      observedEvents.forEach(([eventName, handler]) => instance.off(eventName, handler));
    };
  }, [trackEvent]);

  const reconnect = useCallback(() => {
    if (!socket) return;
    try {
      setStatus('connecting');
      socket.connect();
    } catch (error) {
      toast.error(error?.message || 'Failed to reconnect socket');
    }
  }, [socket]);

  const joinTicket = useCallback(
    (ticketId) => {
      if (!socket || !ticketId) return;
      socket.emit?.('join-ticket', { ticketId });
    },
    [socket]
  );

  const leaveTicket = useCallback(
    (ticketId) => {
      if (!socket || !ticketId) return;
      socket.emit?.('leave-ticket', { ticketId });
    },
    [socket]
  );

  const value = useMemo(
    () => ({
      socket,
      status,
      events,
      lastEvent: events[0] || null,
      reconnect,
      joinTicket,
      leaveTicket,
    }),
    [socket, status, events, reconnect, joinTicket, leaveTicket]
  );

  return <AdminSocketContext.Provider value={value}>{children}</AdminSocketContext.Provider>;
}
