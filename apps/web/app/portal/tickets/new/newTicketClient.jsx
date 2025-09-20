"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { CustomerAPI } from '../../../lib/customerApi';
import { getSocket } from '../../../lib/socket';

export default function NewTicketClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get('redirect');

  const [form, setForm] = useState({ type: 'ONSITE', priority: 'MEDIUM', title: '', description: '' });
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error('Give the ticket a brief title');
      return;
    }

    try {
      setLoading(true);
      const ticket = await CustomerAPI.createTicket(form);

      const socket = getSocket();
      socket?.emit?.('ticket:created:client', ticket);

      toast.success('Ticket created successfully');

      if (redirectTarget) {
        const url = new URL(redirectTarget, window.location.origin);
        url.searchParams.set('ticketId', ticket.id);
        router.push(`${url.pathname}${url.search}`);
      } else {
        router.push(`/portal/tickets/${ticket.id}`);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(error?.message || 'Unable to create ticket');
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Link href="/portal/tickets" className="text-gray-500 transition-colors hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Support Ticket</h1>
      </div>

      {redirectTarget ? (
        <div className="mb-4 rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          We will send you back to the appointment scheduler once the ticket is created.
        </div>
      ) : null}

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="ticket-type" className="block text-sm font-medium text-gray-700">
                Support Type
              </label>
              <select
                id="ticket-type"
                value={form.type}
                onChange={(event) => updateField('type', event.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="ONSITE">On-site support</option>
                <option value="WEBDEV">Web development</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                For remote support, use the dedicated <Link href="/portal/remote-support" className="text-blue-600 hover:text-blue-800">Remote Support</Link> flow.
              </p>
            </div>

            <div>
              <label htmlFor="ticket-priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="ticket-priority"
                value={form.priority}
                onChange={(event) => updateField('priority', event.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="ticket-title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="ticket-title"
                type="text"
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="Brief summary of your issue"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="ticket-description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="ticket-description"
                rows={6}
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Help the technician with any context, error messages, environment details, or steps already taken."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Link
              href="/portal/tickets"
              className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating…
                </>
              ) : (
                'Create ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
