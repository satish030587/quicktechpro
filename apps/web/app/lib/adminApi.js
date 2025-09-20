import { apiFetch } from './api';

export const AdminAPI = {
  // Dashboard
  async summary() { const r = await apiFetch('/admin/summary'); if (!r.ok) throw new Error('Failed to load summary'); return r.json(); },

  // Users
  async listUsers() { const r = await apiFetch('/admin/users'); if (!r.ok) throw new Error('Failed to list users'); return r.json(); },
  async promote(email, role) { const r = await apiFetch('/admin/users/promote', { method: 'POST', body: { email, role } }); const j = await r.json(); if (!r.ok) throw new Error(j.message || 'Promote failed'); return j; },

  // Tickets
  async ticketsList(filters) { const params = new URLSearchParams(); Object.entries(filters || {}).forEach(([k, v]) => { if (v) params.set(k, v); }); const r = await apiFetch(`/admin/tickets?${params.toString()}`); if (!r.ok) throw new Error('Failed to load tickets'); return r.json(); },
  async ticket(id) { const r = await apiFetch(`/admin/tickets/${id}`); if (!r.ok) throw new Error('Failed to load ticket'); return r.json(); },
  async ticketMessage(id, senderId, content, internal=false) { const path = internal ? `/admin/tickets/${id}/notes` : `/admin/tickets/${id}/messages`; const r = await apiFetch(path, { method: 'POST', body: { senderId, content, internal } }); const j = await r.json(); if (!r.ok) throw new Error(j.message || 'Failed to post message'); return j; },
  async startRemoteSession(id, payload) { const r = await apiFetch(`/admin/tickets/${id}/remote-session/start`, { method: 'POST', body: payload }); const j = await r.json(); if (!r.ok) throw new Error(j.message || 'Failed to start session'); return j; },
  async endRemoteSession(id, payload) { const r = await apiFetch(`/admin/tickets/${id}/remote-session/end`, { method: 'POST', body: payload }); const j = await r.json(); if (!r.ok) throw new Error(j.message || 'Failed to end session'); return j; },
  async updateTicket(id, payload) { const r = await apiFetch(`/admin/tickets/${id}`, { method: 'PATCH', body: payload }); const j = await r.json(); if (!r.ok) throw new Error(j.message || 'Failed to update ticket'); return j; },
  async deleteTicket(id) { const r = await apiFetch(`/admin/tickets/${id}`, { method: 'DELETE' }); const j = await r.json(); if (!r.ok) throw new Error(j.message || 'Failed to delete ticket'); return j; },

  // Finance
  async invoices(status) { const r = await apiFetch(`/admin/invoices${status ? `?status=${status}` : ''}`); if (!r.ok) throw new Error('Failed to load invoices'); return r.json(); },
  async payments(status) { const r = await apiFetch(`/admin/payments${status ? `?status=${status}` : ''}`); if (!r.ok) throw new Error('Failed to load payments'); return r.json(); },
  async reconcilePayment(id, status) { const r = await apiFetch(`/admin/payments/${id}/reconcile`, { method: 'PATCH', body: { status } }); const j = await r.json(); if (!r.ok) throw new Error(j.message || 'Failed to reconcile'); return j; },

  async contentPosts(filters = {}) {
    const searchParams = new URLSearchParams();
    const { status, search, featured, take, skip, includeDeleted, categoryId, tag, authorId, sort } = filters;
    if (status) {
      const statusValue = Array.isArray(status) ? status.join(',') : status;
      if (statusValue) searchParams.set('status', statusValue);
    }
    if (search) searchParams.set('search', search);
    if (featured !== undefined) searchParams.set('featured', String(featured));
    if (typeof take === 'number') {
      searchParams.set('take', String(take));
    } else if (take) {
      searchParams.set('take', String(take));
    }
    if (typeof skip === 'number') searchParams.set('skip', String(skip));
    if (includeDeleted) searchParams.set('includeDeleted', 'true');
    if (categoryId) searchParams.set('categoryId', String(categoryId));
    if (tag) searchParams.set('tag', String(tag));
    if (authorId) searchParams.set('authorId', String(authorId));
    if (sort) searchParams.set('sort', sort);
    searchParams.set('includeTotal', 'true');
    searchParams.set('withMeta', 'true');
    const qs = searchParams.toString();
    const r = await apiFetch(`/admin/content/posts${qs ? `?${qs}` : ''}`);
    if (!r.ok) throw new Error('Failed to load posts');
    return r.json();
  },
  async contentPost(id) {
    const r = await apiFetch(`/admin/content/posts/${id}`);
    if (!r.ok) throw new Error('Failed to load post');
    return r.json();
  },
  async contentSubscribers(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    const qs = params.toString();
    const r = await apiFetch(`/admin/content/subscribers${qs ? `?${qs}` : ''}`);
    if (!r.ok) throw new Error('Failed to load subscribers');
    return r.json();
  },
  async updateSubscriber(id, payload) {
    const r = await apiFetch(`/admin/content/subscribers/${id}`, { method: 'PATCH', body: payload });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to update subscriber');
    return j;
  },
  async deleteSubscriber(id) {
    const r = await apiFetch(`/admin/content/subscribers/${id}`, { method: 'DELETE' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to delete subscriber');
    return j;
  },
  async testSubscriber(id) {
    const r = await apiFetch(`/admin/content/subscribers/${id}/test`, { method: 'POST' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to queue test email');
    return j;
  },
  async contentAnalyticsOverview(filters = {}) {
    const params = new URLSearchParams();
    if (filters?.days) params.set('days', String(filters.days));
    const qs = params.toString();
    const r = await apiFetch(`/admin/content/analytics/overview${qs ? `?${qs}` : ''}`);
    if (!r.ok) throw new Error('Failed to load analytics overview');
    return r.json();
  },
  async contentPostMetrics(id, filters = {}) {
    if (!id) throw new Error('Post id is required');
    const params = new URLSearchParams();
    if (filters?.days) params.set('days', String(filters.days));
    const qs = params.toString();
    const r = await apiFetch(`/admin/content/posts/${id}/metrics${qs ? `?${qs}` : ''}`);
    if (!r.ok) throw new Error('Failed to load post metrics');
    return r.json();
  },
  async createContentPost(payload) {
    const r = await apiFetch('/admin/content/posts', { method: 'POST', body: payload });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to create post');
    return j;
  },
  async updateContentPost(id, payload) {
    const r = await apiFetch(`/admin/content/posts/${id}`, { method: 'PATCH', body: payload });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to update post');
    return j;
  },
  async deleteContentPost(id) {
    const r = await apiFetch(`/admin/content/posts/${id}`, { method: 'DELETE' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to delete post');
    return j;
  },
  async regeneratePostSummary(id) {
    const r = await apiFetch(`/admin/content/posts/${id}/summary`, { method: 'POST' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to refresh summary');
    return j;
  },
  async contentPostStatus(id, status, options = {}) {
    const body = { status, ...(options.publishedAt ? { publishedAt: options.publishedAt } : {}) };
    const r = await apiFetch(`/admin/content/posts/${id}/status`, { method: 'PATCH', body });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to update');
    return j;
  },
  async contentCategories() {
    const r = await apiFetch('/admin/content/categories');
    if (!r.ok) throw new Error('Failed to load categories');
    return r.json();
  },
  async createContentCategory(name) {
    const r = await apiFetch('/admin/content/categories', { method: 'POST', body: { name } });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to create category');
    return j;
  },
  async updateContentCategory(id, name) {
    const r = await apiFetch(`/admin/content/categories/${id}`, { method: 'PATCH', body: { name } });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to update category');
    return j;
  },
  async deleteContentCategory(id) {
    const r = await apiFetch(`/admin/content/categories/${id}`, { method: 'DELETE' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to delete category');
    return j;
  },
  async contentComments(status) {
    const qs = status ? `?status=${status}` : '';
    const r = await apiFetch(`/admin/content/comments${qs}`);
    if (!r.ok) throw new Error('Failed to load comments');
    return r.json();
  },
  async updateCommentStatus(id, status) {
    const r = await apiFetch(`/admin/content/comments/${id}/status`, { method: 'PATCH', body: { status } });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to update comment');
    return j;
  },
  async deleteComment(id) {
    const r = await apiFetch(`/admin/content/comments/${id}`, { method: 'DELETE' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to delete comment');
    return j;
  },

  async replyToComment(id, payload) {
    const r = await apiFetch(`/admin/content/comments/${id}/replies`, { method: 'POST', body: payload });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to reply to comment');
    return j;
  },

  async testimonials(approved) {
    const qs = approved == null ? '' : `?approved=${approved}`;
    const r = await apiFetch(`/admin/content/testimonials${qs}`);
    if (!r.ok) throw new Error('Failed to load testimonials');
    return r.json();
  },
  async testimonialApprove(id, approved) {
    const r = await apiFetch(`/admin/content/testimonials/${id}/approve`, { method: 'PATCH', body: { approved } });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to approve testimonial');
    return j;
  },
  async testimonialReject(id, reason) {
    const payload = reason ? { reason } : {};
    const r = await apiFetch(`/admin/content/testimonials/${id}/reject`, { method: 'PATCH', body: payload });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || 'Failed to reject testimonial');
    return j;
  },
  // Appointments
  async appointments(params) { const p = new URLSearchParams(); Object.entries(params || {}).forEach(([k, v]) => { if (v) p.set(k, v); }); const r = await apiFetch(`/admin/appointments?${p.toString()}`); if (!r.ok) throw new Error('Failed to load appointments'); return r.json(); },
  async createAppointment(payload) { const r = await apiFetch('/admin/appointments', { method: 'POST', body: payload }); const j = await r.json(); if (!r.ok) throw new Error(j.message || 'Failed'); return j; },
  async updateAppointment(id, payload) { const r = await apiFetch(`/admin/appointments/${id}`, { method: 'PATCH', body: payload }); const j = await r.json(); if (!r.ok) throw new Error(j.message || 'Failed'); return j; },

  // Reports
  async reportSummary(from, to) { const p = new URLSearchParams(); if (from) p.set('from', from); if (to) p.set('to', to); const r = await apiFetch(`/admin/reports/summary?${p.toString()}`); if (!r.ok) throw new Error('Failed to load summary'); return r.json(); },

  // Settings
  async settingsGet() { const r = await apiFetch('/admin/settings'); if (!r.ok) throw new Error('Failed to load settings'); return r.json(); },
  async settingsSave(payload) { const r = await apiFetch('/admin/settings', { method: 'POST', body: payload }); const j = await r.json(); if (!r.ok) throw new Error(j.message || 'Failed to save'); return j; },

  // Services Catalog (Admin)
  async catalog() { const r = await apiFetch('/admin/services/catalog'); if (!r.ok) throw new Error('Failed to load catalog'); return r.json(); },
  async upsertCategory(body) { const r = await apiFetch('/admin/services/category', { method:'POST', body }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async upsertService(body) { const r = await apiFetch('/admin/services/service', { method:'POST', body }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async upsertPrice(body) { const r = await apiFetch('/admin/services/price', { method:'POST', body }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },

  // KB
  async kbCategories(){ const r = await apiFetch('/admin/kb/categories'); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async kbUpsertCategory(body){ const r = await apiFetch('/admin/kb/category', { method:'POST', body }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async kbArticles(filter){ const p = new URLSearchParams(); Object.entries(filter||{}).forEach(([k,v])=>{ if(v) p.set(k,v); }); const r = await apiFetch(`/admin/kb/articles?${p.toString()}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async kbUpsertArticle(body){ const r = await apiFetch('/admin/kb/article', { method:'POST', body }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async kbSetArticleStatus(id, status){ const r = await apiFetch(`/admin/kb/articles/${id}/status`, { method:'PATCH', body:{ status } }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },

  // Notifications
  async notificationsList(filter){ const p = new URLSearchParams(); Object.entries(filter||{}).forEach(([k,v])=>{ if(v!=='' && v!=null) p.set(k,v); }); const r = await apiFetch(`/admin/notifications?${p.toString()}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async notificationsMarkRead(id){ const r = await apiFetch(`/admin/notifications/${id}/read`, { method:'POST' }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async notificationsBroadcast(body){ const r = await apiFetch('/admin/notifications/broadcast', { method:'POST', body }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },

  // Quotations
  async quotesList(filter){ const p = new URLSearchParams(); Object.entries(filter||{}).forEach(([k,v])=>{ if(v) p.set(k,v); }); const r = await apiFetch(`/admin/quotations?${p.toString()}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async quoteGet(id){ const r = await apiFetch(`/admin/quotations/${id}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async quoteUpsert(body){ const r = await apiFetch('/admin/quotations', { method:'POST', body }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async quoteSetStatus(id, status){ const r = await apiFetch(`/admin/quotations/${id}/status`, { method:'PATCH', body: { status } }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async quoteRecalculate(id){ const r = await apiFetch(`/admin/quotations/${id}/recalculate`, { method:'POST' }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async quoteConvertToInvoice(id){ const r = await apiFetch(`/admin/quotations/${id}/convert-to-invoice`, { method:'POST' }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; }
};

// Customers helpers
export const AdminCustomersAPI = {
  async list(q){ const r = await apiFetch(`/admin/customers${q?`?q=${encodeURIComponent(q)}`:''}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async detail(id){ const r = await apiFetch(`/admin/customers/${id}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async create(body){ const r = await apiFetch('/admin/customers', { method:'POST', body }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async update(id, body){ const r = await apiFetch(`/admin/customers/${id}`, { method:'PATCH', body }); const j = await r.json(); if (!r.ok) throw new Error(j.message||'Failed'); return j; },
  async tickets(id, page=1, pageSize=10){ const skip=(page-1)*pageSize; const r = await apiFetch(`/admin/customers/${id}/tickets?skip=${skip}&take=${pageSize}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async invoices(id, page=1, pageSize=10){ const skip=(page-1)*pageSize; const r = await apiFetch(`/admin/customers/${id}/invoices?skip=${skip}&take=${pageSize}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async quotes(id, page=1, pageSize=10){ const skip=(page-1)*pageSize; const r = await apiFetch(`/admin/customers/${id}/quotes?skip=${skip}&take=${pageSize}`); if (!r.ok) throw new Error('Failed'); return r.json(); },
  async payments(id, page=1, pageSize=10){ const skip=(page-1)*pageSize; const r = await apiFetch(`/admin/customers/${id}/payments?skip=${skip}&take=${pageSize}`); if (!r.ok) throw new Error('Failed'); return r.json(); }
};
