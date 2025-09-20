import { apiFetch } from './api';

export const BlogAPI = {
  async list(params = {}) {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      search.set(key, value);
    });
    const qs = search.toString();
    const res = await apiFetch(`/blog/posts${qs ? `?${qs}` : ''}`, { auth: false });
    if (!res.ok) throw new Error('Failed to load blog posts');
    return res.json();
  },
  async detail(slug) {
    const res = await apiFetch(`/blog/posts/${slug}`, { auth: false });
    if (!res.ok) throw new Error('Failed to load blog post');
    return res.json();
  },
  async submitComment(slug, content) {
    const res = await apiFetch(`/blog/posts/${slug}/comments`, { method: 'POST', body: { content } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit comment');
    return data;
  }
};

