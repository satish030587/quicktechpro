"use client";
import { useEffect, useState } from 'react';
import { AdminAPI } from '../../lib/adminApi';
import { 
  PageHeader, 
  Card, 
  StatusBadge, 
  Tabs,
  LoadingSpinner
} from '../components/ui';

export default function ReportsClient() {
  const [data, setData] = useState({ tickets: [], payments: [], invoices: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Tabs definition
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tickets', label: 'Tickets' },
    { id: 'finance', label: 'Finance' },
    { id: 'customers', label: 'Customers' }
  ];

  async function load() { 
    setLoading(true);
    try {
      const r = await AdminAPI.reportSummary(); 
      setData(r);
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { load(); }, []);
  
  // Custom progress bar component with Tailwind
  const ProgressBar = ({ value, max, color = 'bg-emerald-500' }) => (
    <div className="bg-gray-100 rounded-full h-2.5 w-full overflow-hidden">
      <div 
        className={`h-2.5 rounded-full ${color}`} 
        style={{ width: `${Math.min(100, (value/max)*100 || 0)}%` }}
      />
    </div>
  );
  
  const tMax = Math.max(1, ...data.tickets.map(x => x._count));
  const rev = data.payments.find(x => x.status === 'SUCCESS');
  
  // Status to color mapping for progress bars
  const getStatusColor = (status) => {
    const statusMap = {
      'NEW': 'bg-blue-500',
      'OPEN': 'bg-cyan-500',
      'IN_PROGRESS': 'bg-indigo-500',
      'ON_HOLD': 'bg-yellow-500',
      'RESOLVED': 'bg-green-500',
      'CLOSED': 'bg-gray-500',
      'CANCELED': 'bg-red-500'
    };
    return statusMap[status] || 'bg-gray-500';
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader 
        title="Reports & Analytics" 
        description="View your business performance metrics and trends"
      />
      
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Total Revenue</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(rev?._sum?.amount || 0)}
                </span>
                <span className="text-xs text-green-600 mt-2">
                  <span className="font-medium">↑ 12.5%</span> vs last month
                </span>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Open Tickets</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">
                  {data.tickets.filter(t => ['NEW', 'OPEN', 'IN_PROGRESS'].includes(t.status)).reduce((sum, t) => sum + t._count, 0)}
                </span>
                <span className="text-xs text-blue-600 mt-2">
                  <span className="font-medium">↓ 3.2%</span> vs last month
                </span>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Pending Invoices</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(data.invoices.filter(i => i.status === 'UNPAID')
                    .reduce((sum, i) => sum + Number(i._sum?.total || 0), 0))}
                </span>
                <span className="text-xs text-yellow-600 mt-2">
                  <span className="font-medium">↑ 5.8%</span> vs last month
                </span>
              </div>
            </Card>
          </div>
          
          {/* Tickets by Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card title="Tickets by Status">
              <div className="space-y-4">
                {data.tickets.map(t => (
                  <div key={t.status} className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <StatusBadge status={t.status} />
                        <span className="ml-2 text-sm text-gray-700">{t._count}</span>
                      </div>
                      <span className="text-xs text-gray-500">{Math.round((t._count / tMax) * 100)}%</span>
                    </div>
                    <ProgressBar value={t._count} max={tMax} color={getStatusColor(t.status)} />
                  </div>
                ))}
              </div>
            </Card>
            
            <Card title="Invoices by Status">
              <div className="space-y-4">
                {data.invoices.map((i, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <StatusBadge status={i.status} type="payment" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(i._sum?.total || 0)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Revenue Trend */}
          <Card title="Monthly Revenue Trend" className="mb-6">
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Revenue chart will be displayed here</p>
            </div>
          </Card>
        </>
      )}
      
      {activeTab === 'tickets' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card title="Ticket Resolution Time">
              <div className="space-y-4 py-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Resolution Time</span>
                  <span className="font-medium">32 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">SLA Compliance Rate</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">First Response Time</span>
                  <span className="font-medium">1.4 hours</span>
                </div>
              </div>
            </Card>
            
            <Card title="Ticket Types">
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <StatusBadge status="Remote" type="ticket" />
                  </div>
                  <span className="font-medium">64%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <StatusBadge status="Onsite" type="ticket" />
                  </div>
                  <span className="font-medium">28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <StatusBadge status="WebDev" type="ticket" />
                  </div>
                  <span className="font-medium">8%</span>
                </div>
              </div>
            </Card>
          </div>
          
          <Card title="Support Agent Performance" className="mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Agent</span>
                <div className="flex space-x-6">
                  <span className="text-sm text-gray-500">Resolved</span>
                  <span className="text-sm text-gray-500">Avg. Time</span>
                  <span className="text-sm text-gray-500">Rating</span>
                </div>
              </div>
              
              {[
                { name: "Amit Kumar", resolved: 42, time: "4.2h", rating: 4.8 },
                { name: "Priya Sharma", resolved: 38, time: "3.8h", rating: 4.9 },
                { name: "Raj Singh", resolved: 35, time: "5.1h", rating: 4.6 }
              ].map((agent, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-gray-900">{agent.name}</span>
                  <div className="flex space-x-6">
                    <span className="text-sm text-gray-700 w-12 text-center">{agent.resolved}</span>
                    <span className="text-sm text-gray-700 w-12 text-center">{agent.time}</span>
                    <span className="text-sm text-gray-700 w-12 text-center">{agent.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      
      {activeTab === 'finance' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Total Revenue</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(rev?._sum?.amount || 0)}
                </span>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Outstanding Amount</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(data.invoices.filter(i => i.status === 'UNPAID')
                    .reduce((sum, i) => sum + Number(i._sum?.total || 0), 0))}
                </span>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Overdue Amount</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(data.invoices.filter(i => i.status === 'OVERDUE')
                    .reduce((sum, i) => sum + Number(i._sum?.total || 0), 0))}
                </span>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card title="Payment Methods">
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <StatusBadge status="Credit Card" />
                    <span className="ml-2 text-gray-700">Credit Card</span>
                  </div>
                  <span className="font-medium">{formatCurrency(8500)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <StatusBadge status="UPI" />
                    <span className="ml-2 text-gray-700">UPI</span>
                  </div>
                  <span className="font-medium">{formatCurrency(12000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <StatusBadge status="Bank Transfer" />
                    <span className="ml-2 text-gray-700">Bank Transfer</span>
                  </div>
                  <span className="font-medium">{formatCurrency(9200)}</span>
                </div>
              </div>
            </Card>
            
            <Card title="Service Revenue">
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Computer Repair</span>
                  <span className="font-medium">{formatCurrency(15000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Network Setup</span>
                  <span className="font-medium">{formatCurrency(8500)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Website Development</span>
                  <span className="font-medium">{formatCurrency(12000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Maintenance</span>
                  <span className="font-medium">{formatCurrency(4200)}</span>
                </div>
              </div>
            </Card>
          </div>
          
          <Card title="Monthly Revenue" className="mb-6">
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Monthly revenue chart will be displayed here</p>
            </div>
          </Card>
        </>
      )}
      
      {activeTab === 'customers' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Total Customers</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">324</span>
                <span className="text-xs text-green-600 mt-2">
                  <span className="font-medium">↑ 8.2%</span> vs last month
                </span>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">New Customers</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">42</span>
                <span className="text-xs text-green-600 mt-2">
                  <span className="font-medium">↑ 12.5%</span> vs last month
                </span>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Customer Retention</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">91.2%</span>
                <span className="text-xs text-green-600 mt-2">
                  <span className="font-medium">↑ 2.1%</span> vs last month
                </span>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card title="Customer Segments">
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Business</span>
                  <span className="font-medium">42%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Residential</span>
                  <span className="font-medium">58%</span>
                </div>
              </div>
            </Card>
            
            <Card title="Customer Satisfaction">
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Overall Rating</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">4.8/5</span>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Positive Reviews</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Response Satisfaction</span>
                  <span className="font-medium">89%</span>
                </div>
              </div>
            </Card>
          </div>
          
          <Card title="Customer Acquisition Channels" className="mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Channel</span>
                <span className="font-medium">Customers</span>
              </div>
              
              {[
                { channel: "Website / Organic", count: 142 },
                { channel: "Referrals", count: 87 },
                { channel: "Google Business", count: 52 },
                { channel: "Social Media", count: 43 }
              ].map((channel, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-gray-700">{channel.channel}</span>
                  <span className="text-gray-900 font-medium">{channel.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

