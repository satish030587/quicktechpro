"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  StatusBadge,
  KanbanColumn,
  KanbanCard,
  PageHeader,
  Button,
  FormInput,
  FormSelect,
  Card
} from '../../components/ui';
import { AdminAPI } from '../../../lib/adminApi';
import useRealTimeTickets from '../../../hooks/useRealTimeTickets';

const STATUSES = ['NEW', 'OPEN', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const TYPES = ['REMOTE', 'ONSITE', 'WEBDEV'];

const PRIORITY_ACCENTS = {
  LOW: 'border-l-4 border-l-teal-400',
  MEDIUM: 'border-l-4 border-l-amber-400',
  HIGH: 'border-l-4 border-l-orange-500',
  URGENT: 'border-l-4 border-l-rose-500'
};

const STATUS_META = {
  NEW: { title: 'New', subtitle: 'Awaiting triage', accent: 'sky' },
  OPEN: { title: 'Open', subtitle: 'Ready for assignment', accent: 'blue' },
  IN_PROGRESS: { title: 'In progress', subtitle: 'Being worked on', accent: 'emerald' },
  ON_HOLD: { title: 'On hold', subtitle: 'Waiting on customer/parts', accent: 'amber' },
  RESOLVED: { title: 'Resolved', subtitle: 'Pending confirmation', accent: 'emerald' },
  CLOSED: { title: 'Closed', subtitle: 'Completed tickets', accent: 'slate' }
};

const STATUS_ACCENT_BADGES = {
  sky: 'bg-sky-100 text-sky-700',
  blue: 'bg-blue-100 text-blue-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  slate: 'bg-slate-200 text-slate-700'
};

const QUICK_ACTIONS = {
  NEW: ['OPEN', 'IN_PROGRESS'],
  OPEN: ['IN_PROGRESS', 'ON_HOLD'],
  IN_PROGRESS: ['ON_HOLD', 'RESOLVED'],
  ON_HOLD: ['IN_PROGRESS', 'CLOSED'],
  RESOLVED: ['CLOSED', 'OPEN'],
  CLOSED: ['OPEN']
};

const SLA_HOURS = { NEW: 2, OPEN: 24, IN_PROGRESS: 48 };

function getSlaState(ticket) {
  const created = new Date(ticket.createdAt);
  const target = SLA_HOURS[ticket.status];
  if (!target || Number.isNaN(created.getTime())) return 'NONE';

  const hours = (Date.now() - created.getTime()) / 36e5;
  if (hours >= target) return 'BREACHED';
  if (hours >= target * 0.75) return 'RISK';
  return 'ON_TRACK';
}

function getSlaBadge(ticket) {
  const state = getSlaState(ticket);

  if (state === 'BREACHED') {
    return <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">SLA breached</span>;
  }

  if (state === 'RISK') {
    return <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">SLA at risk</span>;
  }

  if (state === 'ON_TRACK') {
    return <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">On track</span>;
  }

  return null;
}

function formatRelative(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'unknown';
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString();
}

function describeAverageAge(hours) {
  if (!hours || Number.isNaN(hours)) return 'Fresh queue';
  if (hours < 1) return '<1 hr average age';
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} avg age`;
  }
  return `${Math.max(1, Math.round(hours))} hr avg age`;
}

export default function TicketBoardClient() {
  const router = useRouter();

  const initialColumns = useMemo(() => STATUSES.reduce((acc, status) => ({ ...acc, [status]: [] }), {}), []);
  const [rawColumns, setRawColumns] = useState(initialColumns);
  const [filters, setFilters] = useState({ q: '', priority: 'ALL', type: 'ALL', sla: 'ALL', assignment: 'ALL', criticalOnly: false });
  const [loading, setLoading] = useState(true);
  const [highlighted, setHighlighted] = useState([]);
  const [density, setDensity] = useState('comfortable');
  const highlightTimeouts = useRef(new Map());

  const sortTickets = useCallback((list) => [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)), []);

  const highlightTicket = useCallback((id) => {
    if (!id) return;
    setHighlighted((prev) => (prev.includes(id) ? prev : [...prev, id]));
    const timers = highlightTimeouts.current;
    if (timers.has(id)) clearTimeout(timers.get(id));
    timers.set(
      id,
      setTimeout(() => {
        setHighlighted((prev) => prev.filter((ticketId) => ticketId !== id));
        timers.delete(id);
      }, 4000)
    );
  }, []);

  const applyTicketToColumns = useCallback(
    (ticket) => {
      if (!ticket) return;
      const statusKey = STATUSES.includes(ticket.status) ? ticket.status : 'NEW';
      setRawColumns((prev) => {
        const next = { ...prev };
        STATUSES.forEach((status) => {
          next[status] = (next[status] || []).filter((item) => item.id !== ticket.id);
        });
        const column = [ticket, ...(next[statusKey] || [])];
        next[statusKey] = sortTickets(column).slice(0, 40);
        return next;
      });
      highlightTicket(ticket.id);
    },
    [highlightTicket, sortTickets]
  );

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = {};
      await Promise.all(
        STATUSES.map(async (status) => {
          const response = await AdminAPI.ticketsList({ status, take: 50 });
          data[status] = sortTickets(response.items || []);
        })
      );
      setRawColumns(data);
      setHighlighted([]);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  }, [sortTickets]);

  const filteredColumns = useMemo(() => {
    const { q, priority, type, sla, assignment, criticalOnly } = filters;
    const query = q.trim().toLowerCase();

    const matches = (ticket) => {
      if (priority !== 'ALL' && ticket.priority !== priority) return false;
      if (type !== 'ALL' && ticket.type !== type) return false;
      if (assignment === 'UNASSIGNED' && ticket.assignedTo?.email) return false;
      if (assignment === 'ASSIGNED' && !ticket.assignedTo?.email) return false;
      if (criticalOnly && !['HIGH', 'URGENT'].includes(ticket.priority)) return false;

      if (sla !== 'ALL') {
        const state = getSlaState(ticket);
        if (sla === 'BREACHED' && state !== 'BREACHED') return false;
        if (sla === 'RISK' && state !== 'RISK') return false;
        if (sla === 'ON_TRACK' && state !== 'ON_TRACK') return false;
      }

      if (query) {
        const haystack = [ticket.code, ticket.title, ticket.customer?.email, ticket.customer?.name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    };

    const result = {};
    STATUSES.forEach((status) => {
      result[status] = (rawColumns[status] || []).filter(matches);
    });
    return result;
  }, [filters, rawColumns]);

  const boardMetrics = useMemo(() => {
    const totalsByStatus = STATUSES.map((status) => ({ status, count: rawColumns[status]?.length || 0 }));
    const allTickets = STATUSES.flatMap((status) => rawColumns[status] || []);

    const aggregate = allTickets.reduce(
      (acc, ticket) => {
        const state = getSlaState(ticket);
        if (state === 'BREACHED') acc.slaBreached += 1;
        else if (state === 'RISK') acc.slaRisk += 1;
        else if (state === 'ON_TRACK') acc.slaOnTrack += 1;

        if (!ticket.assignedTo) acc.unassigned += 1;
        if (['HIGH', 'URGENT'].includes(ticket.priority)) acc.critical += 1;

        const created = new Date(ticket.createdAt);
        if (!Number.isNaN(created.getTime())) {
          const ageHours = (Date.now() - created.getTime()) / 36e5;
          acc.totalAge += ageHours;
          if (ageHours > acc.oldestAge) acc.oldestAge = ageHours;
        }
        return acc;
      },
      { slaBreached: 0, slaRisk: 0, slaOnTrack: 0, unassigned: 0, critical: 0, totalAge: 0, oldestAge: 0 }
    );

    const ticketCount = allTickets.length;
    return {
      totalsByStatus,
      total: ticketCount,
      sla: { breached: aggregate.slaBreached, risk: aggregate.slaRisk, onTrack: aggregate.slaOnTrack },
      unassigned: aggregate.unassigned,
      critical: aggregate.critical,
      averageAgeHours: ticketCount ? aggregate.totalAge / ticketCount : 0,
      oldestAgeHours: aggregate.oldestAge
    };
  }, [rawColumns]);

  const handleTicketUpsert = useCallback(
    async (payload = {}) => {
      const ticketId = payload?.ticketId || payload?.id;
      if (!ticketId) return;

      try {
        const ticket = await AdminAPI.ticket(ticketId);
        applyTicketToColumns(ticket);
      } catch (error) {
        console.error('Failed to refresh ticket', error);
        load();
      }
    },
    [applyTicketToColumns, load]
  );

  const handleTicketDeleted = useCallback((payload = {}) => {
    const ticketId = payload?.ticketId || payload?.id;
    if (!ticketId) return;
    setRawColumns((prev) => {
      const next = { ...prev };
      STATUSES.forEach((status) => {
        next[status] = (next[status] || []).filter((ticket) => ticket.id !== ticketId);
      });
      return next;
    });
    setHighlighted((prev) => prev.filter((id) => id !== ticketId));
  }, []);

  useRealTimeTickets({
    onTicketCreated: handleTicketUpsert,
    onTicketUpdated: handleTicketUpsert,
    onTicketDeleted: handleTicketDeleted
  });

  useEffect(() => {
    load();
    return () => {
      highlightTimeouts.current.forEach((timeoutId) => clearTimeout(timeoutId));
      highlightTimeouts.current.clear();
    };
  }, [load]);

  const toggleDensity = useCallback(() => {
    setDensity((prev) => (prev === 'comfortable' ? 'compact' : 'comfortable'));
  }, []);

  async function setStatus(id, status) {
    try {
      await AdminAPI.updateTicket(id, { status });
      const existing = STATUSES.flatMap((s) => rawColumns[s]).find((ticket) => ticket.id === id);
      if (existing) {
        applyTicketToColumns({ ...existing, status });
      }
    } catch (error) {
      console.error(`Error updating ticket ${id} to ${status}:`, error);
      load();
    }
  }

  const clearFilters = () =>
    setFilters({ q: '', priority: 'ALL', type: 'ALL', sla: 'ALL', assignment: 'ALL', criticalOnly: false });

  const averageAgeLabel = describeAverageAge(boardMetrics.averageAgeHours);
  const slaHelper = boardMetrics.sla.risk ? `${boardMetrics.sla.risk} at risk | ${averageAgeLabel}` : averageAgeLabel;

  const metricCards = [
    {
      id: 'active',
      label: 'Active tickets',
      value: boardMetrics.total,
      helper: 'Across all statuses',
      gradient: 'from-blue-50 via-white to-white',
      iconWrapper: 'bg-blue-100 text-blue-600',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-7 4h8M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
        </svg>
      )
    },
    {
      id: 'unassigned',
      label: 'Awaiting owner',
      value: boardMetrics.unassigned,
      helper: 'Need assignment',
      gradient: 'from-amber-50 via-white to-white',
      iconWrapper: 'bg-amber-100 text-amber-600',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'critical',
      label: 'Critical priority',
      value: boardMetrics.critical,
      helper: 'High & urgent queue',
      gradient: 'from-rose-50 via-white to-white',
      iconWrapper: 'bg-rose-100 text-rose-600',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 4h.01M10.29 3.86L2.82 17.14A2 2 0 004.53 20h14.94a2 2 0 001.71-2.86L12.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      )
    },
    {
      id: 'sla',
      label: 'SLA attention',
      value: boardMetrics.sla.breached,
      helper: slaHelper,
      gradient: 'from-indigo-50 via-white to-white',
      iconWrapper: 'bg-indigo-100 text-indigo-600',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const chipPalette = {
    danger: {
      base: 'border-rose-200 text-rose-600 hover:border-rose-300 hover:bg-rose-50',
      active: 'border-rose-500 bg-rose-500 text-white shadow-sm'
    },
    warning: {
      base: 'border-amber-200 text-amber-600 hover:border-amber-300 hover:bg-amber-50',
      active: 'border-amber-500 bg-amber-500 text-white shadow-sm'
    },
    info: {
      base: 'border-blue-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50',
      active: 'border-blue-500 bg-blue-600 text-white shadow-sm'
    },
    neutral: {
      base: 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50',
      active: 'border-gray-600 bg-gray-800 text-white shadow-sm'
    }
  };

  const filterChips = [
    {
      id: 'sla-breached',
      label: `SLA breached (${boardMetrics.sla.breached})`,
      active: filters.sla === 'BREACHED',
      intent: 'danger',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l2 2M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () =>
        setFilters((prev) => ({
          ...prev,
          sla: prev.sla === 'BREACHED' ? 'ALL' : 'BREACHED'
        }))
    },
    {
      id: 'sla-risk',
      label: `SLA at risk (${boardMetrics.sla.risk})`,
      active: filters.sla === 'RISK',
      intent: 'warning',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 4h.01M10.29 3.86L2.82 17.14A2 2 0 004.53 20h14.94a2 2 0 001.71-2.86L12.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      ),
      onClick: () =>
        setFilters((prev) => ({
          ...prev,
          sla: prev.sla === 'RISK' ? 'ALL' : 'RISK'
        }))
    },
    {
      id: 'critical-only',
      label: `Critical priority (${boardMetrics.critical})`,
      active: filters.criticalOnly,
      intent: 'info',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 4h5l14 7-14 7H5a1 1 0 01-1-1V5a1 1 0 011-1zm8.5 7a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        </svg>
      ),
      onClick: () =>
        setFilters((prev) => {
          const nextCritical = !prev.criticalOnly;
          return {
            ...prev,
            criticalOnly: nextCritical,
            priority: nextCritical ? 'ALL' : prev.priority
          };
        })
    },
    {
      id: 'unassigned',
      label: `Unassigned (${boardMetrics.unassigned})`,
      active: filters.assignment === 'UNASSIGNED',
      intent: 'neutral',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h6" />
        </svg>
      ),
      onClick: () =>
        setFilters((prev) => ({
          ...prev,
          assignment: prev.assignment === 'UNASSIGNED' ? 'ALL' : 'UNASSIGNED'
        }))
    }
  ];

  return (
    <div className="space-y-6 pb-6">
      <PageHeader
        title="Ticket board"
        description="Monitor workload and progress across every stage of support"
        actions={[
          <Button
            key="density"
            variant="secondary"
            onClick={toggleDensity}
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {density === 'compact' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h10M4 17h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            }
          >
            {density === 'compact' ? 'Comfortable view' : 'Compact view'}
          </Button>,
          <Button
            key="refresh"
            variant="secondary"
            onClick={load}
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v6h6M20 20v-6h-6M5 15a7 7 0 0110.32-6.32M19 9a7 7 0 01-10.32 6.32" />
              </svg>
            }
          >
            Refresh
          </Button>
        ]}
      />

      <Card className="border-gray-200 shadow-sm" padding={false}>
        <div className="grid gap-4 border-b border-gray-100 px-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => (
            <div
              key={card.id}
              className={`flex items-center justify-between rounded-2xl border border-gray-100 bg-gradient-to-br px-4 py-3 shadow-sm ${card.gradient}`}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{card.label}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500">{card.helper}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-full ${card.iconWrapper}`}>
                {card.icon}
              </span>
            </div>
          ))}
        </div>
        <div className="grid gap-4 border-b border-gray-100 px-4 py-4 sm:grid-cols-2 xl:grid-cols-5">
          <FormInput
            className="sm:col-span-2 xl:col-span-2"
            label="Search"
            placeholder="Ticket code, title or customer"
            value={filters.q}
            onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
          />
          <FormSelect
            label="Priority"
            value={filters.priority}
            onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value || 'ALL' }))}
            options={[{ value: 'ALL', label: 'All priorities' }, ...PRIORITIES.map((item) => ({ value: item, label: item }))]}
            placeholder="Select priority"
          />
          <FormSelect
            label="Type"
            value={filters.type}
            onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value || 'ALL' }))}
            options={[{ value: 'ALL', label: 'All ticket types' }, ...TYPES.map((item) => ({ value: item, label: item }))]}
            placeholder="Select ticket type"
          />
          <FormSelect
            label="Assignment"
            value={filters.assignment}
            onChange={(event) => setFilters((prev) => ({ ...prev, assignment: event.target.value || 'ALL' }))}
            options={[
              { value: 'ALL', label: 'All assignments' },
              { value: 'ASSIGNED', label: 'Assigned only' },
              { value: 'UNASSIGNED', label: 'Unassigned only' }
            ]}
            placeholder="Select assignment"
          />
          <FormSelect
            label="SLA status"
            value={filters.sla}
            onChange={(event) => setFilters((prev) => ({ ...prev, sla: event.target.value || 'ALL' }))}
            options={[
              { value: 'ALL', label: 'All SLA states' },
              { value: 'BREACHED', label: 'Breached' },
              { value: 'RISK', label: 'At risk' },
              { value: 'ON_TRACK', label: 'On track' }
            ]}
            placeholder="Select SLA state"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {filterChips.map((chip) => {
              const palette = chipPalette[chip.intent] || chipPalette.neutral;
              const classes = chip.active ? palette.active : palette.base;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={chip.onClick}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${classes}`}
                  aria-pressed={chip.active}
                >
                  <span className="text-current">{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
            {filterChips.length === 0 && <span className="text-xs text-gray-500">No quick filters available</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="hidden sm:inline">Filters refine your board view</span>
            <Button variant="link" onClick={clearFilters}>
              Reset filters
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {boardMetrics.totalsByStatus.map((stat) => {
              const meta = STATUS_META[stat.status];
              const badgeClass = STATUS_ACCENT_BADGES[meta.accent] || 'bg-gray-200 text-gray-700';
              return (
                <div
                  key={stat.status}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{meta.title}</p>
                    <p className="text-lg font-semibold text-gray-900">{stat.count}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeClass}`}>{meta.subtitle}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className={`flex ${density === 'compact' ? 'gap-3' : 'gap-4'}`}>
            {STATUSES.map((status) => {
              const column = filteredColumns[status] || [];
              const meta = STATUS_META[status];

              return (
                <KanbanColumn
                  key={status}
                  title={meta.title}
                  subtitle={meta.subtitle}
                  count={column.length}
                  accent={meta.accent}
                  density={density}
                >
                  {column.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/70 p-6 text-center text-xs text-gray-500">
                      No tickets
                    </div>
                  ) : (
                    column.map((ticket) => {
                      const badgeList = [
                        <StatusBadge key="priority" status={ticket.priority} />,
                        <StatusBadge key="type" status={ticket.type} />
                      ];
                      const slaBadge = getSlaBadge(ticket);
                      if (slaBadge) badgeList.push(<span key="sla">{slaBadge}</span>);

                      const updatedDisplay = formatRelative(ticket.updatedAt || ticket.createdAt);
                      const metaList = [
                        {
                          label: 'Customer',
                          value: ticket.customer?.email || 'Unknown',
                          icon: (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11c1.104 0 2-.672 2-1.5S8.104 8 7 8s-2 .672-2 1.5.896 1.5 2 1.5zM5 21v-1.5A2.5 2.5 0 017.5 17h.5m4.5-6h5m-5 4h5m-5 4h5" />
                            </svg>
                          )
                        },
                        {
                          label: 'Updated',
                          value: updatedDisplay,
                          icon: (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )
                        },
                        {
                          label: 'Assigned',
                          value: ticket.assignedTo?.email || 'Unassigned',
                          icon: (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21v-2a4 4 0 00-3-3.87M4 21v-2a4 4 0 013-3.87m9-7.13a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )
                        }
                      ];

                      const quickActions = QUICK_ACTIONS[ticket.status] || [];
                      const quickActionLimit = density === 'compact' ? 2 : 3;

                      const slaState = getSlaState(ticket);
                      const priorityAccent = PRIORITY_ACCENTS[String(ticket.priority || '').toUpperCase()] || '';
                      let accentClass = priorityAccent;
                      if (slaState === 'BREACHED') accentClass = 'border-l-4 border-l-rose-500';
                      else if (slaState === 'RISK') accentClass = 'border-l-4 border-l-amber-500';

                      const descriptionSource =
                        [ticket.summary, ticket.problemSummary, ticket.description, ticket.details, ticket.notes?.[0]?.content]
                          .find((value) => typeof value === 'string' && value.trim().length > 0) || '';
                      const normalizedSummary = descriptionSource.replace(/\s+/g, ' ').trim();
                      const truncatedSummary =
                        normalizedSummary.length > 140 ? `${normalizedSummary.slice(0, 140)}...` : normalizedSummary;
                      const descriptionNode = truncatedSummary ? (
                        <p className={`${density === 'compact' ? 'mt-2 text-[11px]' : 'mt-3 text-xs'} text-gray-600`}>
                          {truncatedSummary}
                        </p>
                      ) : null;

                      return (
                        <KanbanCard
                          key={ticket.id}
                          code={ticket.code}
                          title={ticket.title || 'Untitled ticket'}
                          meta={metaList}
                          badges={badgeList}
                          onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                          className={highlighted.includes(ticket.id) ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
                          accentClass={accentClass}
                          density={density}
                          footer={
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap gap-2">
                                {quickActions.slice(0, quickActionLimit).map((action) => (
                                  <Button
                                    key={action}
                                    variant="secondary"
                                    size="sm"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setStatus(ticket.id, action);
                                    }}
                                  >
                                    {action.replace('_', ' ')}
                                  </Button>
                                ))}
                              </div>
                              <Link
                                href={`/admin/tickets/${ticket.id}`}
                                className={`inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 ${density === 'compact' ? 'text-[11px]' : 'text-xs'}`}
                                onClick={(event) => event.stopPropagation()}
                              >
                                View details
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>
                          }
                        >
                          {descriptionNode}
                        </KanbanCard>
                      );
                    })
                  )}
                </KanbanColumn>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}














