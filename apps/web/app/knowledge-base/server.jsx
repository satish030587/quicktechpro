import { API_URL } from '../lib/catalog';

async function fetchKB({ q = '', categoryId = '', page = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (categoryId) params.set('categoryId', categoryId);
  const skip = (page - 1) * pageSize;
  params.set('skip', String(skip));
  params.set('take', String(pageSize));
  const res = await fetch(`${API_URL}/kb?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) return { items: [], total: 0, categories: [] };
  return res.json();
}

export default async function KBListServer() {
  const data = await fetchKB();
  const cats = data.categories || [];
  return (
    <section className="section">
      <h1>Knowledge Base</h1>
      <div className="grid">
        {(data.items||[]).map(a => (
          <article key={a.id} className="card">
            <h3><a href={`/knowledge-base/${a.slug}`}>{a.title}</a></h3>
            <div className="muted">Updated: {new Date(a.updatedAt).toLocaleDateString()}</div>
            <p className="muted">{(a.content||'').slice(0,160)}...</p>
          </article>
        ))}
      </div>
      {data.total===0 && <p className="muted">No articles published yet.</p>}
    </section>
  );
}

