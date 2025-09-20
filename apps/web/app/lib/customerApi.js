import { apiFetch } from './api';

export const CustomerAPI = {
  async dashboard() {
    const r = await apiFetch('/customer/dashboard');
    if (!r.ok) throw new Error('Failed');
    return r.json();
  },
  async tickets(status) {
    const r = await apiFetch(`/customer/tickets${status?`?status=${status}`:''}`);
    if (!r.ok) throw new Error('Failed');
    return r.json();
  },
  async createTicket(body) {
    const r = await apiFetch('/customer/tickets', { method: 'POST', body });
    const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j;
  },
  async ticket(id) {
    const r = await apiFetch(`/customer/tickets/${id}`);
    if (!r.ok) throw new Error('Failed'); return r.json();
  },
  async ticketMessage(id, content) {
    const r = await apiFetch(`/customer/tickets/${id}/messages`, { method: 'POST', body: { content } });
    const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j;
  },
  async quotes(page=1, pageSize=10) { const skip=(page-1)*pageSize; const r = await apiFetch(`/customer/quotes?skip=${skip}&take=${pageSize}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async quote(id) { const r = await apiFetch(`/customer/quotes/${id}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  acceptQuote(id) { return apiFetch(`/customer/quotes/${id}/accept`, { method: 'POST' }); },
  rejectQuote(id) { return apiFetch(`/customer/quotes/${id}/reject`, { method: 'POST' }); },
  async invoices() { const r = await apiFetch('/customer/invoices'); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async invoice(id) { const r = await apiFetch(`/customer/invoices/${id}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async payments() { const r = await apiFetch('/customer/payments'); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async appointments() { const r = await apiFetch('/customer/appointments'); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async requestAppointment(body) { const r = await apiFetch('/customer/appointments', { method:'POST', body }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async profile() { const r = await apiFetch('/customer/profile'); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async saveProfile(body) { const r = await apiFetch('/customer/profile', { method:'PATCH', body }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async notifications(page=1, pageSize=10, read='') { const skip=(page-1)*pageSize; const qs = `skip=${skip}&take=${pageSize}${read!==''?`&read=${read}`:''}`; const r = await apiFetch(`/customer/notifications?${qs}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async notificationRead(id) { const r = await apiFetch(`/customer/notifications/${id}/read`, { method:'POST' }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async notificationsMarkAllRead() { const r = await apiFetch('/customer/notifications/mark-all-read', { method:'POST' }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async paymentsConfig() { const r = await apiFetch('/payments/config', { auth: false }); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async createRazorpayOrder(invoiceId) { const r = await apiFetch('/payments/razorpay/order', { method:'POST', body: { invoiceId } }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async verifyRazorpayPayment(data) { const r = await apiFetch('/payments/razorpay/verify', { method:'POST', body: data }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async createRazorpayOrderRemote(plan, title, details){
    const r = await apiFetch('/payments/remote/order', { method:'POST', body: { plan, title, details } });
    const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j;
  }
  ,
  async updateTicket(id, body){ const r = await apiFetch(`/customer/tickets/${id}`, { method:'PATCH', body }); const j=await r.json(); if(!r.ok) throw new Error(j.message||'Failed'); return j; },
  async cancelTicket(id){ const r = await apiFetch(`/customer/tickets/${id}/cancel`, { method:'POST' }); const j=await r.json(); if(!r.ok) throw new Error(j.message||'Failed'); return j; }
};

// Convenience wrapper for remote support
// (Kept for backward compatibility if imported elsewhere)
export async function createRazorpayOrderRemote(plan, title, details){
  return CustomerAPI.createRazorpayOrderRemote(plan, title, details);
}
