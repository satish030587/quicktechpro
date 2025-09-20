"use client";
import { useState, useEffect } from 'react';
import { getSocket } from '../lib/socket';
import { useAuth } from '../providers';

/**
 * WhatsApp-style unread conversation indicators
 * Shows dots/counts for unread tickets, chats, appointments
 * 
 * @param {Object} options Configuration options
 * @param {boolean} options.appointments Track appointment updates
 * @param {boolean} options.tickets Track ticket updates
 * @param {boolean} options.chats Track chat/message updates
 * @returns {Object} Unread state and functions to manipulate it
 */
export default function useUnreadIndicators({ 
  appointments = true, 
  tickets = true, 
  chats = true 
} = {}) {
  const { user } = useAuth();
  // Per-conversation unread state
  const [unreadItems, setUnreadItems] = useState({
    tickets: {}, // { ticketId: count }
    appointments: {}, // { appointmentId: true }
    chats: {}, // { conversationId: count }
  });
  // Highlighted items that received recent updates
  const [highlightedItems, setHighlightedItems] = useState({
    tickets: new Set(), // Set of ticketIds
    appointments: new Set(), // Set of appointmentIds
    chats: new Set(), // Set of conversationIds
  });

  // Totals across all conversations (used for primary nav badges)
  const unreadCounts = {
    tickets: Object.keys(unreadItems.tickets).length,
    appointments: Object.keys(unreadItems.appointments).length,
    chats: Object.keys(unreadItems.chats).length,
    total: Object.keys(unreadItems.tickets).length + 
           Object.keys(unreadItems.appointments).length + 
           Object.keys(unreadItems.chats).length
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?.id) return;

    // Join rooms based on user
    const isAdmin = user.roles?.some(role => 
      ['admin', 'manager', 'technician'].includes(role));
    
    if (isAdmin) {
      socket.emit('join-admin');
    }
    socket.emit('join-user', { userId: user.id });

    // Highlight an item temporarily with visual indicator
    const highlightItem = (type, id) => {
      if (!id) return;
      setHighlightedItems(prev => {
        const newState = { ...prev };
        newState[type] = new Set(prev[type]).add(id);
        return newState;
      });
      
      // Clear highlight after animation duration
      setTimeout(() => {
        setHighlightedItems(prev => {
          const newState = { ...prev };
          const updatedSet = new Set(prev[type]);
          updatedSet.delete(id);
          newState[type] = updatedSet;
          return newState;
        });
      }, 6000);
    };

    // Handle ticket creation
    const handleTicketCreated = (payload) => {
      const ticketId = payload?.id || payload?.ticketId;
      if (!ticketId) return;
      
      // Only mark unread if relevant to this user
      const isForUser = !payload.customerId || payload.customerId === user.id;
      const isAdminView = isAdmin;
      
      if (tickets && (isForUser || isAdminView)) {
        setUnreadItems(prev => ({
          ...prev,
          tickets: { ...prev.tickets, [ticketId]: (prev.tickets[ticketId] || 0) + 1 }
        }));
        highlightItem('tickets', ticketId);
      }
    };

    // Handle ticket updates
    const handleTicketUpdated = (payload) => {
      const ticketId = payload?.id || payload?.ticketId;
      if (!ticketId) return;
      
      if (tickets) {
        setUnreadItems(prev => ({
          ...prev,
          tickets: { ...prev.tickets, [ticketId]: (prev.tickets[ticketId] || 0) + 1 }
        }));
        highlightItem('tickets', ticketId);
      }
    };

    // Handle new ticket messages/chats
    const handleTicketMessage = (payload) => {
      const ticketId = payload?.ticketId;
      const fromUserId = payload?.fromUserId || payload?.userId;
      
      // Don't mark as unread if the message is from the current user
      if (!ticketId || fromUserId === user.id) return;
      
      if (chats) {
        setUnreadItems(prev => ({
          ...prev,
          chats: { ...prev.chats, [ticketId]: (prev.chats[ticketId] || 0) + 1 }
        }));
        highlightItem('chats', ticketId);
      }
    };

    // Handle appointment updates
    const handleAppointmentUpdate = (payload) => {
      const appointmentId = payload?.id || payload?.appointmentId;
      const ticketId = payload?.ticketId;
      
      if (appointmentId && appointments) {
        setUnreadItems(prev => ({
          ...prev,
          appointments: { ...prev.appointments, [appointmentId]: true }
        }));
        highlightItem('appointments', appointmentId);
      }
      
      if (ticketId && tickets) {
        setUnreadItems(prev => ({
          ...prev,
          tickets: { ...prev.tickets, [ticketId]: (prev.tickets[ticketId] || 0) + 1 }
        }));
      }
    };

    // Listen for events
    if (tickets) {
      socket.on('ticket:created', handleTicketCreated);
      socket.on('ticket:updated', handleTicketUpdated);
    }
    
    if (chats) {
      socket.on('ticket:message', handleTicketMessage);
    }
    
    if (appointments) {
      socket.on('appointment:created', handleAppointmentUpdate);
      socket.on('appointment:updated', handleAppointmentUpdate);
    }

    return () => {
      // Clean up event listeners
      if (tickets) {
        socket.off('ticket:created', handleTicketCreated);
        socket.off('ticket:updated', handleTicketUpdated);
      }
      
      if (chats) {
        socket.off('ticket:message', handleTicketMessage);
      }
      
      if (appointments) {
        socket.off('appointment:created', handleAppointmentUpdate);
        socket.off('appointment:updated', handleAppointmentUpdate);
      }
      
      // Leave rooms
      if (isAdmin) {
        socket.emit('leave-admin');
      }
      socket.emit('leave-user', { userId: user.id });
    };
  }, [user?.id, user?.roles, tickets, appointments, chats]);

  // Mark a conversation as read
  const markAsRead = async (type, id) => {
    if (!id || !['tickets', 'appointments', 'chats'].includes(type)) return;
    
    // Optimistic update
    setUnreadItems(prev => {
      const newState = { ...prev };
      const typeState = { ...prev[type] };
      delete typeState[id];
      newState[type] = typeState;
      return newState;
    });
    
    // Remove from highlighted items if present
    setHighlightedItems(prev => {
      const newState = { ...prev };
      if (prev[type].has(id)) {
        const updatedSet = new Set(prev[type]);
        updatedSet.delete(id);
        newState[type] = updatedSet;
      }
      return newState;
    });
    
    // Emit read event to server
    try {
      const socket = getSocket();
      if (socket) {
        const eventName = type === 'chats' 
          ? 'ticket:message:read' 
          : `${type.slice(0, -1)}:read`;
        
        socket.emit(eventName, { 
          id, 
          userId: user?.id,
          [type === 'tickets' ? 'ticketId' : type === 'chats' ? 'conversationId' : 'appointmentId']: id
        });
      }
    } catch (error) {
      console.error(`Error marking ${type}:${id} as read`, error);
    }
  };

  // Check if a specific item is unread
  const isUnread = (type, id) => {
    if (!id || !['tickets', 'appointments', 'chats'].includes(type)) return false;
    return !!unreadItems[type][id];
  };
  
  // Check if a specific item is highlighted
  const isHighlighted = (type, id) => {
    if (!id || !['tickets', 'appointments', 'chats'].includes(type)) return false;
    return highlightedItems[type].has(id);
  };
  
  // Get unread count for a specific item
  const getUnreadCount = (type, id) => {
    if (!id || !['tickets', 'appointments', 'chats'].includes(type)) return 0;
    return unreadItems[type][id] || 0;
  };

  return {
    unreadCounts,
    unreadItems,
    highlightedItems,
    markAsRead,
    isUnread,
    isHighlighted,
    getUnreadCount
  };
}