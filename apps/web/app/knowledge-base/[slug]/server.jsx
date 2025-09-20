import { API_URL } from '../../lib/catalog';

async function fetchKB(slug){
  const res = await fetch(`${API_URL}/kb/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function KBDetailServer({ slug }){
  const a = await fetchKB(slug);
  if (!a) return <section className="section"><div className="card"><p className="muted">Article not found</p></div></section>;
  return (
    <section className="section">
      <h1>{a.title}</h1>
      <div className="muted">Updated: {new Date(a.updatedAt).toLocaleString()}</div>
      <div className="card"><pre style={{whiteSpace:'pre-wrap'}}>{a.content}</pre></div>
    </section>
  );
}

