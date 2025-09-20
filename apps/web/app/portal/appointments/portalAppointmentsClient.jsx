"use client";
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getSocket } from '../../lib/socket';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import { CustomerAPI } from '../../lib/customerApi';
import { useAuth } from '../../providers';
import useUnreadIndicators from '../../hooks/useUnreadIndicators';
import UnreadBadge, { HighlightWrapper, UnreadDot } from '../../components/UnreadBadge';

const CLOSED_STATUSES = ['CLOSED', 'CANCELED', 'CANCELLED', 'RESOLVED'];

export default function PortalAppointmentsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const [openTickets, setOpenTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const [form, setForm] = useState({ ticketId: '', scheduledAt: '', address: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const { unreadCounts, unreadItems, isUnread, isHighlighted, markAsRead } = useUnreadIndicators();

  const preferredTicketId = searchParams?.get('ticketId');

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    loadAppointments();
    loadTickets();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleUpdate = () => {
      loadAppointments();
      loadTickets();
    };
    socket.on('appointment:update', handleUpdate);
    return () => {
      socket.off('appointment:update', handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (preferredTicketId) {
      setForm((prev) => ({ ...prev, ticketId: preferredTicketId }));
      router.replace('/portal/appointments', { scroll: false });
    }
  }, [preferredTicketId, router]);

  async function loadAppointments() {
    try {
      setLoadingAppointments(true);
      const response = await CustomerAPI.appointments();
      setAppointments(response.items || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Unable to load appointments');
    } finally {
      setLoadingAppointments(false);
    }
  }

  async function loadTickets() {
    try {
      setLoadingTickets(true);
      const response = await CustomerAPI.tickets();
      const open = (response.items || []).filter((ticket) => !CLOSED_STATUSES.includes(ticket.status));
      setOpenTickets(open);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Unable to load tickets');
    } finally {
      setLoadingTickets(false);
    }
  }

  async function handleRequestAppointment(event) {
    event.preventDefault();

    if (!form.ticketId.trim() || !form.scheduledAt) {
      toast.error('Select a ticket and preferred time');
      return;
    }

    const selectedTicket = openTickets.find((ticket) => ticket.id === form.ticketId);
    if (!selectedTicket) {
      toast.error('Choose a valid open ticket');
      return;
    }

    const scheduledDate = new Date(form.scheduledAt);
    if (Number.isNaN(scheduledDate.getTime()) || scheduledDate.getTime() <= Date.now()) {
      toast.error('Pick a future appointment time');
      return;
    }

    try {
      setSubmitting(true);
      await CustomerAPI.requestAppointment({
        ticketId: form.ticketId,
        scheduledAt: form.scheduledAt,
        address: form.address?.trim() || undefined,
        notes: form.notes?.trim() || undefined,
      });

      toast.success('Appointment request sent');
      setForm({ ticketId: '', scheduledAt: '', address: '', notes: '' });
      await Promise.all([loadAppointments(), loadTickets()]);
    } catch (error) {
      console.error('Error requesting appointment:', error);
      toast.error(error?.message || 'Unable to request appointment');
    } finally {
      setSubmitting(false);
    }
  }

  const toInputDateTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const formatDateTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const hasOpenTickets = openTickets.length > 0;

  const sortedAppointments = useMemo(
    () => [...appointments].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)),
    [appointments]
  );

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          {unreadCounts?.appointments ? <UnreadBadge count={unreadCounts.appointments} className="ml-2" /> : null}
        </div>
        <p className="mt-1 text-sm text-gray-500">Schedule and track technician visits for your tickets.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-medium text-gray-900">Request an Appointment</h2>
          <Link
            href="/portal/tickets/new?redirect=/portal/appointments"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create new ticket
          </Link>
        </div>

        {!loadingTickets && !hasOpenTickets ? (
          <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-600">
            You have no open tickets eligible for appointments. Create a ticket first to request a visit.
          </div>
        ) : null}

        <form onSubmit={handleRequestAppointment} className="mt-4 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="ticket-id" className="block text-sm font-medium text-gray-700">
                Ticket <span className="text-red-500">*</span>
              </label>
              <select
                id="ticket-id"
                value={form.ticketId}
                onChange={(event) => updateField('ticketId', event.target.value)}
                disabled={loadingTickets}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:bg-gray-100"
                required
              >
                <option value="" disabled>
                  {loadingTickets ? 'Loading tickets…' : 'Select a ticket'}
                </option>
                {openTickets.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    {ticket.code} — {ticket.title || ticket.type}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Only open tickets can have appointments. Need something else? Contact support.
              </p>
            </div>

            <div>
              <label htmlFor="scheduled-at" className="block text-sm font-medium text-gray-700">
                Preferred Date &amp; Time <span className="text-red-500">*</span>
              </label>
              <input
                id="scheduled-at"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(event) => updateField('scheduledAt', event.target.value)}
                min={toInputDateTime(Date.now() + 60 * 60 * 1000)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                required
              />
              <p className="mt-1 text-xs text-gray-500">We will confirm or suggest an alternative time if needed.</p>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address (optional)
              </label>
              <textarea
                id="address"
                rows={3}
                value={form.address}
                onChange={(event) => updateField('address', event.target.value)}
                placeholder="Include on-site service location if different from your profile address"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Additional notes (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                placeholder="Share any context that helps the technician prepare"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm({ ticketId: '', scheduledAt: '', address: '', notes: '' });
              }}
              className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitting || !hasOpenTickets}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="ml-2">Sending…</span>
                </>
              ) : (
                'Request appointment'
              )}
            </button>
          </div>
        </form>
      </div>

      {loadingAppointments ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : sortedAppointments.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments scheduled</h3>
          <p className="mt-1 text-sm text-gray-500">Request an appointment above to book a technician visit.</p>
        </div>
      ) : (
        <section className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Upcoming appointments</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedAppointments.map((appointment) => (
              <HighlightWrapper
                key={appointment.id}
                isHighlighted={isHighlighted('appointments', appointment.id)}
                className="rounded-lg"
              >
                <article
                  className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                  onClick={() => {
                    if (isUnread('appointments', appointment.id)) {
                      markAsRead('appointments', appointment.id);
                    }
                  }}
                >
                  {isUnread('appointments', appointment.id) ? (
                    <div className="absolute right-3 top-3">
                      <UnreadDot />
                    </div>
                  ) : null}

                  <header className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                    <h3 className="font-medium text-gray-900">{formatDateTime(appointment.scheduledAt)}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{appointment.status}</p>
                  </header>

                  <div className="space-y-3 p-4 text-sm text-gray-600">
                    {appointment.ticket?.code || appointment.ticketId ? (
                      <div className="flex items-center gap-1 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <span>
                          Ticket:
                          <Link
                            href={`/portal/tickets/${appointment.ticket?.id || appointment.ticketId}`}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            {appointment.ticket?.code || appointment.ticketId}
                          </Link>
                        </span>
                      </div>
                    ) : null}

                    {appointment.address ? (
                      <div className="flex items-start gap-1">
                        <svg className="mt-0.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{appointment.address}</span>
                      </div>
                    ) : null}

                    {appointment.notes ? <p className="text-gray-500">{appointment.notes}</p> : null}
                  </div>

                  <footer className="flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-3">
                    <Link
                      href={`/portal/tickets/${appointment.ticket?.id || appointment.ticketId}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                      onClick={() => markAsRead('appointments', appointment.id)}
                    >
                      View ticket
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </footer>
                </article>
              </HighlightWrapper>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
