"use client";
import { useEffect, useState } from 'react';
import { AdminAPI } from '../../lib/adminApi';
import Link from 'next/link';
import { 
  Card, 
  Button, 
  StatusBadge,
  PageHeader,
  EmptyState,
  LoadingSpinner,
  Tabs
} from '../components/ui';

export default function FinanceClient() {
  const [inv, setInv] = useState([]);
  const [pay, setPay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('invoices');
  
  async function load() {
    try {
      setLoading(true);
      const a = await AdminAPI.invoices(); 
      setInv(a.items || []);
      
      const b = await AdminAPI.payments(); 
      setPay(b.items || []);
    } catch (error) {
      console.error("Error loading finance data:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { load(); }, []);
  
  async function reconcile(id, status) {
    try {
      if (status === 'REFUNDED') {
        const reason = prompt('Type REFUND to confirm and provide a reason (customer dissatisfaction).\nExample: REFUND - duplicate charge');
        if (!reason || reason.toUpperCase().indexOf('REFUND') !== 0) return alert('Refund cancelled.');
      }
      await AdminAPI.reconcilePayment(id, status);
      await load();
    } catch (error) {
      console.error("Error reconciling payment:", error);
    }
  }

  // Auto-refresh payments to keep statuses in sync
  useEffect(() => {
    const id = setInterval(() => { if (activeTab === 'payments') load(); }, 15000);
    return () => clearInterval(id);
  }, [activeTab]);
  
  return (
    <div className="pb-6">
      <PageHeader
        title="Finance"
        description="Manage invoices, payments, and financial transactions"
        actions={
          <div className="flex space-x-3">
            <Link href="/admin/finance/invoices/new">
              <Button
                variant="secondary"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                }
              >
                New Invoice
              </Button>
            </Link>
            
            <Link href="/admin/finance/payments/new">
              <Button
                variant="primary"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                }
              >
                Record Payment
              </Button>
            </Link>
          </div>
        }
      />

      <Card className="mb-6">
        <Tabs
          tabs={[
            { id: 'invoices', label: 'Invoices' },
            { id: 'payments', label: 'Payments' }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              {inv.length === 0 ? (
                <EmptyState
                  title="No invoices found"
                  description="Create an invoice to get started."
                  action={
                    <Link href="/admin/finance/invoices/new">
                      <Button variant="primary">Create Invoice</Button>
                    </Link>
                  }
                />
              ) : (
                inv.map(i => (
                  <Card key={i.id}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-3">{i.number}</h3>
                          <StatusBadge status={i.status} />
                        </div>
                        
                        <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            {i.customer?.email || 'Unknown customer'}
                          </div>
                          
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            ₹{i.total}
                          </div>
                          
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            {new Date(i.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex mt-4 md:mt-0 space-x-3">
                        <Link href={`/admin/finance/invoices/${i.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            Edit
                          </Button>
                        </Link>
                        
                        <Link href={`/admin/finance/invoices/${i.id}`}>
                          <Button size="sm" variant="primary">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'payments' && (
            <div className="space-y-4">
              {pay.length === 0 ? (
                <EmptyState
                  title="No payments found"
                  description="Record a payment to get started."
                  action={
                    <Link href="/admin/finance/payments/new">
                      <Button variant="primary">Record Payment</Button>
                    </Link>
                  }
                />
              ) : (
                pay.map(p => (
                  <Card key={p.id}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-3">₹{p.amount}</h3>
                          <div className="flex space-x-2">
                            <StatusBadge status={p.status} />
                            <StatusBadge status={p.method} />
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Invoice: {p.invoice?.number || 'Unknown'}
                          </div>
                          
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            {new Date(p.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex mt-4 md:mt-0 space-x-2">
                        <Button 
                          size="sm" 
                          variant="success" 
                          onClick={() => reconcile(p.id, 'SUCCESS')}
                          disabled={p.status === 'SUCCESS'}
                        >
                          Mark Success
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="danger" 
                          onClick={() => reconcile(p.id, 'FAILED')}
                          disabled={p.status === 'FAILED'}
                        >
                          Mark Failed
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="warning" 
                          onClick={() => reconcile(p.id, 'REFUNDED')}
                          disabled={p.status === 'REFUNDED'}
                        >
                          Refund
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
