export const metadata = { title: "Testimonials" };

export default function TestimonialsPage() {
  return (
    <section className="section">
      <h1>What Our Customers Say</h1>
      <div className="grid">
        <div className="card"><strong>Priya – Freelancer</strong><p className="muted">“Laptop running like new after a remote cleanup. Fast and professional!” ⭐⭐⭐⭐⭐</p></div>
        <div className="card"><strong>Raj – SMB Owner</strong><p className="muted">“Network fixed the same day. Transparent rates and great communication.” ⭐⭐⭐⭐⭐</p></div>
        <div className="card"><strong>Anita – Founder</strong><p className="muted">“Loved the clarity and process on our website project. Highly recommended.” ⭐⭐⭐⭐⭐</p></div>
      </div>
    </section>
  );
}

