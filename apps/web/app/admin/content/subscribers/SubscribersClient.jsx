"use client";

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AdminAPI } from '../../../lib/adminApi';
import {
  Card,
  Button,
  LoadingSpinner,
  EmptyState,
  PageHeader,
  Select
} from '../../components/ui';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All subscribers' },
  { value: 'active', label: 'Active' },
  { value: 'unsubscribed', label: 'Unsubscribed' }
];

function formatDate(value) {
  if (!value) return '--';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

export default function SubscribersClient() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [testId, setTestId] = useState(null);

  useEffect(() => {
    void loadSubscribers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function loadSubscribers(params = {}) {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminAPI.contentSubscribers({ status: status === 'all' ? undefined : status, search: (params.search ?? search.trim()) || undefined });
      setSubscribers(Array.isArray(response?.items) ? response.items : []);
    } catch (err) {
      console.error('Failed to load subscribers', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredSubscribers = useMemo(() => {
    if (!search.trim()) return subscribers;
    const needle = search.trim().toLowerCase();
    return subscribers.filter((subscriber) => {
      return (
        subscriber.email?.toLowerCase().includes(needle) ||
        subscriber.name?.toLowerCase().includes(needle)
      );
    });
  }, [subscribers, search]);

  async function handleSearch(event) {
    event.preventDefault();
    await loadSubscribers({ search: search.trim() });
  }

  async function handleToggle(subscriber) {
    setPendingId(subscriber.id);
    try {
      await AdminAPI.updateSubscriber(subscriber.id, { unsubscribed: !subscriber.unsubscribed });
      toast.success(!subscriber.unsubscribed ? 'Subscriber marked as unsubscribed' : 'Subscriber reactivated');
      await loadSubscribers();
    } catch (err) {
      console.error('Failed to update subscriber', err);
      toast.error('Unable to update subscriber status');
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(subscriber) {
    if (!window.confirm(`Remove ${subscriber.email} from the mailing list?`)) {
      return;
    }
    setPendingId(subscriber.id);
    try {
      await AdminAPI.deleteSubscriber(subscriber.id);
      toast.success('Subscriber removed');
      await loadSubscribers();
    } catch (err) {
      console.error('Failed to delete subscriber', err);
      toast.error('Unable to delete subscriber');
    } finally {
      setPendingId(null);
    }
  }

  async function handleTest(subscriber) {
    setTestId(subscriber.id);
    try {
      await AdminAPI.testSubscriber(subscriber.id);
      toast.success('Queued test email');
    } catch (err) {
      console.error('Failed to queue test email', err);
      toast.error('Unable to send test email');
    } finally {
      setTestId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Newsletter subscribers"
        description="Manage blog subscribers and trigger test communications."
      />

      <Card>
        <form className="flex flex-wrap items-end gap-3" onSubmit={handleSearch}>
          <Select
            label="Status"
            className="w-48"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={STATUS_OPTIONS}
            placeholder={null}
          />
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700" htmlFor="subscriber-search">
              Search
            </label>
            <input
              id="subscriber-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="mt-1 w-64 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="Filter by email or name"
            />
          </div>
          <Button type="submit" variant="primary" size="sm">
            Apply
          </Button>
        </form>
      </Card>

      {loading ? (
        <Card>
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div className="space-y-3 p-6">
            <p className="text-sm text-red-600">Unable to load subscribers.</p>
            <Button size="sm" variant="primary" onClick={() => loadSubscribers()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : filteredSubscribers.length === 0 ? (
        <Card>
          <EmptyState
            title="No subscribers found"
            description="New signups will appear here once readers opt-in."
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Email</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Last notified</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Joined</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredSubscribers.map((subscriber) => {
                  const isProcessing = pendingId === subscriber.id || testId === subscriber.id;
                  return (
                    <tr key={subscriber.id} className="align-top">
                      <td className="px-4 py-2">
                        <div className="font-medium text-gray-900">{subscriber.email}</div>
                      </td>
                      <td className="px-4 py-2 text-gray-700">{subscriber.name || '--'}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                            subscriber.unsubscribed ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {subscriber.unsubscribed ? 'Unsubscribed' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">{formatDate(subscriber.lastNotifiedAt)}</td>
                      <td className="px-4 py-2 text-gray-600">{formatDate(subscriber.createdAt)}</td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={isProcessing}
                            onClick={() => handleTest(subscriber)}
                          >
                            {testId === subscriber.id ? 'Sending...' : 'Send test'}
                          </Button>
                          <Button
                            size="sm"
                            variant={subscriber.unsubscribed ? 'success' : 'warning'}
                            disabled={isProcessing}
                            onClick={() => handleToggle(subscriber)}
                          >
                            {subscriber.unsubscribed ? 'Reactivate' : 'Unsubscribe'}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={isProcessing}
                            onClick={() => handleDelete(subscriber)}
                          >
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
