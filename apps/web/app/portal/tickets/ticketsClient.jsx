"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CustomerAPI } from '../../lib/customerApi';
import { useAuth } from '../../providers';
import useRealTimeTickets from '../../hooks/useRealTimeTickets';

// Status badge component with appropriate colors
function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase() || '';

  // Colors for different status types
  const colors = {
    new: 'bg-blue-100 text-blue-800',
    open: 'bg-cyan-100 text-cyan-800',
    in_progress: 'bg-indigo-100 text-indigo-800',
    on_hold: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    canceled: 'bg-red-100 text-red-800',
    cancelled: 'bg-red-100 text-red-800',

    // Ticket types
    remote: 'bg-violet-100 text-violet-800',
    onsite: 'bg-emerald-100 text-emerald-800',
    webdev: 'bg-sky-100 text-sky-800',

    // Default
    default: 'bg-gray-100 text-gray-800',
  };

  const colorClass = colors[normalizedStatus] || colors.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}

export default function TicketsClient() {
  const [status, setStatus] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const highlightTimeoutsRef = useRef(new Map());
  const { user } = useAuth();

  const sortTickets = useCallback((items) => {
    return [...items].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, []);

  const highlightTicket = useCallback((id) => {
    if (!id) return;
    setHighlightedIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });

    const timeouts = highlightTimeoutsRef.current;
    if (timeouts.has(id)) {
      clearTimeout(timeouts.get(id));
    }
    const timeoutId = setTimeout(() => {
      setHighlightedIds((prev) => prev.filter((existing) => existing !== id));
      timeouts.delete(id);
    }, 4000);
    timeouts.set(id, timeoutId);
  }, []);

  useEffect(() => {
    return () => {
      highlightTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      highlightTimeoutsRef.current.clear();
    };
  }, []);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CustomerAPI.tickets(status || undefined);
      const items = sortTickets(response.items || []);
      setTickets(items);
      setHighlightedIds([]);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  }, [sortTickets, status]);

  useEffect(() => {
    loadTickets();
    const intervalId = setInterval(loadTickets, 60000);
    return () => clearInterval(intervalId);
  }, [loadTickets]);

  const handleTicketUpsert = useCallback(
    async (payload) => {
      const ticketId = payload?.ticketId || payload?.id;
      if (!ticketId) return;

      try {
        const ticket = await CustomerAPI.ticket(ticketId);
        if (!ticket) return;

        const matchesFilter = !status || ticket.status === status;

        setTickets((prev) => {
          const existingIndex = prev.findIndex((item) => item.id === ticket.id);

          if (!matchesFilter) {
            if (existingIndex === -1) return prev;
            const updated = prev.slice();
            updated.splice(existingIndex, 1);
            return updated;
          }

          let updated;
          if (existingIndex === -1) {
            updated = [ticket, ...prev];
            highlightTicket(ticket.id);
          } else {
            updated = prev.slice();
            updated[existingIndex] = { ...updated[existingIndex], ...ticket };
          }

          return sortTickets(updated);
        });
      } catch (error) {
        console.error('Failed to refresh ticket after realtime event:', error);
        loadTickets();
      }
    },
    [highlightTicket, loadTickets, sortTickets, status],
  );

  const handleTicketDeleted = useCallback((payload) => {
    const ticketId = payload?.ticketId || payload?.id;
    if (!ticketId) return;
    setTickets((prev) => prev.filter((item) => item.id !== ticketId));
  }, []);

  useRealTimeTickets({
    onTicketCreated: user ? handleTicketUpsert : undefined,
    onTicketUpdated: user ? handleTicketUpsert : undefined,
    onTicketDeleted: user ? handleTicketDeleted : undefined,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage your support tickets</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex items-center gap-3">
            <div className="w-full sm:w-48">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="status-filter"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Tickets</option>
                {['NEW', 'OPEN', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED', 'CANCELED'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Link
            href="/portal/tickets/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            New Ticket
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {status ? `You don't have any ${status.toLowerCase()} tickets` : "You don't have any tickets yet"}
          </p>
          <div className="mt-6">
            <Link
              href="/portal/tickets/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create your first ticket
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => {
            const isHighlighted = highlightedIds.includes(ticket.id);
            return (
              <div
                key={ticket.id}
                className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-shadow ${
                  isHighlighted ? 'ring-2 ring-blue-400 ring-offset-2 shadow-lg' : 'hover:shadow-md'
                }`}
              >
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <span className="font-medium text-gray-900">{ticket.code}</span>
                  <div className="flex gap-2">
                    <StatusBadge status={ticket.type} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-gray-900 font-medium mb-3 line-clamp-2">{ticket.title}</h3>

                  <div className="text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1 mb-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>Created: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '—'}</span>
                    </div>
                    {ticket.assignedTo && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span>Assigned: {ticket.assignedTo.name || ticket.assignedTo.email}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/portal/tickets/${ticket.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
