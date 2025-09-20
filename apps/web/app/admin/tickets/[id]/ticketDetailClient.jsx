"use client";
import { useEffect, useMemo, useState } from 'react';
import { AdminAPI } from '../../../lib/adminApi';
import { useAuth } from '../../../providers';
import { getSocket } from '../../../lib/socket';
import Link from 'next/link';
import { 
  Card, 
  Button, 
  FormInput,
  FormSelect,
  FormTextarea,
  StatusBadge,
  Tabs,
  Message,
  LoadingSpinner
} from '../../components/ui';

export default function TicketDetailClient({ id }) {
  const { user } = useAuth();
  const [t, setT] = useState(null);
  const [msg, setMsg] = useState('');
  const [note, setNote] = useState('');
  const [view, setView] = useState('public');
  const [session, setSession] = useState({ tool: 'ANYDESK', joinLink: '', code: '' });
  const [loading, setLoading] = useState(true);
  
  async function load() { 
    try {
      setLoading(true);
      const r = await AdminAPI.ticket(id); 
      setT(r);
    } catch (error) {
      console.error("Error loading ticket:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { load(); }, [id]);
  
  useEffect(() => {
    const socket = getSocket();
    socket.emit('join-ticket', { ticketId: id });
    
    const onMsg = (m) => { 
      setT(prev => prev ? { ...prev, messages: [...prev.messages, m] } : prev); 
    };
    
    const onUpd = () => { load(); };
    const onSess = () => { load(); };
    
    socket.on('ticket:message', onMsg);
    socket.on('ticket:update', onUpd);
    socket.on('ticket:session', onSess);
    
    return () => {
      socket.emit('leave-ticket', { ticketId: id });
      socket.off('ticket:message', onMsg);
      socket.off('ticket:update', onUpd);
      socket.off('ticket:session', onSess);
    };
  }, [id]);
  
  const publicMessages = useMemo(() => 
    (t?.messages || [])
      .filter(m => !m.internal)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)), 
    [t]
  );
  
  const internalNotes = useMemo(() => 
    (t?.messages || [])
      .filter(m => m.internal)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)), 
    [t]
  );
  
  async function sendMessage(e) { 
    e.preventDefault(); 
    
    if (!msg.trim()) return;
    
    try {
      await AdminAPI.ticketMessage(id, user?.sub, msg, false); 
      setMsg(''); 
      await load();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
  
  async function addNote(e) { 
    e.preventDefault(); 
    
    if (!note.trim()) return;
    
    try {
      await AdminAPI.ticketMessage(id, user?.sub, note, true); 
      setNote(''); 
      await load();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }
  
  async function startSession(e) { 
    e.preventDefault(); 
    
    try {
      await AdminAPI.startRemoteSession(id, { ...session, technicianId: user?.sub }); 
      setSession({ tool: 'ANYDESK', joinLink: '', code: '' }); 
      await load();
    } catch (error) {
      console.error("Error starting session:", error);
    }
  }
  
  const paid = t?.billingStatus === 'PAID';
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!t) {
    return (
      <div className="py-12">
        <Card>
          <div className="text-center py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ticket Not Found</h3>
            <p className="text-gray-500">The ticket you are looking for does not exist or has been deleted.</p>
            <div className="mt-4">
              <Link href="/admin/tickets">
                <Button variant="primary">Back to Tickets</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {t.code} — {t.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={t.type} />
            <StatusBadge status={t.status} />
            <StatusBadge status={t.priority} />
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Billing: {t.billingStatus}
            </span>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
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
          
          <Link href="/admin/tickets">
            <Button 
              variant="secondary"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              }
            >
              Back to List
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">Customer</span>
                <span className="text-gray-900">{t.customer?.email || '—'}</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">Assigned To</span>
                <span className="text-gray-900">{t.assignedTo?.email || 'Unassigned'}</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">Invoice</span>
                <span className="text-gray-900">{t.invoice?.number || '—'} ({t.invoice?.status || '—'})</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">Payment</span>
                <span className="text-gray-900">{t.payment?.status || '—'}</span>
              </div>
            </div>
            
            <InlineEditor t={t} onSave={load} />
          </Card>
          
          <Card>
            <Tabs
              tabs={[
                { id: 'public', label: 'Customer Chat' },
                { id: 'internal', label: 'Internal Notes' }
              ]}
              activeTab={view}
              onChange={setView}
            />
            
            {view === 'public' ? (
              <div>
                <div className="space-y-4 mb-6">
                  {publicMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No messages yet. Start the conversation with the customer.
                    </div>
                  ) : (
                    publicMessages.map(m => (
                      <Message
                        key={m.id}
                        content={m.content}
                        sender={m.sender}
                        timestamp={m.createdAt}
                      />
                    ))
                  )}
                </div>
                
                <form onSubmit={sendMessage}>
                  <FormTextarea
                    label="Reply to Customer"
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    rows={4}
                    placeholder="Type your message here..."
                  />
                  
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={!msg.trim()}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    }
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            ) : (
              <div>
                <div className="space-y-4 mb-6">
                  {internalNotes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No internal notes yet. Add a note for other team members.
                    </div>
                  ) : (
                    internalNotes.map(m => (
                      <Message
                        key={m.id}
                        content={m.content}
                        sender={m.sender}
                        timestamp={m.createdAt}
                        isInternal={true}
                      />
                    ))
                  )}
                </div>
                
                <form onSubmit={addNote}>
                  <FormTextarea
                    label="Add Internal Note"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={4}
                    placeholder="Add notes for other team members (not visible to customer)..."
                  />
                  
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={!note.trim()}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                    }
                  >
                    Add Note
                  </Button>
                </form>
              </div>
            )}
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card 
            title="Remote Session"
            className="mb-6"
          >
            {!paid ? (
              <div className="py-4 px-6 bg-yellow-50 rounded-md border border-yellow-200 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Payment Required</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Payment not confirmed. Session can start only after billing is PAID.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={startSession} className="mb-6">
                <div className="grid grid-cols-1 gap-4">
                  <FormSelect
                    label="Tool"
                    value={session.tool}
                    onChange={e => setSession(s => ({ ...s, tool: e.target.value }))}
                    options={['ANYDESK', 'TEAMVIEWER', 'ZOOM', 'MEET']}
                  />
                  
                  <FormInput
                    label="Join Link"
                    value={session.joinLink}
                    onChange={e => setSession(s => ({ ...s, joinLink: e.target.value }))}
                    placeholder="https://..."
                  />
                  
                  <FormInput
                    label="Code"
                    value={session.code}
                    onChange={e => setSession(s => ({ ...s, code: e.target.value }))}
                    placeholder="e.g., 123 456 789"
                  />
                </div>
                
                <div className="mt-4">
                  <Button 
                    type="submit" 
                    variant="primary"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    }
                    fullWidth
                  >
                    Start Remote Session
                  </Button>
                </div>
              </form>
            )}
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Past Sessions</h3>
              
              {(t.remoteSessions || []).length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No past sessions
                </div>
              ) : (
                <div className="space-y-4">
                  {(t.remoteSessions || [])
                    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
                    .map(rs => (
                      <Card key={rs.id} className="bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">{rs.tool}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rs.endedAt ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                            {rs.endedAt ? 'Completed' : 'Ongoing'}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Started: {new Date(rs.startedAt).toLocaleString()}</span>
                          </div>
                          
                          {rs.endedAt && (
                            <div className="flex items-center gap-1 mt-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <span>Ended: {new Date(rs.endedAt).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        
                        {rs.joinLink && (
                          <div className="flex items-center gap-1 text-sm mb-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                            </svg>
                            <span className="text-blue-600 break-all">{rs.joinLink}</span>
                          </div>
                        )}
                        
                        {rs.code && (
                          <div className="flex items-center gap-1 text-sm">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                            </svg>
                            <span>Code: {rs.code}</span>
                          </div>
                        )}
                        
                        {!rs.endedAt && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <EndSession id={id} sessionId={rs.id} onDone={load} />
                          </div>
                        )}
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </Card>
          
          <Card title="Ticket Timeline">
            <div className="relative pl-6 pb-6 pt-2">
              {/* Timeline line */}
              <div className="absolute top-0 left-2.5 h-full w-0.5 bg-gray-200"></div>
              
              <div className="relative mb-6">
                <div className="absolute -left-5 mt-1.5 w-3 h-3 rounded-full border-2 border-blue-600 bg-white"></div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Ticket Created</p>
                  <p className="text-gray-500">{new Date(t.createdAt).toLocaleString()}</p>
                  <p className="text-gray-500 mt-1">Open for {since(new Date(t.createdAt))}</p>
                </div>
              </div>
              
              {(t.remoteSessions || []).length > 0 && (
                <div className="relative mb-6">
                  <div className="absolute -left-5 mt-1.5 w-3 h-3 rounded-full border-2 border-indigo-600 bg-white"></div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Remote Sessions</p>
                    <p className="text-gray-500">{t.remoteSessions.length} session(s) recorded</p>
                    <p className="text-gray-500 mt-1">
                      Latest: {new Date(t.remoteSessions.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0].startedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              
              {t.status === 'CLOSED' && (
                <div className="relative">
                  <div className="absolute -left-5 mt-1.5 w-3 h-3 rounded-full border-2 border-green-600 bg-white"></div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Ticket Closed</p>
                    <p className="text-gray-500">Resolved successfully</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InlineEditor({ t, onSave }) {
  const { user } = useAuth();
  const [title, setTitle] = useState(t.title);
  const [description, setDescription] = useState(t.description);
  const [status, setStatus] = useState(t.status);
  const [priority, setPriority] = useState(t.priority);
  const [assignee, setAssignee] = useState(t.assignedToId || '');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    (async () => {
      try {
        const r = await AdminAPI.listUsers();
        setUsers(r.items || []);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    })();
  }, []);
  
  async function save() {
    try {
      setLoading(true);
      await AdminAPI.updateTicket(t.id, {
        title,
        description,
        status,
        priority,
        assignedToId: assignee || null
      });
      onSave();
    } catch (error) {
      console.error("Error updating ticket:", error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="mb-4">
        <FormInput
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <FormTextarea
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={5}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <FormSelect
          label="Status"
          value={status}
          onChange={e => setStatus(e.target.value)}
          options={['NEW', 'OPEN', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED', 'CANCELED']}
        />
        
        <FormSelect
          label="Priority"
          value={priority}
          onChange={e => setPriority(e.target.value)}
          options={['LOW', 'MEDIUM', 'HIGH', 'URGENT']}
        />
        
        <FormSelect
          label="Assign Technician"
          value={assignee}
          onChange={e => setAssignee(e.target.value)}
          options={[
            { value: '', label: 'Unassigned' },
            ...users
              .filter(u => 
                u.roles?.includes('technician') || 
                u.roles?.includes('admin') || 
                u.roles?.includes('manager')
              )
              .map(u => ({ value: u.id, label: u.email }))
          ]}
        />
      </div>
      
      <Button
        variant="primary"
        onClick={save}
        disabled={loading}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
          </svg>
        }
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
      
      <div className="text-xs text-gray-500 mt-4">
        Opened: {new Date(t.createdAt).toLocaleString()} • Open for {since(new Date(t.createdAt))}
      </div>
    </div>
  );
}

function EndSession({ id, sessionId, onDone }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function end() {
    try {
      setLoading(true);
      await AdminAPI.endRemoteSession(id, {
        sessionId,
        notes,
        technicianId: user?.sub
      });
      onDone();
    } catch (error) {
      console.error("Error ending session:", error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <FormInput
        label="Notes (optional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="What was done"
      />
      
      <Button
        variant="primary"
        onClick={end}
        disabled={loading}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
          </svg>
        }
      >
        {loading ? 'Ending...' : 'End Session'}
      </Button>
    </div>
  );
}

function since(date) {
  const ms = Date.now() - date.getTime();
  const m = Math.floor(ms / 60000);
  
  if (m < 60) return `${m} min`;
  
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr`;
  
  const d = Math.floor(h / 24);
  return `${d} d`;
}
