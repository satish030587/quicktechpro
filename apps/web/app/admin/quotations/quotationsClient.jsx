"use client";
import { useEffect, useMemo, useState } from 'react';
import { AdminAPI } from '../../lib/adminApi';
import Link from 'next/link';
import { 
  Card, 
  Button, 
  FormInput,
  FormSelect,
  StatusBadge,
  PageHeader,
  EmptyState,
  LoadingSpinner,
  Tabs
} from '../components/ui';

export default function QuotationsClient() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', q: '' });
  const [form, setForm] = useState({ id: '', customerEmail: '', title: '', items: [] });
  const [currentTab, setCurrentTab] = useState('list');
  
  const total = useMemo(() => 
    (form.items || []).reduce((s, i) => s + (Number(i.price || 0) * (Number(i.qty || 1))), 0), 
    [form.items]
  );
  
  async function load() {
    try {
      setLoading(true);
      const r = await AdminAPI.quotesList(filter);
      setList(r.items || []);
    } catch (error) {
      console.error("Error loading quotations:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { load(); }, [filter.status, filter.q]);
  
  function addItem() {
    setForm(f => ({ ...f, items: [...f.items, { name: '', qty: 1, price: '' }] }));
  }
  
  function updItem(ix, k, v) {
    setForm(f => ({ ...f, items: f.items.map((it, i) => i === ix ? { ...it, [k]: v } : it) }));
  }
  
  function delItem(ix) {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== ix) }));
  }
  
  async function saveQuote(e) {
    e.preventDefault();
    
    if (!form.title) return;
    
    try {
      setLoading(true);
      const payload = { ...form, items: form.items };
      const r = await AdminAPI.quoteUpsert(payload);
      
      setForm({ 
        id: r.id, 
        customerEmail: r.customer?.email || form.customerEmail, 
        title: r.title, 
        items: r.items.map(i => ({ name: i.name, qty: i.qty, price: i.price })) 
      });
      
      await load();
      
      if (!form.id) {
        // If it was a new quote, switch to list view after creating
        setCurrentTab('list');
      }
    } catch (error) {
      console.error("Error saving quote:", error);
    } finally {
      setLoading(false);
    }
  }
  
  async function edit(q) {
    setForm({ 
      id: q.id, 
      customerEmail: q.customer?.email || '', 
      title: q.title, 
      items: q.items.map(i => ({ name: i.name, qty: i.qty, price: i.price })) 
    });
    setCurrentTab('edit');
  }
  
  async function setStatus(id, status) {
    try {
      setLoading(true);
      await AdminAPI.quoteSetStatus(id, status);
      await load();
    } catch (error) {
      console.error("Error updating quote status:", error);
    } finally {
      setLoading(false);
    }
  }
  
  async function convert(id) {
    try {
      setLoading(true);
      const inv = await AdminAPI.quoteConvertToInvoice(id);
      alert(`Invoice ${inv.number} created`);
      await load();
    } catch (error) {
      console.error("Error converting quote to invoice:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ id: '', customerEmail: '', title: '', items: [] });
  }
  
  function handleNewQuote() {
    resetForm();
    setCurrentTab('new');
  }
  
  return (
    <div className="pb-6">
      <PageHeader
        title="Quotations"
        description="Create and manage customer quotes"
        actions={
          <Button
            variant="primary"
            onClick={handleNewQuote}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            }
          >
            New Quote
          </Button>
        }
      />

      <Card className="mb-6">
        <Tabs
          tabs={[
            { id: 'list', label: 'All Quotes' },
            { id: 'new', label: 'New Quote' },
            ...(form.id ? [{ id: 'edit', label: 'Edit Quote' }] : [])
          ]}
          activeTab={currentTab}
          onChange={setCurrentTab}
        />
      </Card>

      {currentTab === 'list' && (
        <div className="space-y-6">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSelect
                label="Status"
                value={filter.status}
                onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'DRAFT', label: 'Draft' },
                  { value: 'SENT', label: 'Sent' },
                  { value: 'ACCEPTED', label: 'Accepted' },
                  { value: 'REJECTED', label: 'Rejected' }
                ]}
              />
              
              <FormInput
                label="Search"
                value={filter.q}
                onChange={(e) => setFilter(f => ({ ...f, q: e.target.value }))}
                placeholder="Search by title"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                }
              />
              
              <div className="flex items-end">
                <Button 
                  variant="secondary" 
                  onClick={load}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  }
                >
                  Refresh
                </Button>
              </div>
            </div>
          </Card>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : list.length === 0 ? (
            <EmptyState
              title="No quotations found"
              description="Create a new quotation or adjust your filter criteria."
              action={
                <Button variant="primary" onClick={handleNewQuote}>Create Quote</Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {list.map(q => (
                <Card key={q.id}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900 mr-3">{q.title}</h3>
                        <StatusBadge status={q.status} />
                      </div>
                      
                      <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 mb-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          {q.customer?.email || 'No customer assigned'}
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          ₹{Number(q.total).toFixed(2)}
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          {new Date(q.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => edit(q)}
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        }
                      >
                        Edit
                      </Button>
                      
                      {q.status === 'DRAFT' && (
                        <Button 
                          size="sm" 
                          variant="primary"
                          onClick={() => setStatus(q.id, 'SENT')}
                          icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                          }
                        >
                          Send
                        </Button>
                      )}
                      
                      {q.status === 'SENT' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="success"
                            onClick={() => setStatus(q.id, 'ACCEPTED')}
                            icon={
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            }
                          >
                            Accept
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => setStatus(q.id, 'REJECTED')}
                            icon={
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {q.status === 'ACCEPTED' && (
                        <Button 
                          size="sm" 
                          variant="primary"
                          onClick={() => convert(q.id)}
                          icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                          }
                        >
                          Convert to Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {(currentTab === 'new' || currentTab === 'edit') && (
        <Card title={form.id ? 'Edit Quote' : 'New Quote'}>
          <form onSubmit={saveQuote} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Customer Email"
                value={form.customerEmail}
                onChange={(e) => setForm(f => ({ ...f, customerEmail: e.target.value }))}
                required={!form.id}
                disabled={!!form.id}
                placeholder="customer@example.com"
              />
              
              <FormInput
                label="Title"
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                required
                placeholder="Quote title"
              />
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Quote Items</h3>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">Total: ₹{total.toFixed(2)}</span>
                  <Button 
                    variant="secondary" 
                    onClick={addItem}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    }
                  >
                    Add Item
                  </Button>
                </div>
              </div>
              
              {form.items.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No items added to this quote yet.</p>
                  <Button 
                    variant="secondary" 
                    className="mt-4"
                    onClick={addItem}
                  >
                    Add First Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {form.items.map((item, index) => (
                    <Card key={index} className="bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6">
                          <FormInput
                            label="Item Name"
                            value={item.name}
                            onChange={(e) => updItem(index, 'name', e.target.value)}
                            placeholder="Service or product name"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <FormInput
                            label="Quantity"
                            type="number"
                            value={item.qty}
                            onChange={(e) => updItem(index, 'qty', Number(e.target.value))}
                            min="1"
                          />
                        </div>
                        
                        <div className="md:col-span-3">
                          <FormInput
                            label="Unit Price (₹)"
                            value={item.price}
                            onChange={(e) => updItem(index, 'price', e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                        
                        <div className="md:col-span-1 flex items-end">
                          <Button
                            variant="danger"
                            onClick={() => delItem(index)}
                            className="w-full"
                            icon={
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-2 text-sm text-gray-600">
                        Subtotal: ₹{(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <Button 
                variant="secondary" 
                onClick={() => setCurrentTab('list')}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                }
              >
                Cancel
              </Button>
              
              <Button 
                type="submit" 
                variant="primary"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                }
              >
                {form.id ? 'Update Quote' : 'Create Quote'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

