"use client";
import { useEffect, useState } from 'react';
import { CustomerAPI } from '../../lib/customerApi';

// Status badge component for read/unread status
function NotificationStatusBadge({ isRead }) {
  return isRead ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      Read
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      Unread
    </span>
  );
}

// Type badge component with appropriate colors
function NotificationTypeBadge({ type }) {
  const normalizedType = type?.toLowerCase() || '';
  
  // Colors for different notification types
  const colors = {
    'system': 'bg-gray-100 text-gray-800',
    'ticket': 'bg-indigo-100 text-indigo-800',
    'payment': 'bg-green-100 text-green-800',
    'invoice': 'bg-purple-100 text-purple-800',
    'quote': 'bg-amber-100 text-amber-800',
    'appointment': 'bg-cyan-100 text-cyan-800',
    
    // Default
    'default': 'bg-gray-100 text-gray-800',
  };
  
  const colorClass = colors[normalizedType] || colors['default'];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {type}
    </span>
  );
}

export default function PortalNotificationsClient() {
  const [data, setData] = useState({ items: [], total: 0, unreadCount: 0 });
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(''); // '' | 'true' | 'false'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const pageSize = 10;
  
  async function loadNotifications(p = 1) {
    try {
      setLoading(true);
      const r = await CustomerAPI.notifications(p, pageSize, show);
      setData(r);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { 
    loadNotifications(page); 
  }, [page, show]);
  
  async function handleMarkRead(id) {
    try {
      setActionLoading(true);
      await CustomerAPI.notificationRead(id);
      await loadNotifications(page);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setActionLoading(false);
    }
  }
  
  async function handleMarkAllRead() {
    try {
      setActionLoading(true);
      await CustomerAPI.notificationsMarkAllRead();
      await loadNotifications(1);
      setPage(1);
      setShow('true');
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    } finally {
      setActionLoading(false);
    }
  }
  
  const totalPages = Math.max(1, Math.ceil((data.total || 0) / pageSize));
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="mt-1 text-sm text-gray-500">Stay updated with the latest information</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              Unread: {data.unreadCount || 0}
            </div>
            
            <div className="w-48">
              <select
                value={show}
                onChange={e => { setPage(1); setShow(e.target.value); }}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Notifications</option>
                <option value="false">Unread Only</option>
                <option value="true">Read Only</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handleMarkAllRead}
            disabled={actionLoading || data.unreadCount === 0}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading ? 'Processing...' : 'Mark All as Read'}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (data.items || []).length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {show === 'false' 
              ? "You don't have any unread notifications" 
              : show === 'true' 
                ? "You don't have any read notifications" 
                : "You don't have any notifications yet"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {(data.items || []).map(notification => (
              <div 
                key={notification.id} 
                className={`bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${!notification.read ? 'border-blue-300' : 'border-gray-200'}`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <NotificationTypeBadge type={notification.type} />
                      <NotificationStatusBadge isRead={notification.read} />
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <p className="text-gray-900 mb-4">
                    {notification.message}
                  </p>
                  
                  {!notification.read && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleMarkRead(notification.id)}
                        disabled={actionLoading}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading ? 'Processing...' : 'Mark as Read'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-6">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    page <= 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {page} of {totalPages}
                </span>
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    page >= totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
