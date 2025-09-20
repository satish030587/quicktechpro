"use client";
import { useMemo, useState } from "react";

export default function KBClient({ items }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => items.filter(i => (i.title + " " + i.desc).toLowerCase().includes(q.toLowerCase())), [items, q]);
  return (
    <>
      <div className="card" style={{marginBottom:'.75rem'}}>
        <input placeholder="Search guides" value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>
      <div className="grid">
        {filtered.map(i => (
          <div key={i.title} className="card">
            <strong>{i.title}</strong>
            <p className="muted">{i.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

