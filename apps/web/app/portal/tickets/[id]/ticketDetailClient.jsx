"use client";
import { useEffect, useState } from 'react';
import { CustomerAPI } from '../../../lib/customerApi';
import { getSocket } from '../../../lib/socket';
import Link from 'next/link';

// Status badge component with appropriate colors
function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase() || '';
  
  // Colors for different status types
  const colors = {
    'new': 'bg-blue-100 text-blue-800',
    'open': 'bg-cyan-100 text-cyan-800',
    'in_progress': 'bg-indigo-100 text-indigo-800',
    'on_hold': 'bg-yellow-100 text-yellow-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-gray-100 text-gray-800',
    'canceled': 'bg-red-100 text-red-800',
    'cancelled': 'bg-red-100 text-red-800',
    
    // Ticket types
    'remote': 'bg-violet-100 text-violet-800',
    'onsite': 'bg-emerald-100 text-emerald-800',
    'webdev': 'bg-sky-100 text-sky-800',
    
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

export default function TicketDetailClient({ id }) {
  const [t, setT] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [edit, setEdit] = useState({ title: '', description: '' });
  
  async function load() {
    try {
      setLoading(true);
      const r = await CustomerAPI.ticket(id);
      setT(r);
      setEdit({ title: r.title || '', description: r.description || '' });
    } catch (error) {
      console.error("Error loading ticket details:", error);
    } finally {
      setLoading(false);
    }
  }
  
  async function saveEdits(e){
    e.preventDefault();
    try { await CustomerAPI.updateTicket(id, edit); setEditing(false); await load(); }
    catch (err){ console.error(err); alert('Failed to update ticket'); }
  }
  
  async function cancelTicket(){
    if (!confirm('Are you sure you want to cancel this ticket?')) return;
    try { await CustomerAPI.cancelTicket(id); await load(); }
    catch(err){ console.error(err); alert('Failed to cancel'); }
  }
  
  useEffect(() => { 
    load(); 
  }, [id]);
  
  useEffect(() => {
    const socket = getSocket();
    socket.emit('join-ticket', { ticketId: id });
    
    const onMsg = (m) => { 
      setT(prev => prev ? { ...prev, messages: [...prev.messages, m] } : prev); 
    };
    
    socket.on('ticket:message', onMsg);
    
    return () => { 
      socket.emit('leave-ticket', { ticketId: id }); 
      socket.off('ticket:message', onMsg);
    };
  }, [id]);
  
  async function send(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    
    try {
      await CustomerAPI.ticketMessage(id, msg);
      setMsg('');
      await load();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
  
  if (loading || !t) {
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
              href="/portal/tickets"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t.code}</h1>
          </div>
          <h2 className="text-xl text-gray-800">{t.title}</h2>
        </div>
        
        <div className="flex gap-2">
          <StatusBadge status={t.type} />
          <StatusBadge status={t.status} />
          <button onClick={()=>setEditing(true)} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 bg-white hover:bg-gray-50">Edit</button>
          <button onClick={cancelTicket} className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 bg-white hover:bg-red-50">Cancel</button>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Details</h3>
        {editing ? (
          <form onSubmit={saveEdits} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Title</label>
              <input value={edit.title} onChange={e=>setEdit(s=>({...s,title:e.target.value}))} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <textarea rows={5} value={edit.description} onChange={e=>setEdit(s=>({...s,description:e.target.value}))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm">Save</button>
              <button type="button" onClick={()=>setEditing(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-600">
            {t.description ? (
              <p>{t.description}</p>
            ) : (
              <p className="italic text-gray-400">No description provided</p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-gray-200">
          <div>
            <div className="text-sm text-gray-500 mb-1">Created On</div>
            <div className="text-gray-900">{new Date(t.createdAt).toLocaleString()}</div>
          </div>
          
          {t.assignedTo && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Assigned To</div>
              <div className="text-gray-900">{t.assignedTo.name || t.assignedTo.email}</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation</h3>
        
        <div className="space-y-4 mb-6">
          {(t.messages || [])
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map(m => {
              const isCustomer = !m.sender;
              return (
                <div 
                  key={m.id} 
                  className={`p-4 rounded-lg ${isCustomer 
                    ? 'bg-blue-50 border border-blue-100 ml-auto max-w-[80%] sm:max-w-[70%]' 
                    : 'bg-gray-50 border border-gray-100 max-w-[80%] sm:max-w-[70%]'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">
                      {isCustomer ? 'You' : m.sender?.name || m.sender?.email || 'Support Staff'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {m.content}
                  </div>
                </div>
              );
            })}
            
          {t.messages?.length === 0 && (
            <div className="text-center py-8 text-gray-500 italic">
              No messages yet. Start the conversation by sending a message below.
            </div>
          )}
        </div>
        
        <form onSubmit={send} className="border-t border-gray-200 pt-5">
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Your Message
            </label>
            <textarea 
              id="message"
              rows={4} 
              value={msg} 
              onChange={e => setMsg(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              placeholder="Type your message here..."
              required
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
