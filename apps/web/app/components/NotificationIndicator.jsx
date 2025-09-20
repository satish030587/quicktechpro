"use client";
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useNotifications } from './NotificationListener';

export default function NotificationIndicator() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    refreshNotifications,
    lastUpdated,
    socketConnected,
    socketHealthy,
    lastHeartbeat,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const lastHeartbeatDisplay = useMemo(() => {
    if (!lastHeartbeat) return 'Waiting…';
    const date = lastHeartbeat instanceof Date ? lastHeartbeat : new Date(lastHeartbeat);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, [lastHeartbeat]);

  const connectionIndicator = useMemo(() => {
    if (!socketConnected) {
      return {
        className: 'bg-red-500 animate-pulse',
        title: 'Realtime connection offline',
        label: 'Offline',
      };
    }

    if (socketHealthy) {
      return {
        className: 'bg-green-500',
        title: 'Realtime updates active',
        label: 'Live',
      };
    }

    return {
      className: 'bg-yellow-500 animate-pulse',
      title: 'Heartbeat delayed — refreshing in fallback mode',
      label: 'Degraded',
    };
  }, [socketConnected, socketHealthy]);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    // Refresh notifications when dropdown is opened
    if (!isOpen) {
      refreshNotifications();
    }
  };

  // Close dropdown when clicking outside
  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Format notification timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show date without year
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise, show full date
    return date.toLocaleDateString();
  };

  // Get appropriate style for notification type
  const getNotificationTypeStyle = (type) => {
    const types = {
      'INFO': 'bg-blue-100 text-blue-800',
      'WARNING': 'bg-yellow-100 text-yellow-800',
      'ERROR': 'bg-red-100 text-red-800',
      'SUCCESS': 'bg-green-100 text-green-800',
      'PAYMENT_SUCCESS': 'bg-green-100 text-green-800',
      'PAYMENT_FAILED': 'bg-red-100 text-red-800',
      'TICKET_CREATED': 'bg-blue-100 text-blue-800',
      'TICKET_UPDATED': 'bg-indigo-100 text-indigo-800',
      'APPOINTMENT_SCHEDULED': 'bg-purple-100 text-purple-800'
    };
    
    // Extract base type from specific types (e.g., PAYMENT_SUCCESS -> PAYMENT)
    const baseType = type?.split('_')[0];
    
    return types[type] || types[baseType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative">
      {/* Notification bell icon with badge */}
      <button 
        className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={toggleDropdown}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        
        {/* Additional dot indicator that pulses when last update is recent */}
        {lastUpdated && Date.now() - new Date(lastUpdated).getTime() < 60000 && (
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
        )}
        
        {/* Socket connection indicator */}
        <span 
          className={`absolute bottom-0 left-0 w-2 h-2 rounded-full ${connectionIndicator.className}`}
          title={connectionIndicator.title}
        ></span>
      </button>
      {!socketHealthy && socketConnected && (
        <p className="mt-2 text-xs text-yellow-700">
          Realtime is delayed. We&apos;ll keep polling in the background.
        </p>
      )}
      
      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={closeDropdown}
          ></div>
          
          <div className="absolute right-0 z-20 mt-2 overflow-hidden bg-white rounded-md shadow-lg w-80 ring-1 ring-black ring-opacity-5">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <Link 
                  href="/admin/notifications" 
                  className="text-xs text-blue-600 hover:text-blue-500"
                  onClick={closeDropdown}
                >
                  View all
                </Link>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                <span>Status: {connectionIndicator.label}</span>
                <span>Heartbeat: {lastHeartbeatDisplay}</span>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-sm text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.slice(0, 5).map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getNotificationTypeStyle(notification.type)}`}>
                          {notification.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-900">
                        {notification.message}
                      </p>
                      
                      {!notification.read && (
                        <button 
                          className="mt-2 text-xs text-blue-600 hover:text-blue-500"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <Link 
                href="/admin/notifications" 
                className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={closeDropdown}
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
