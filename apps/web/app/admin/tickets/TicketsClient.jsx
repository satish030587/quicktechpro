"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { AdminAPI } from '../../lib/adminApi';
import Link from 'next/link';
import {
  StatusBadge,
  Card,
  Button,
  FormInput,
  FormSelect,
  FilterPanel,
  PageHeader,
  EmptyState,
} from '../components/ui';
import useRealTimeTickets from '../../hooks/useRealTimeTickets';

const INITIAL_FILTERS = { status: '', type: '', priority: '', q: '', billingStatus: '' };

function matchesFilters(ticket, filters) {
  if (!ticket) return false;
  const {
    status,
    type,
    priority,
    assignedToId,
    customerEmail,
    billingStatus,
    q,
  } = filters || {};

  if (status && ticket.status !== status) return false;
  if (type && ticket.type !== type) return false;
  if (priority && ticket.priority !== priority) return false;
  if (billingStatus && ticket.billingStatus !== billingStatus) return false;
  if (assignedToId && ticket.assignedToId !== assignedToId) return false;
  if (customerEmail && ticket.customer?.email !== customerEmail) return false;

  if (q) {
    const lowered = q.toLowerCase();
    const haystacks = [ticket.title, ticket.description, ticket.code]
      .filter(Boolean)
      .map((value) => value.toLowerCase());
    const match = haystacks.some((value) => value.includes(lowered));
    if (!match) return false;
  }

  return true;
}

export default function TicketsClient() {
  const [filters, setFilters] = useState(() => ({ ...INITIAL_FILTERS }));
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const filtersRef = useRef(filters);
  const highlightTimeoutsRef = useRef(new Map());

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

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

  const load = useCallback(
    async (overrideFilters, options = {}) => {
      const { silent = false } = options;
      const activeFilters = overrideFilters ?? filtersRef.current;

      try {
        if (!silent) setLoading(true);
        const response = await AdminAPI.ticketsList(activeFilters);
        const items = sortTickets(response.items || []);
        setData({ items, total: response.total ?? items.length });
        if (!silent) setHighlightedIds([]);
      } catch (error) {
        console.error('Error loading tickets:', error);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [sortTickets],
  );

  useEffect(() => {
    load();
  }, [load]);

  const onChange = useCallback((key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      filtersRef.current = next;
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    const cleared = { ...INITIAL_FILTERS };
    filtersRef.current = cleared;
    setFilters(cleared);
    load(cleared);
  }, [load]);

  const handleTicketCreated = useCallback(
    async (payload) => {
      const ticketId = payload?.ticketId || payload?.id;
      if (!ticketId) return;

      try {
        const ticket = await AdminAPI.ticket(ticketId);
        if (!ticket) return;

        setData((prev) => {
          const items = prev.items || [];
          const existingIndex = items.findIndex((item) => item.id === ticket.id);
          const matches = matchesFilters(ticket, filtersRef.current);
          let nextItems = items;
          let nextTotal = prev.total ?? items.length;

          if (!matches) {
            if (existingIndex === -1) return prev;
            nextItems = [...items.slice(0, existingIndex), ...items.slice(existingIndex + 1)];
            nextTotal = Math.max(0, nextTotal - 1);
            return { ...prev, items: nextItems, total: nextTotal };
          }

          if (existingIndex === -1) {
            nextItems = [ticket, ...items];
            nextTotal += 1;
            highlightTicket(ticket.id);
          } else {
            nextItems = items.slice();
            nextItems[existingIndex] = { ...nextItems[existingIndex], ...ticket };
          }

          return {
            items: sortTickets(nextItems),
            total: nextTotal,
          };
        });
      } catch (error) {
        console.error('Failed to fetch ticket after realtime create:', error);
        load(undefined, { silent: true });
      }
    },
    [highlightTicket, load, sortTickets],
  );

  const handleTicketUpdated = useCallback(
    async (payload = {}) => {
      const ticketId = payload?.ticketId || payload?.id;
      if (!ticketId) return;

      try {
        const ticket = await AdminAPI.ticket(ticketId);
        if (!ticket) return;

        setData((prev) => {
          const items = prev.items || [];
          const existingIndex = items.findIndex((item) => item.id === ticket.id);
          const matches = matchesFilters(ticket, filtersRef.current);

          if (!matches) {
            if (existingIndex === -1) return prev;
            const nextItems = [...items.slice(0, existingIndex), ...items.slice(existingIndex + 1)];
            const nextTotal = Math.max(0, (prev.total ?? items.length) - 1);
            return { items: nextItems, total: nextTotal };
          }

          if (existingIndex === -1) {
            const nextItems = sortTickets([ticket, ...items]);
            return { items: nextItems, total: (prev.total ?? items.length) + 1 };
          }

          const nextItems = items.slice();
          nextItems[existingIndex] = { ...nextItems[existingIndex], ...ticket };
          return { items: sortTickets(nextItems), total: prev.total };
        });
      } catch (error) {
        console.error('Failed to fetch ticket after realtime update:', error);
        load(undefined, { silent: true });
      }
    },
    [load, sortTickets],
  );

  const handleTicketDeleted = useCallback((payload = {}) => {
    const ticketId = payload?.ticketId || payload?.id;
    if (!ticketId) return;

    setData((prev) => {
      const items = prev.items || [];
      const nextItems = items.filter((item) => item.id !== ticketId);
      if (nextItems.length === items.length) {
        return prev;
      }
      const nextTotal = Math.max(0, (prev.total ?? items.length) - 1);
      return { items: nextItems, total: nextTotal };
    });
  }, []);

  useRealTimeTickets({
    onTicketCreated: handleTicketCreated,
    onTicketUpdated: handleTicketUpdated,
    onTicketDeleted: handleTicketDeleted,
  });

  return (
    <div className="pb-6">
      <PageHeader
        title="Tickets"
        description="Manage and track all customer support tickets"
        actions={[
          <Button
            key="new-ticket"
            variant="primary"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            }
          >
            New Ticket
          </Button>,
        ]}
      />

      <FilterPanel onApply={() => load()} onReset={resetFilters}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormSelect
            label="Status"
            value={filters.status}
            onChange={(e) => onChange('status', e.target.value)}
            options={['NEW', 'OPEN', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED', 'CANCELED']}
            placeholder="All Statuses"
          />

          <FormSelect
            label="Type"
            value={filters.type}
            onChange={(e) => onChange('type', e.target.value)}
            options={['REMOTE', 'ONSITE', 'WEBDEV']}
            placeholder="All Types"
          />

          <FormSelect
            label="Priority"
            value={filters.priority}
            onChange={(e) => onChange('priority', e.target.value)}
            options={['LOW', 'MEDIUM', 'HIGH', 'URGENT']}
            placeholder="All Priorities"
          />

          <FormInput
            label="Search"
            value={filters.q}
            onChange={(e) => onChange('q', e.target.value)}
            placeholder="Search by title, code..."
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const nextFilters = { ...INITIAL_FILTERS, type: 'REMOTE', billingStatus: 'PAID' };
              filtersRef.current = nextFilters;
              setFilters(nextFilters);
              load(nextFilters);
            }}
          >
            Remote (Paid)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const nextFilters = { ...INITIAL_FILTERS, status: 'OPEN' };
              filtersRef.current = nextFilters;
              setFilters(nextFilters);
              load(nextFilters);
            }}
          >
            Open Tickets
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const nextFilters = { ...INITIAL_FILTERS, priority: 'URGENT' };
              filtersRef.current = nextFilters;
              setFilters(nextFilters);
              load(nextFilters);
            }}
          >
            Urgent Priority
          </Button>
        </div>
      </FilterPanel>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : data.items.length === 0 ? (
        <EmptyState
          title="No tickets found"
          description="Try adjusting your filters or create a new ticket"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
            </svg>
          }
          action={
            <Button
              variant="primary"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              }
            >
              Create Ticket
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.items.map((ticket) => (
            <Card
              key={ticket.id}
              className={`transition-shadow ${
                highlightedIds.includes(ticket.id) ? 'ring-2 ring-blue-400 ring-offset-2 shadow-lg' : 'hover:shadow-md'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-semibold text-gray-900">{ticket.code}</span>
                <StatusBadge status={ticket.type} type="type" />
                <StatusBadge status={ticket.status} type="status" />
                <StatusBadge status={ticket.priority} type="priority" />
              </div>

              <h3 className="text-gray-900 font-medium mb-3 line-clamp-2">{ticket.title}</h3>

              <div className="text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>Customer: {ticket.customer?.email || '—'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  <span>Assigned: {ticket.assignedTo?.email || 'Unassigned'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/tickets/${ticket.id}`}>
                  <Button
                    variant="secondary"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    }
                  >
                    View
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={async () => {
                    if (!confirm(`Delete ticket ${ticket.code}? This cannot be undone.`)) return;
                    try {
                      await AdminAPI.deleteTicket(ticket.id);
                      await load(undefined, { silent: false });
                    } catch (error) {
                      console.error(error);
                      alert('Failed to delete');
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {data.total > data.items.length && (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary">Load More</Button>
        </div>
      )}
    </div>
  );
}
