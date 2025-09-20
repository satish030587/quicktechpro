/**
 * Helper functions for the notification system
 */

/**
 * Test the socket connection by emitting a test event to the server
 * This is for debugging purposes only
 */
export function testSocketConnection() {
  if (typeof window === 'undefined') return;
  
  try {
    const { getSocket } = require('./socket');
    const socket = getSocket();
    
    // Log connection status
    console.log('Socket connection status:', {
      connected: socket.connected,
      id: socket.id,
    });
    
    // Try to emit a test event
    socket.emit('ping', { timestamp: new Date().toISOString() });
    console.log('Test ping event emitted');
    
    // Listen for pong response
    socket.on('pong', (data) => {
      console.log('Received pong response:', data);
    });
    
    return socket.connected;
  } catch (error) {
    console.error('Error testing socket connection:', error);
    return false;
  }
}

/**
 * Manually emit a test notification to a specific user
 * This is for debugging purposes only
 */
export function emitTestNotification(userId, role = 'customer') {
  if (typeof window === 'undefined') return;
  
  try {
    // Only allow this in development
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Test notifications can only be sent in development mode');
      return;
    }
    
    const { getSocket } = require('./socket');
    const socket = getSocket();
    
    if (!socket.connected) {
      console.error('Socket not connected, cannot send test notification');
      return;
    }
    
    // Send a test notification request to the server
    socket.emit('test:notification', {
      userId,
      role,
      message: 'This is a test notification',
      timestamp: new Date().toISOString()
    });
    
    console.log('Test notification request sent for user:', userId);
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
}

/**
 * Force refresh all notifications
 */
export function forceRefreshNotifications() {
  if (typeof window === 'undefined') return;
  
  try {
    // Try to access the refresh function on the window object
    if (window._refreshNotifications) {
      window._refreshNotifications();
      console.log('Notifications refreshed manually');
      return true;
    } else {
      console.warn('Refresh notifications function not available');
      return false;
    }
  } catch (error) {
    console.error('Error refreshing notifications:', error);
    return false;
  }
}