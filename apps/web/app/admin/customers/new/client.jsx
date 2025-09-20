"use client";
import { useState } from 'react';
import { AdminCustomersAPI as AdminAPI } from '../../../lib/adminApi';
import Link from 'next/link';

export default function NewCustomerClient(){
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);

  async function submit(e){
    e.preventDefault();
    try {
      setSaving(true);
      const res = await AdminAPI.create({ user: form });
      window.location.href = `/admin/customers/${res.id || res.user?.id || ''}`;
    } catch (e) {
      console.error(e); alert('Failed to create customer');
    } finally { setSaving(false); }
  }

  return (
    <div className="pb-6">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/admin/customers" className="text-gray-500 hover:text-gray-700">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Customer</h1>
      </div>
      <form onSubmit={submit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-xl">
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Name</label>
          <input value={form.name} onChange={e=>setForm(s=>({...s,name:e.target.value}))} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input type="email" value={form.email} onChange={e=>setForm(s=>({...s,email:e.target.value}))} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
        </div>
        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-1">Phone</label>
          <input value={form.phone} onChange={e=>setForm(s=>({...s,phone:e.target.value}))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <button type="submit" disabled={saving} className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60">{saving?'Saving...':'Create Customer'}</button>
      </form>
    </div>
  );
}

