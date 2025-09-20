"use client";
import { useEffect, useState } from 'react';
import { AdminAPI } from '../../../lib/adminApi';
import Link from 'next/link';

export default function DashboardClient() {
  const [summary, setSummary] = useState(null);
  const [report, setReport] = useState({ tickets: [], payments: [], invoices: [] });
  const [tickets, setTickets] = useState({ items: [] });
  const [payments, setPayments] = useState({ items: [] });
  const [notifications, setNotifications] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const s = await AdminAPI.summary(); setSummary(s);
      const r = await AdminAPI.reportSummary(); setReport(r);
      const t = await AdminAPI.ticketsList({ take: 5 }); setTickets(t);
      const p = await AdminAPI.payments(); p.items = (p.items || []).slice(0, 5); setPayments(p);
      const n = await AdminAPI.notificationsList({ read: 'false' }); n.items = (n.items || []).slice(0, 5); setNotifications(n);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Status badge colors
  const getBadgeColor = (status) => {
    const colors = {
      'open': 'bg-blue-100 text-blue-800',
      'closed': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-indigo-100 text-indigo-800',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-800',
      'paid': 'bg-green-100 text-green-800',
      'unpaid': 'bg-red-100 text-red-800',
      'overdue': 'bg-orange-100 text-orange-800',
      'draft': 'bg-gray-100 text-gray-800',
      'credit card': 'bg-purple-100 text-purple-800',
      'upi': 'bg-blue-100 text-blue-800',
      'cash': 'bg-green-100 text-green-800',
      'bank transfer': 'bg-indigo-100 text-indigo-800',
    };
    
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button 
          onClick={load}
          className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <KPI title="Users" value={summary?.users} icon="users" />
        <KPI title="Tickets" value={summary?.tickets} icon="tickets" />
        <KPI title="Invoices" value={summary?.invoices} icon="invoices" />
        <KPI title="Payments" value={summary?.payments} icon="payments" />
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Recent Tickets" loading={loading && !tickets.items?.length}>
          {tickets.items?.length ? (
            <div className="space-y-4">
              {(tickets.items || []).map(t => (
                <div key={t.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">{t.code}</span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getBadgeColor(t.status)}`}>
                      {t.status}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800`}>
                      {t.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{t.title}</p>
                  <Link 
                    href={`/admin/tickets/${t.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                  >
                    View Details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          ) : !loading ? (
            <p className="text-center py-4 text-gray-500">No tickets found</p>
          ) : null}
        </Card>

        <Card title="Recent Payments" loading={loading && !payments.items?.length}>
          {payments.items?.length ? (
            <div className="space-y-4">
              {(payments.items || []).map(p => (
                <div key={p.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getBadgeColor(p.status)}`}>
                          {p.status}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getBadgeColor(p.method)}`}>
                          {p.method}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Invoice: {p.invoice?.number || 'N/A'}</p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">₹{p.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : !loading ? (
            <p className="text-center py-4 text-gray-500">No payments found</p>
          ) : null}
        </Card>

        <Card title="Unread Notifications" loading={loading && !notifications.items?.length}>
          {notifications.items?.length ? (
            <div className="space-y-4">
              {(notifications.items || []).map(n => (
                <div key={n.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{n.type}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{n.message}</p>
                </div>
              ))}
            </div>
          ) : !loading ? (
            <p className="text-center py-4 text-gray-500">No unread notifications</p>
          ) : null}
        </Card>
      </div>
    </section>
  );
}

function KPI({ title, value, icon }) {
  // Different styles based on the KPI type
  const getIconBg = (type) => {
    switch (type.toLowerCase()) {
      case 'users': return 'bg-blue-100 text-blue-600';
      case 'tickets': return 'bg-indigo-100 text-indigo-600';
      case 'invoices': return 'bg-amber-100 text-amber-600';
      case 'payments': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Icons for each type
  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'users':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'tickets':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        );
      case 'invoices':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'payments':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
    }
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${getIconBg(title)}`}>
          {getIcon(title)}
        </div>
        <span className="text-xs font-medium text-gray-500 uppercase">Total</span>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900">{value ?? '—'}</h3>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>
    </div>
  );
}

function Card({ title, children, loading = false }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <div className="p-5">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : children}
      </div>
    </div>
  );
}

