"use client";
import { useState, useEffect } from 'react';
import { getSocket } from '../lib/socket';
import { useAuth } from '../providers';
import { useNotifications } from './NotificationListener';

export default function NotificationDebugger() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Test notification');
  const [type, setType] = useState('TEST_NOTIFICATION');
  const { user } = useAuth();
  const { notifications, unreadCount, refreshNotifications, lastUpdated } = useNotifications();
  
  // Expose debugging utilities to window object
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window._debugNotifications = {
        toggleDebugger: () => setVisible(prev => !prev),
        sendTestNotification: (msg, t) => sendTestNotification(msg || message, t || type),
        refreshNotifications,
        getNotificationState: () => ({ 
          notifications, 
          unreadCount, 
          lastUpdated,
          socket: getSocket().connected ? 'connected' : 'disconnected'
        })
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window._debugNotifications;
      }
    };
  }, [notifications, unreadCount, lastUpdated, message, type]);
  
  const sendTestNotification = async (msg, t) => {
    if (!user?.id) {
      alert('User not logged in');
      return;
    }
    
    try {
      const socket = getSocket();
      
      if (!socket.connected) {
        alert('Socket not connected');
        return;
      }
      
      // Create a test notification
      const testNotification = {
        id: `test-${Date.now()}`,
        userId: user.id,
        type: t,
        message: msg,
        createdAt: new Date().toISOString(),
        read: false
      };
      
      // Emit the notification directly to avoid server roundtrip for testing
      socket.emit('test:notification', {
        userId: user.id,
        role: user.roles?.[0] || 'customer',
        message: msg,
        type: t
      });
      
      console.log('Test notification sent:', testNotification);
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert(`Error: ${error.message}`);
    }
  };
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Notification Debugger</h3>
        <button 
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="TEST_NOTIFICATION">Test</option>
            <option value="TICKET_CREATED">Ticket Created</option>
            <option value="TICKET_UPDATED">Ticket Updated</option>
            <option value="APPOINTMENT_SCHEDULED">Appointment</option>
            <option value="PAYMENT_SUCCESS">Payment</option>
          </select>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => sendTestNotification()}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Send Test
          </button>
          
          <button
            onClick={() => refreshNotifications()}
            className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
          >
            Refresh
          </button>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          <div>Count: {unreadCount}</div>
          <div>Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'never'}</div>
          <div>Socket: {getSocket().connected ? 'Connected' : 'Disconnected'}</div>
        </div>
      </div>
    </div>
  );
}