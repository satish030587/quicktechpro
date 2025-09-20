export const metadata = { title: "Partners" };

export default function PartnersPage() {
  return (
    <section className="section">
      <h1>Partners & Collaborations</h1>
      <p className="muted">We work with leading vendors and local businesses.</p>

      <h2>Technology Partners</h2>
      <div className="badges" style={{marginBottom: '.75rem'}}>
        <span className="badge">Microsoft</span>
        <span className="badge">AWS</span>
        <span className="badge">Google</span>
        <span className="badge">Razorpay</span>
      </div>

      <h2>Business Partnerships</h2>
      <div className="grid">
        <div className="card"><strong>Local SMBs</strong><p className="muted">Bulk support agreements and corporate packages.</p></div>
        <div className="card"><strong>Referrals</strong><p className="muted">Earn rewards for introducing new clients.</p></div>
        <div className="card"><strong>Vendors</strong><p className="muted">Hardware/software supply partnerships.</p></div>
      </div>

      <h2>Become a Partner</h2>
      <div className="card">
        <form action="/thank-you/contact" method="get">
          <div className="field">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" required />
          </div>
          <div className="field">
            <label htmlFor="contact">Contact</label>
            <input id="contact" name="contact" placeholder="Name, Email, Phone" required />
          </div>
          <div className="field">
            <label htmlFor="type">Partnership Type</label>
            <select id="type" name="type" defaultValue="technology">
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="referral">Referral</option>
            </select>
          </div>
          <button type="submit">Apply</button>
        </form>
      </div>
    </section>
  );
}

