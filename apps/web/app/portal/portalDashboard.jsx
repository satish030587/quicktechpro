"use client";
import { useEffect, useState } from 'react';
import { CustomerAPI } from '../lib/customerApi';
import Link from 'next/link';

export default function PortalDashboard() {
  const [data, setData] = useState(null);
  
  useEffect(() => { 
    CustomerAPI.dashboard().then(setData).catch(() => {}); 
  }, []);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome to your customer portal dashboard</p>
      </div>
      
      {!data ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-50 rounded-md p-3 mr-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Open Tickets</p>
                  <p className="text-2xl font-semibold text-gray-900">{data.openTickets}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/portal/tickets" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all tickets →
                </Link>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-50 rounded-md p-3 mr-4">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Quotes</p>
                  <p className="text-2xl font-semibold text-gray-900">{data.pendingQuotes}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/portal/quotes" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all quotes →
                </Link>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-50 rounded-md p-3 mr-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Due Invoices</p>
                  <p className="text-2xl font-semibold text-gray-900">{data.dueInvoices}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/portal/invoices" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all invoices →
                </Link>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-50 rounded-md p-3 mr-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Next Appointment</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {data.nextAppointment ? new Date(data.nextAppointment.scheduledAt).toLocaleString() : 'No upcoming appointments'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/portal/appointments" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all appointments →
                </Link>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link 
                href="/portal/tickets/new" 
                className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <div className="flex-shrink-0 mr-3 text-blue-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium">Create New Ticket</span>
              </Link>
              
              <Link 
                href="/portal/payments" 
                className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <div className="flex-shrink-0 mr-3 text-blue-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium">Make a Payment</span>
              </Link>
              
              <Link 
                href="/portal/remote-support" 
                className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <div className="flex-shrink-0 mr-3 text-blue-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium">Remote Support</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

