"use client";
import { useEffect, useState } from 'react';
import { CustomerAPI } from '../../lib/customerApi';
import Link from 'next/link';

// Status badge component with appropriate colors
function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase() || '';
  
  // Colors for different status types
  const colors = {
    'paid': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'overdue': 'bg-red-100 text-red-800',
    'canceled': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-gray-100 text-gray-800',
    'refunded': 'bg-purple-100 text-purple-800',
    
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

export default function InvoicesClient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  async function load() {
    try {
      setLoading(true);
      const r = await CustomerAPI.invoices();
      setItems(r.items || []);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { 
    load(); 
  }, []);
  
  async function loadScript() {
    if (typeof window === 'undefined') return false;
    if (window.Razorpay) return true;
    
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
  
  async function handlePayment(invoice) {
    try {
      const ok = await loadScript();
      if (!ok) {
        alert('Unable to load payment SDK. Please try again later.');
        return;
      }
      
      const config = await CustomerAPI.paymentsConfig();
      const { order, invoiceNumber, amount, currency } = await CustomerAPI.createRazorpayOrder(invoice.id);
      
      const razorpay = new window.Razorpay({
        key: config.keyId,
        amount: order.amount,
        currency,
        name: 'QuickTechPro',
        description: `Invoice ${invoiceNumber}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await CustomerAPI.verifyRazorpayPayment(response);
            alert('Payment successful');
            await load();
          } catch (error) {
            console.error("Payment verification failed:", error); 
            alert('Payment verification failed. Please contact support.');
          }
        },
        theme: { color: '#2563eb' } // Blue-600 from Tailwind
      });
      
      razorpay.open();
    } catch (error) {
      console.error("Error initializing payment:", error);
      alert('An error occurred while setting up the payment. Please try again later.');
    }
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>
        <p className="mt-1 text-sm text-gray-500">View and pay your invoices</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any invoices yet
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.createdAt || invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{invoice.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/portal/invoices/${invoice.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        
                        {['PENDING', 'OVERDUE'].includes(invoice.status) && (
                          <button
                            onClick={() => handlePayment(invoice)}
                            className="ml-2 inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
