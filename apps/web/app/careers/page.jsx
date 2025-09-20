export const metadata = { title: "Careers" };

export default function CareersPage() {
  const jobs = [
    { title: "IT Support Technician (Bangalore)", type: "Full-time", id: "it-tech" },
    { title: "Front-end Developer (React)", type: "Contract", id: "frontend-dev" }
  ];
  return (
    <section className="section">
      <h1>Careers at QuickTechPro</h1>
      <p className="muted">Join a customer-first team helping Bangalore stay productive.</p>

      <h2>Open Positions</h2>
      <div className="grid">
        {jobs.map(j => (
          <div key={j.id} className="card"><strong>{j.title}</strong><div className="muted">{j.type}</div></div>
        ))}
      </div>

      <h2>Apply</h2>
      <div className="card">
        <p>Send your resume and a short note. We’ll review and get back within a week.</p>
        <form action="/thank-you/contact" method="get">
          <div className="field">
            <label htmlFor="role">Position</label>
            <select id="role" name="role" defaultValue="it-tech">
              {jobs.map(j => (<option key={j.id} value={j.id}>{j.title}</option>))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" required />
          </div>
          <div className="field">
            <label htmlFor="note">Note</label>
            <textarea id="note" name="note" placeholder="Tell us why you’re a great fit" rows={5} />
          </div>
          <button type="submit">Submit Application</button>
        </form>
      </div>
    </section>
  );
}

