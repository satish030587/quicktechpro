"use client";
import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { getSocket } from '../lib/socket';
import { apiFetch } from '../lib/api';
import { toast } from 'react-hot-toast';

// Create a context to provide notification data to all child components
const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  refreshNotifications: () => {},
  lastUpdated: null,
  socketConnected: false,
  socketHealthy: true,
  lastHeartbeat: null,
});

export const useNotifications = () => useContext(NotificationContext);

// Helper function to get appropriate icon for notification type
const getNotificationIcon = (type) => {
  if (!type) return 'ðŸ””';
  
  const typeStr = type.toLowerCase();
  if (typeStr.includes('ticket')) return 'ðŸŽ«';
  if (typeStr.includes('error')) return 'âŒ';
  if (typeStr.includes('warning')) return 'âš ï¸';
  if (typeStr.includes('success')) return 'âœ…';
  if (typeStr.includes('payment')) return 'ðŸ’°';
  if (typeStr.includes('appointment')) return 'ðŸ“…';
  
  return 'ðŸ””'; // Default icon
};

export default function NotificationListener({ 
  children, 
  userId = null, 
  role = null,
  initialNotifications = []
}) {
  const [notifications, setNotifications] = useState(initialNotifications || []);
  const [unreadCount, setUnreadCount] = useState(
    initialNotifications?.filter(n => !n.read)?.length || 0
  );
  const [lastUpdated, setLastUpdated] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastHeartbeat, setLastHeartbeat] = useState(null);
  const [socketHealthy, setSocketHealthy] = useState(true);

  const isAdminRole = role === 'admin' || role === 'manager' || role === 'technician';

  // Function to mark a notification as read
  const markAsRead = useCallback(async (id) => {
    try {
      const endpoint = isAdminRole
        ? `/admin/notifications/${id}/read`
        : `/customer/notifications/${id}/read`;

      const response = await apiFetch(endpoint, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      let shouldDecrement = false;
      setNotifications(prev => {
        const updated = prev.map(n => {
          if (n.id === id) {
            if (!n.read) {
              shouldDecrement = true;
            }
            return { ...n, read: true };
          }
          return n;
        });
        return updated;
      });

      if (shouldDecrement) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [isAdminRole]);

  // Function to refresh notifications from the server
  const refreshNotifications = useCallback(async () => {
    try {
      const basePath = isAdminRole
        ? '/admin/notifications'
        : '/customer/notifications';

      const response = await apiFetch(basePath);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const items = data.items || [];

      setNotifications(items);
      const unreadItems = items.filter(n => !n.read);
      setUnreadCount(
        typeof data.unreadCount === 'number' ? data.unreadCount : unreadItems.length
      );
      setLastUpdated(new Date());

      console.log(`Refreshed notifications: ${unreadItems.length} unread of ${items.length} total`);
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
    }
  }, [isAdminRole]);

  // Setup socket connection and event listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket?.io) return undefined;

    setSocketConnected(Boolean(socket.connected));
    const handleConnectStatus = () => setSocketConnected(true);
    const handleDisconnectStatus = () => setSocketConnected(false);
    socket.on('connect', handleConnectStatus);
    socket.on('disconnect', handleDisconnectStatus);

    // Join the appropriate rooms based on role and userId
    if (isAdminRole) {
      socket.emit('join-admin');
    }

    if (userId) {
      socket.emit('join-user', { userId });
    }

    // Handle new notifications
    const handleNewNotification = (notification) => {
      console.log('New notification received:', notification);

      // Add the new notification to the state and trigger immediate UI update
      setNotifications(prev => {
        // Check if we already have this notification (avoid duplicates)
        const exists = prev.some(n => n.id === notification.id);
        if (exists) return prev;
        return [notification, ...prev];
      });

      // Update unread count
      if (!notification.read) {
        setUnreadCount(prev => prev + 1);
      }

      // Update last updated timestamp
      setLastUpdated(new Date());

      // Show a toast notification
      toast(notification.message, {
        icon: getNotificationIcon(notification.type),
        duration: 5000,
        id: notification.id // Use id to prevent duplicate toasts
      });
    };

    // Listen for notification:new events
    socket.on('notification:new', handleNewNotification);

    // Fetch notifications on initial load
    refreshNotifications();

    // Setup polling for notifications
    const pollingInterval = setInterval(() => {
      refreshNotifications();
    }, 30000); // Poll every 30 seconds as backup

    // Cleanup on unmount
    return () => {
      if (isAdminRole) {
        socket.emit('leave-admin');
      }

      if (userId) {
        socket.emit('leave-user', { userId });
      }

      socket.off('notification:new', handleNewNotification);
      socket.off('connect', handleConnectStatus);
      socket.off('disconnect', handleDisconnectStatus);
      clearInterval(pollingInterval);
    };
  }, [isAdminRole, userId, refreshNotifications]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket?.io) return undefined;

    let heartbeatTimeout;
    const handlePong = () => {
      if (heartbeatTimeout) {
        clearTimeout(heartbeatTimeout);
        heartbeatTimeout = undefined;
      }
      setLastHeartbeat(new Date());
      setSocketHealthy(true);
    };

    const sendHeartbeat = () => {
      if (!socket.connected) {
        setSocketHealthy(false);
        return;
      }

      socket.emit('ping', { ts: Date.now() });
      if (heartbeatTimeout) clearTimeout(heartbeatTimeout);
      heartbeatTimeout = setTimeout(() => {
        setSocketHealthy(false);
        refreshNotifications();
      }, 15000);
    };

    socket.on('pong', handlePong);
    const intervalId = setInterval(sendHeartbeat, 30000);
    sendHeartbeat();

    return () => {
      clearInterval(intervalId);
      if (heartbeatTimeout) {
        clearTimeout(heartbeatTimeout);
      }
      socket.off('pong', handlePong);
    };
  }, [refreshNotifications]);

  // This useEffect will run when we explicitly call refreshNotifications
  useEffect(() => {
    // Attach refresh function to window for debugging
    if (typeof window === 'undefined') return;
    window._refreshNotifications = refreshNotifications;
    return () => {
      if (window._refreshNotifications === refreshNotifications) {
        delete window._refreshNotifications;
      }
    };
  }, [refreshNotifications]);
  
  // Provide the notification context to children
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead,
        refreshNotifications,
        lastUpdated,
        socketConnected,
        socketHealthy,
        lastHeartbeat
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
