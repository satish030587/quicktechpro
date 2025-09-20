"use client";
import { useEffect, useState } from 'react';
import { AdminCustomersAPI as AdminAPI } from '../../lib/adminApi';
import Link from 'next/link';
import { 
  Card, 
  Button, 
  FormInput, 
  FormSelect,
  FormCheckbox,
  Tabs,
  StatusBadge,
  EmptyState,
  LoadingSpinner,
  Pagination
} from '../components/ui';

export default function CustomersClient() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState({ name: '', phone: '', isActive: true });
  
  async function load() {
    try {
      setLoading(true);
      const r = await AdminAPI.list(q);
      setList(r.items || []);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { load(); }, [q]);
  
  async function open(c) {
    try {
      setSel(c);
      setLoading(true);
      const d = await AdminAPI.detail(c.id);
      setProfile(d);
      setEdit({ name: d.user.name || '', phone: d.user.phone || '', isActive: d.user.isActive });
      setTab('tickets');
      setPage(1);
      await loadTab(d.user.id, 'tickets', 1);
    } catch (error) {
      console.error("Error loading customer details:", error);
    } finally {
      setLoading(false);
    }
  }
  
  async function save() {
    try {
      setLoading(true);
      await AdminAPI.update(profile.user.id, edit);
      await open(profile.user);
    } catch (error) {
      console.error("Error updating customer:", error);
    } finally {
      setLoading(false);
    }
  }

  // Tabs & pagination
  const [tab, setTab] = useState('tickets');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [tabData, setTabData] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  const pageSize = 10;
  
  async function loadTab(id, which, p) {
    try {
      setTabLoading(true);
      let res;
      if (which === 'tickets') res = await AdminAPI.tickets(id, p, pageSize);
      else if (which === 'invoices') res = await AdminAPI.invoices(id, p, pageSize);
      else if (which === 'quotes') res = await AdminAPI.quotes(id, p, pageSize);
      else res = await AdminAPI.payments(id, p, pageSize);
      
      setTabData(res.items || []);
      setPages(Math.max(1, Math.ceil((res.total || 0) / pageSize)));
    } catch (error) {
      console.error(`Error loading ${which}:`, error);
    } finally {
      setTabLoading(false);
    }
  }
  
  function changeTab(which) {
    if (!profile) return;
    setTab(which);
    setPage(1);
    loadTab(profile.user.id, which, 1);
  }
  
  function changePage(p) {
    if (!profile) return;
    setPage(p);
    loadTab(profile.user.id, tab, p);
  }
  
  return (
    <div className="pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Customers</h1>
          <p className="text-sm text-gray-600">View and manage customer accounts</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link href="/admin/customers/new">
            <Button
              variant="primary"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              }
            >
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <FormInput
              label="Search Customers"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name, email, or phone"
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              }
            />
          </Card>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : list.length === 0 ? (
            <EmptyState
              title="No customers found"
              description="Try adjusting your search or add a new customer."
              action={
                <Link href="/admin/customers/new">
                  <Button variant="primary">Add Customer</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {list.map((c) => (
                <Card 
                  key={c.id} 
                  className={`transition-colors cursor-pointer hover:bg-gray-50 ${sel?.id === c.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => open(c)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{c.email}</h3>
                      <p className="text-sm text-gray-500 mt-1">{c.name || '—'}</p>
                    </div>
                    {sel?.id === c.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                      </svg>
                      Tickets: {c._count?.ticketsAsCustomer || 0}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Invoices: {c._count?.invoices || 0}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                      </svg>
                      Quotes: {c._count?.quotes || 0}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-3">
          <Card>
            {!profile ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No customer selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a customer to view and edit their details</p>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div>
                <div className="pb-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">{profile.user.email}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Customer ID: {profile.user.id}
                  </p>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Name"
                    value={edit.name}
                    onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))}
                  />
                  
                  <FormInput
                    label="Phone"
                    value={edit.phone}
                    onChange={(e) => setEdit((s) => ({ ...s, phone: e.target.value }))}
                  />
                  
                  <div className="md:col-span-2">
                    <FormCheckbox
                      label="Account is active"
                      checked={edit.isActive}
                      onChange={(e) => setEdit((s) => ({ ...s, isActive: e.target.checked }))}
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button
                    variant="primary"
                    onClick={save}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    }
                  >
                    Save Changes
                  </Button>
                </div>
                
                <div className="mt-8">
                  <Tabs
                    tabs={[
                      { id: 'tickets', label: 'Tickets' },
                      { id: 'invoices', label: 'Invoices' },
                      { id: 'quotes', label: 'Quotes' },
                      { id: 'payments', label: 'Payments' }
                    ]}
                    activeTab={tab}
                    onChange={changeTab}
                  />
                  
                  {tabLoading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner />
                    </div>
                  ) : tabData.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No {tab} found for this customer.</p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {tab === 'tickets' && tabData.map(t => (
                        <Card key={t.id} className="bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900 mr-2">{t.code}</span>
                                <StatusBadge status={t.status} />
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{t.title}</p>
                            </div>
                            <Link href={`/admin/tickets/${t.id}`}>
                              <Button size="sm" variant="secondary">View</Button>
                            </Link>
                          </div>
                        </Card>
                      ))}
                      
                      {tab === 'invoices' && tabData.map(i => (
                        <Card key={i.id} className="bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900 mr-2">{i.number}</span>
                                <StatusBadge status={i.status} />
                              </div>
                              <p className="text-sm text-gray-500 mt-1">₹{i.total}</p>
                            </div>
                            <Link href={`/admin/finance/invoices/${i.id}`}>
                              <Button size="sm" variant="secondary">View</Button>
                            </Link>
                          </div>
                        </Card>
                      ))}
                      
                      {tab === 'quotes' && tabData.map(q => (
                        <Card key={q.id} className="bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900 mr-2">{q.title}</span>
                                <StatusBadge status={q.status} />
                              </div>
                              <p className="text-sm text-gray-500 mt-1">₹{q.total}</p>
                            </div>
                            <Link href={`/admin/quotations/${q.id}`}>
                              <Button size="sm" variant="secondary">View</Button>
                            </Link>
                          </div>
                        </Card>
                      ))}
                      
                      {tab === 'payments' && tabData.map(p => (
                        <Card key={p.id} className="bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900 mr-2">₹{p.amount}</span>
                                <StatusBadge status={p.status} />
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Invoice: {p.invoice?.number || p.invoiceId}</p>
                            </div>
                            <Link href={`/admin/finance/payments/${p.id}`}>
                              <Button size="sm" variant="secondary">View</Button>
                            </Link>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {tabData.length > 0 && (
                    <div className="mt-6">
                      <Pagination 
                        totalPages={pages}
                        currentPage={page}
                        onPageChange={changePage}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
