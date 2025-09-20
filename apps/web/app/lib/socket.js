import { io } from 'socket.io-client';
import { API_URL, getAccessToken, loadTokensFromStorage } from './api';

const noop = () => {};
const placeholderSocket = { on: noop, off: noop, emit: noop, connected: false };

let socket;
let currentToken = null;

// Automatic socket refresh interval (2 minutes)
const SOCKET_REFRESH_INTERVAL = 2 * 60 * 1000;
let refreshInterval = null;

export function getSocket() {
  if (typeof window === 'undefined') return placeholderSocket;

  let token = getAccessToken();
  if (!token) {
    loadTokensFromStorage();
    token = getAccessToken();
  }

  if (!token) {
    if (socket) {
      socket.disconnect();
      socket = undefined;
      currentToken = null;
      
      // Clear refresh interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }
    }
    return placeholderSocket;
  }

  // If token changed or socket doesn't exist, create a new connection
  if (!socket || currentToken !== token) {
    // Disconnect old socket if it exists
    if (socket) {
      socket.disconnect();
    }
    
    // Update current token
    currentToken = token;
    
    // Create new socket with fresh token
    socket = io(API_URL, {
      transports: ['websocket'],
      withCredentials: true,
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnection: true,
    });

    // Log connection events for debugging
    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      
      // If we get an auth error, try to refresh the token and reconnect
      if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
        loadTokensFromStorage();
        const newToken = getAccessToken();
        if (newToken && newToken !== currentToken) {
          // Token was refreshed, we'll reconnect on next getSocket call
          currentToken = null;
        }
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      // If we get an auth error, force token refresh on next call
      if (error?.message?.includes('Invalid or expired token')) {
        currentToken = null;
      }
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      
      // Update token on reconnect to ensure it's fresh
      const freshToken = getAccessToken();
      if (freshToken && freshToken !== socket.auth?.token) {
        socket.auth = { ...(socket.auth || {}), token: freshToken };
      }
    });
    
    // Set up interval to periodically check for new tokens
    if (!refreshInterval) {
      refreshInterval = setInterval(() => {
        const latestToken = getAccessToken();
        
        // If token changed, update socket auth
        if (latestToken && latestToken !== currentToken) {
          console.log('Token changed, updating socket auth');
          currentToken = latestToken;
          socket.auth = { ...(socket.auth || {}), token: latestToken };
          
          // Force reconnect to apply new token
          if (socket.connected) {
            socket.disconnect().connect();
          }
        }
      }, SOCKET_REFRESH_INTERVAL);
    }
  } else if (!socket.connected) {
    // Socket exists but not connected, update token and reconnect
    socket.auth = { ...(socket.auth || {}), token };
    socket.connect();
  }

  return socket;
}
