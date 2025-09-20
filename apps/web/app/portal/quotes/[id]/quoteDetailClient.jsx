"use client";
import { useEffect, useState } from 'react';
import { CustomerAPI } from '../../../lib/customerApi';
import Link from 'next/link';

// Status badge component with appropriate colors
function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase() || '';
  
  // Colors for different status types
  const colors = {
    'draft': 'bg-gray-100 text-gray-800',
    'sent': 'bg-blue-100 text-blue-800',
    'accepted': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'expired': 'bg-yellow-100 text-yellow-800',
    'invoiced': 'bg-purple-100 text-purple-800',
    
    // Default
    'default': 'bg-gray-100 text-gray-800',
  };
  
  const colorClass = colors[normalizedStatus] || colors['default'];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}

export default function QuoteDetailClient({ id }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  async function loadQuote() {
    try {
      setLoading(true);
      const r = await CustomerAPI.quote(id);
      setQuote(r);
    } catch (error) {
      console.error("Error loading quote details:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { 
    loadQuote(); 
  }, [id]);
  
  async function handleAccept() {
    try {
      setActionLoading(true);
      await CustomerAPI.acceptQuote(id);
      await loadQuote();
    } catch (error) {
      console.error("Error accepting quote:", error);
    } finally {
      setActionLoading(false);
    }
  }
  
  async function handleReject() {
    try {
      setActionLoading(true);
      await CustomerAPI.rejectQuote(id);
      await loadQuote();
    } catch (error) {
      console.error("Error rejecting quote:", error);
    } finally {
      setActionLoading(false);
    }
  }
  
  if (loading || !quote) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/portal/quotes"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Quote #{id.slice(-6)}</h1>
          </div>
          <h2 className="text-xl text-gray-800">{quote.title}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <StatusBadge status={quote.status} />
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Quote Date</div>
            <div className="text-gray-900">{new Date(quote.createdAt || quote.date).toLocaleDateString()}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Total Amount</div>
            <div className="text-xl font-medium text-gray-900">₹{quote.total.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quote Items</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Line Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(quote.items || []).map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ₹{item.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      ₹{item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 text-right">
                    ₹{quote.total.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {quote.status === 'SENT' && (
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Processing...' : 'Reject Quote'}
              </button>
              <button
                onClick={handleAccept}
                disabled={actionLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Accept Quote'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

