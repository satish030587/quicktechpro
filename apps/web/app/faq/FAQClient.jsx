"use client";
import { useMemo, useState } from "react";

export default function FAQClient({ faqs }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => faqs.filter(f => (f.q + " " + f.a).toLowerCase().includes(q.toLowerCase())), [faqs, q]);
  return (
    <>
      <div className="card" style={{marginBottom:'.75rem'}}>
        <input placeholder="Search FAQs" value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>
      {filtered.map((f, i) => (
        <div key={i} className="card" style={{marginBottom:'.5rem'}}>
          <strong>{f.q}</strong>
          <p className="muted">{f.a}</p>
        </div>
      ))}
    </>
  );
}

