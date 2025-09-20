"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../lib/api';

export default function BlogNewsletterSignup({ variant = 'card', className = '' }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim()) {
      toast.error('Please provide an email address');
      return;
    }
    setLoading(true);
    try {
      const response = await apiFetch('/blog/newsletter', {
        method: 'POST',
        auth: false,
        body: {
          email: email.trim(),
          name: name.trim() || undefined
        }
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Subscription failed');
      }
      setSuccess(true);
      setEmail('');
      setName('');
      toast.success('Thanks for subscribing!');
    } catch (err) {
      console.error('Newsletter subscribe failed', err);
      toast.error(err?.message || 'Unable to subscribe right now');
    } finally {
      setLoading(false);
    }
  }

  const baseClass = variant === 'inline'
    ? 'flex flex-col gap-2 sm:flex-row sm:items-end'
    : 'space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm';

  return (
    <div className={`${baseClass} ${className}`.trim()}>
      {variant !== 'inline' ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Stay in the loop</h3>
          <p className="mt-1 text-sm text-gray-600">Get practical repair tips and service updates in your inbox.</p>
          {success ? (
            <p className="mt-2 text-sm text-green-600">You are all set. Watch out for our next update!</p>
          ) : null}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className={variant === 'inline' ? 'flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 w-full' : 'space-y-3 md:flex md:items-end md:gap-3 md:space-y-0'}>
        <label className="flex-1 text-sm text-gray-700">
          <span className="block font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex-1 text-sm text-gray-700">
          <span className="block font-medium">Name (optional)</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            placeholder="Your name"
          />
        </label>
        <ButtonSubmit loading={loading} className="w-full sm:w-auto self-stretch sm:self-end md:self-end" />
      </form>
    </div>
  );
}

function ButtonSubmit({ loading, className = "" }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={[
        'inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60',
        loading ? 'cursor-wait' : '',
        className
      ].filter(Boolean).join(' ')}
    >
      {loading ? 'Subscribing...' : 'Subscribe'}
    </button>
  );
}
