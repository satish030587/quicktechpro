export const metadata = { title: "Service Areas" };

export default function ServiceAreasPage() {
  const areas = [
    "Koramangala", "Indiranagar", "Whitefield", "HSR Layout", "Marathahalli",
    "JP Nagar", "Jayanagar", "Hebbal", "Malleshwaram", "BTM Layout"
  ];
  return (
    <section className="section">
      <h1>Bangalore Service Areas</h1>
      <p className="muted">Same‑day onsite support available in the following neighborhoods.</p>
      <div className="grid">
        {areas.map(a => (<div key={a} className="card">{a}</div>))}
      </div>
      <p className="muted">Remote support available nationwide.</p>
    </section>
  );
}

