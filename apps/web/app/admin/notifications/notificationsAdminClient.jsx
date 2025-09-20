"use client";
import { useMemo, useState } from 'react';
import { AdminAPI } from '../../lib/adminApi';
import { 
  PageHeader, 
  Card, 
  StatusBadge, 
  Button, 
  FormInput, 
  FormSelect,
  FormTextarea,
  Tabs,
  EmptyState,
  LoadingSpinner
} from '../components/ui';
import { useNotifications } from '../../components/NotificationListener';

export default function NotificationsAdminClient() {
  const [filter, setFilter] = useState({ read: '', type: '' });
  const [broadcast, setBroadcast] = useState({ type: 'INFO', message: '' });
  const [activeTab, setActiveTab] = useState('notifications');
  const { notifications, markAsRead, refreshNotifications, lastUpdated } = useNotifications();

  // Tabs definition
  const tabs = [
    { id: 'notifications', label: 'Notifications' },
    { id: 'broadcast', label: 'Send Broadcast' },
    { id: 'templates', label: 'Templates' }
  ];
  
  const filteredNotifications = useMemo(() => {
    let data = notifications || [];
    if (filter.read === 'true') {
      data = data.filter((notification) => notification.read);
    } else if (filter.read === 'false') {
      data = data.filter((notification) => !notification.read);
    }

    if (filter.type.trim()) {
      const query = filter.type.trim().toLowerCase();
      data = data.filter((notification) =>
        (notification.type || '').toLowerCase().includes(query)
      );
    }

    return [...data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [notifications, filter]);

  const isLoading = !lastUpdated && (notifications?.length ?? 0) === 0;

  async function markRead(id) {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }
  
  async function sendBroadcast(e) {
    e.preventDefault();
    if (!broadcast.message) return;
    
    try {
      await AdminAPI.notificationsBroadcast(broadcast);
      setBroadcast({ type: 'INFO', message: '' });
      await refreshNotifications();
      // Switch to notifications tab after sending broadcast
      setActiveTab('notifications');
    } catch (error) {
      console.error("Error sending broadcast:", error);
    }
  }
  
  // Get notification type style
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
    const baseType = type.split('_')[0];
    
    return types[type] || types[baseType] || 'bg-gray-100 text-gray-800';
  };
  
  // Notification type options for broadcast
  const notificationTypes = [
    { value: 'INFO', label: 'Information' },
    { value: 'WARNING', label: 'Warning' },
    { value: 'ERROR', label: 'Error' },
    { value: 'SUCCESS', label: 'Success' },
    { value: 'SYSTEM_UPDATE', label: 'System Update' },
    { value: 'MAINTENANCE', label: 'Maintenance' }
  ];

  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader 
        title="Notifications Center" 
        description="Manage system notifications and send broadcasts to users"
      />
      
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      {activeTab === 'notifications' && (
        <>
          <Card title="Filter Notifications" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="Status"
                id="read-filter"
                value={filter.read}
                onChange={(e) => setFilter(f => ({ ...f, read: e.target.value }))}
                options={[
                  { value: '', label: 'All Notifications' },
                  { value: 'false', label: 'Unread Only' },
                  { value: 'true', label: 'Read Only' }
                ]}
              />
              
              <FormInput
                label="Type"
                id="type-filter"
                value={filter.type}
                onChange={(e) => setFilter(f => ({ ...f, type: e.target.value }))}
                placeholder="e.g., PAYMENT_SUCCESS"
              />
            </div>
          </Card>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredNotifications.length === 0 ? (
            <EmptyState
              title="No notifications found"
              description="There are no notifications matching your current filters."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              }
              action={
                <Button 
                  variant="primary" 
                  onClick={() => setActiveTab('broadcast')}
                >
                  Send New Broadcast
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <Card key={notification.id} className={`border-l-4 ${notification.read ? 'border-l-gray-300' : 'border-l-blue-500'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNotificationTypeStyle(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <StatusBadge status={notification.read ? 'Read' : 'Unread'} />
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-700">{notification.message}</p>
                  </div>
                  
                  {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Additional Information</h4>
                      <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                        {JSON.stringify(notification.metadata, null, 2)}
                      </div>
                    </div>
                  )}
                  
                  {!notification.read && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => markRead(notification.id)}
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        }
                      >
                        Mark as Read
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
              
            </div>
          )}
        </>
      )}
      
      {activeTab === 'broadcast' && (
        <Card title="Send Broadcast Message">
          <form onSubmit={sendBroadcast}>
            <div className="space-y-6">
              <FormSelect
                label="Notification Type"
                id="broadcast-type"
                value={broadcast.type}
                onChange={(e) => setBroadcast(s => ({ ...s, type: e.target.value }))}
                options={notificationTypes}
              />
              
              <FormTextarea
                label="Message"
                id="broadcast-message"
                value={broadcast.message}
                onChange={(e) => setBroadcast(s => ({ ...s, message: e.target.value }))}
                placeholder="Enter your broadcast message here..."
                required
                rows={5}
              />
              
              <div className="flex items-center pb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Send as email to all users</span>
                </label>
              </div>
              
              <div className="flex items-center pb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Send as SMS to users with phone numbers</span>
                </label>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      This message will be sent to all users in the system. Please use this feature responsibly.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  }
                >
                  Send Broadcast
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}
      
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <Card title="Notification Templates">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Channel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { id: 1, name: 'Welcome Email', type: 'INFO', channel: 'Email' },
                    { id: 2, name: 'Password Reset', type: 'INFO', channel: 'Email' },
                    { id: 3, name: 'Ticket Status Update', type: 'TICKET_UPDATED', channel: 'All' },
                    { id: 4, name: 'Payment Confirmation', type: 'PAYMENT_SUCCESS', channel: 'All' },
                    { id: 5, name: 'Appointment Reminder', type: 'APPOINTMENT_SCHEDULED', channel: 'SMS' }
                  ].map((template) => (
                    <tr key={template.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {template.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNotificationTypeStyle(template.type)}`}>
                          {template.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {template.channel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          }
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <Card title="Create New Template">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormInput
                label="Template Name"
                placeholder="Enter template name"
              />
              
              <FormSelect
                label="Notification Type"
                options={notificationTypes}
              />
              
              <FormSelect
                label="Channel"
                options={[
                  { value: 'all', label: 'All Channels' },
                  { value: 'email', label: 'Email Only' },
                  { value: 'sms', label: 'SMS Only' },
                  { value: 'in_app', label: 'In-App Only' }
                ]}
              />
              
              <FormSelect
                label="User Group"
                options={[
                  { value: 'all', label: 'All Users' },
                  { value: 'customers', label: 'Customers Only' },
                  { value: 'admins', label: 'Admins Only' }
                ]}
              />
              
              <div className="md:col-span-2">
                <FormTextarea
                  label="Template Content"
                  rows={6}
                  placeholder="Enter template content here. You can use placeholders like {{user_name}}, {{ticket_id}}, etc."
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="primary"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                }
              >
                Save Template
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
