"use client";
import { useState } from 'react';
import { CustomerAPI } from '../../lib/customerApi';

const plans = [
  { code: 'BASIC', label: 'Basic (1 hour)', amount: 1499, description: 'Perfect for quick fixes and minor issues' },
  { code: 'ADVANCED', label: 'Advanced (2 hours)', amount: 1799, description: 'Ideal for complex problems or multiple issues' },
  { code: 'PREMIUM', label: 'Premium (3+ hours)', amount: 1999, description: 'For comprehensive support or system overhauls' },
];

export default function RemoteSupportClient() {
  const [plan, setPlan] = useState('BASIC');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  
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
  
  async function handlePayment() {
    if (!title.trim()) {
      alert('Please add a short title for the issue');
      return;
    }
    
    try {
      setLoading(true);
      
      const ok = await loadScript();
      if (!ok) {
        alert('Unable to load payment SDK. Please try again later.');
        setLoading(false);
        return;
      }
      
      const { order, keyId } = await CustomerAPI.createRazorpayOrderRemote(plan, title, details);
      
      const selectedPlan = plans.find(p => p.code === plan);
      const razorpay = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'QuickTechPro',
        description: `Remote Support — ${selectedPlan?.label}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const result = await CustomerAPI.verifyRazorpayPayment(response);
            if (result.ticketId) {
              window.location.href = `/portal/tickets/${result.ticketId}`;
            } else {
              alert('Payment verified successfully');
            }
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
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Remote Support</h1>
        <p className="mt-1 text-sm text-gray-500">Get expert help from our technicians without leaving your home</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select a Support Plan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {plans.map(planItem => (
            <div 
              key={planItem.code}
              onClick={() => setPlan(planItem.code)}
              className={`cursor-pointer rounded-lg p-4 border ${
                plan === planItem.code 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              } transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">{planItem.label}</h3>
                {plan === planItem.code && (
                  <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">₹{planItem.amount}</div>
              <p className="text-sm text-gray-500">{planItem.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Describe Your Issue</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="issue-title" className="block text-sm font-medium text-gray-700 mb-1">
              Short Title <span className="text-red-500">*</span>
            </label>
            <input
              id="issue-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Laptop very slow"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              A brief description of your issue
            </p>
          </div>
          
          <div>
            <label htmlFor="issue-details" className="block text-sm font-medium text-gray-700 mb-1">
              Details
            </label>
            <textarea
              id="issue-details"
              rows={6}
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Please include:
- What you were doing when the issue occurred
- Any error messages you saw
- Your computer/device type and operating system
- How long you've had this issue"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              The more details you provide, the faster we can help you
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">How it works</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                After payment, our technician will contact you to schedule a remote session. You'll receive instructions on how to allow secure access to your computer.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handlePayment}
          disabled={loading || !title.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            `Pay ₹${plans.find(p => p.code === plan)?.amount} & Create Ticket`
          )}
        </button>
      </div>
    </div>
  );
}

