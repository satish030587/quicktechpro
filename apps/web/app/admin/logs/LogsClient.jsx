"use client";
import { useEffect, useState } from 'react';
import { 
  PageHeader, 
  Card, 
  StatusBadge, 
  Button, 
  FormInput, 
  FormSelect,
  LoadingSpinner,
  Tabs
} from '../components/ui';

export default function LogsClient() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState({
    level: '',
    source: '',
    startDate: '',
    endDate: ''
  });
  const [activeTab, setActiveTab] = useState('system');
  
  // Tabs definition
  const tabs = [
    { id: 'system', label: 'System Logs' },
    { id: 'access', label: 'Access Logs' },
    { id: 'error', label: 'Error Logs' },
    { id: 'audit', label: 'Audit Trail' }
  ];
  
  // Simulated log data - this would typically come from an API
  const mockLogs = [
    { id: 1, timestamp: new Date(Date.now() - 300000).toISOString(), level: 'INFO', source: 'AUTH', message: 'User admin@example.com logged in', ip: '192.168.1.1' },
    { id: 2, timestamp: new Date(Date.now() - 600000).toISOString(), level: 'WARNING', source: 'PAYMENT', message: 'Payment gateway timeout for transaction #12345', ip: '192.168.1.2' },
    { id: 3, timestamp: new Date(Date.now() - 900000).toISOString(), level: 'ERROR', source: 'API', message: 'Database connection error: Connection refused', ip: '192.168.1.3' },
    { id: 4, timestamp: new Date(Date.now() - 1200000).toISOString(), level: 'INFO', source: 'TICKET', message: 'Ticket #T-2023-005 status changed to RESOLVED', ip: '192.168.1.4' },
    { id: 5, timestamp: new Date(Date.now() - 1500000).toISOString(), level: 'DEBUG', source: 'SYSTEM', message: 'Scheduled backup started', ip: '192.168.1.5' },
    { id: 6, timestamp: new Date(Date.now() - 1800000).toISOString(), level: 'CRITICAL', source: 'SYSTEM', message: 'Disk space below 10% threshold on server-db01', ip: '192.168.1.6' },
    { id: 7, timestamp: new Date(Date.now() - 2100000).toISOString(), level: 'INFO', source: 'USER', message: 'New user account created: customer@example.com', ip: '192.168.1.7' },
    { id: 8, timestamp: new Date(Date.now() - 2400000).toISOString(), level: 'WARNING', source: 'SECURITY', message: 'Multiple failed login attempts for user tech@example.com', ip: '192.168.1.8' },
    { id: 9, timestamp: new Date(Date.now() - 2700000).toISOString(), level: 'INFO', source: 'EMAIL', message: 'Weekly newsletter sent to 237 subscribers', ip: '192.168.1.9' },
    { id: 10, timestamp: new Date(Date.now() - 3000000).toISOString(), level: 'ERROR', source: 'API', message: 'Invalid API request from client: Missing authentication token', ip: '192.168.1.10' }
  ];
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      let filtered = [...mockLogs];
      
      if (filter.level) {
        filtered = filtered.filter(log => log.level === filter.level);
      }
      
      if (filter.source) {
        filtered = filtered.filter(log => log.source === filter.source);
      }
      
      if (filter.startDate) {
        const start = new Date(filter.startDate);
        filtered = filtered.filter(log => new Date(log.timestamp) >= start);
      }
      
      if (filter.endDate) {
        const end = new Date(filter.endDate);
        filtered = filtered.filter(log => new Date(log.timestamp) <= end);
      }
      
      if (activeTab === 'error') {
        filtered = filtered.filter(log => ['ERROR', 'CRITICAL'].includes(log.level));
      } else if (activeTab === 'access') {
        filtered = filtered.filter(log => log.source === 'AUTH');
      } else if (activeTab === 'audit') {
        filtered = filtered.filter(log => log.source === 'USER' || log.message.includes('changed'));
      }
      
      setLogs(filtered);
      setLoading(false);
    }, 800);
  }, [filter, activeTab]);
  
  const getLevelBadge = (level) => {
    const levelColors = {
      'INFO': 'bg-blue-100 text-blue-800',
      'DEBUG': 'bg-gray-100 text-gray-800',
      'WARNING': 'bg-yellow-100 text-yellow-800',
      'ERROR': 'bg-red-100 text-red-800',
      'CRITICAL': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${levelColors[level] || 'bg-gray-100 text-gray-800'}`}>
        {level}
      </span>
    );
  };
  
  const getSourceBadge = (source) => {
    const sourceColors = {
      'AUTH': 'bg-indigo-100 text-indigo-800',
      'PAYMENT': 'bg-green-100 text-green-800',
      'API': 'bg-cyan-100 text-cyan-800',
      'TICKET': 'bg-blue-100 text-blue-800',
      'SYSTEM': 'bg-gray-100 text-gray-800',
      'USER': 'bg-violet-100 text-violet-800',
      'SECURITY': 'bg-red-100 text-red-800',
      'EMAIL': 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceColors[source] || 'bg-gray-100 text-gray-800'}`}>
        {source}
      </span>
    );
  };
  
  // Level and source options for filtering
  const levelOptions = [
    { value: '', label: 'All Levels' },
    { value: 'INFO', label: 'Info' },
    { value: 'DEBUG', label: 'Debug' },
    { value: 'WARNING', label: 'Warning' },
    { value: 'ERROR', label: 'Error' },
    { value: 'CRITICAL', label: 'Critical' }
  ];
  
  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'AUTH', label: 'Authentication' },
    { value: 'PAYMENT', label: 'Payment' },
    { value: 'API', label: 'API' },
    { value: 'TICKET', label: 'Ticket' },
    { value: 'SYSTEM', label: 'System' },
    { value: 'USER', label: 'User' },
    { value: 'SECURITY', label: 'Security' },
    { value: 'EMAIL', label: 'Email' }
  ];

  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader 
        title="System Logs" 
        description="Monitor system activities and troubleshoot issues"
        actions={[
          <Button 
            key="download"
            variant="secondary"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            }
          >
            Export Logs
          </Button>
        ]}
      />
      
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <Card title="Filter Logs" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormSelect
            label="Log Level"
            id="level-filter"
            value={filter.level}
            onChange={(e) => setFilter(f => ({ ...f, level: e.target.value }))}
            options={levelOptions}
          />
          
          <FormSelect
            label="Source"
            id="source-filter"
            value={filter.source}
            onChange={(e) => setFilter(f => ({ ...f, source: e.target.value }))}
            options={sourceOptions}
          />
          
          <FormInput
            label="Start Date"
            id="start-date"
            type="datetime-local"
            value={filter.startDate}
            onChange={(e) => setFilter(f => ({ ...f, startDate: e.target.value }))}
          />
          
          <FormInput
            label="End Date"
            id="end-date"
            type="datetime-local"
            value={filter.endDate}
            onChange={(e) => setFilter(f => ({ ...f, endDate: e.target.value }))}
          />
        </div>
      </Card>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Card className="mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getLevelBadge(log.level)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getSourceBadge(log.source)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {logs.length} of {mockLogs.length} logs
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={logs.length === 0}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={logs.length === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-6">
        <Card title="Log Retention Settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <FormSelect
              label="System Logs Retention"
              id="system-retention"
              value="30"
              options={[
                { value: '7', label: '7 days' },
                { value: '14', label: '14 days' },
                { value: '30', label: '30 days' },
                { value: '90', label: '90 days' },
                { value: '365', label: '1 year' }
              ]}
            />
            
            <FormSelect
              label="Error Logs Retention"
              id="error-retention"
              value="90"
              options={[
                { value: '30', label: '30 days' },
                { value: '90', label: '90 days' },
                { value: '180', label: '180 days' },
                { value: '365', label: '1 year' },
                { value: '730', label: '2 years' }
              ]}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="primary"
            >
              Save Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}