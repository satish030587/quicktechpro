"use client";
import { useEffect, useState } from 'react';
import { CustomerAPI } from '../../../lib/customerApi';
import Link from 'next/link';

export default function InvoiceView({ id }) {
  const [inv, setInv] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      try {
        const r = await CustomerAPI.invoice(id);
        setInv(r);
      } catch {
        // fallback: search from list
        const list = await CustomerAPI.invoices();
        setInv((list.items || []).find(i => String(i.id) === String(id)) || null);
      }
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [id]);

  function printInvoice() { window.print(); }

  if (loading || !inv) {
    return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 rounded-full border-b-2 border-blue-600"></div></div>;
  }

  const currency = '\u20B9';

  return (
    <div>
      <style>{`@media print { header, footer, nav, .no-print { display: none !important } main { padding: 0 !important } }`}</style>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/portal/invoices" className="text-gray-500 hover:text-gray-700">← Back</Link>
          <h1 className="text-2xl font-bold text-gray-900">Invoice {inv.number}</h1>
        </div>
        <div className="no-print flex gap-2">
          <button onClick={printInvoice} className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700">Download / Print</button>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <div className="text-sm text-gray-500">Billed To</div>
            <div className="text-gray-900 font-medium">{inv.customer?.name || inv.customer?.email || 'Customer'}</div>
          </div>
          <div className="text-sm text-gray-600">
            <div><span className="text-gray-500">Date:</span> {new Date(inv.createdAt || inv.date).toLocaleDateString()}</div>
            <div><span className="text-gray-500">Status:</span> <span className="font-medium">{inv.status}</span></div>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Item</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(inv.items || []).map((it, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-2 pr-4">{it.title || it.description || 'Service'}</td>
                  <td className="py-2 text-right">{it.qty || 1}</td>
                  <td className="py-2 text-right">{currency}{(it.price || 0).toLocaleString()}</td>
                  <td className="py-2 text-right">{currency}{((it.qty||1)*(it.price||0)).toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="py-2 text-right font-medium">Total</td>
                <td className="py-2 text-right font-bold">{currency}{(inv.total || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

