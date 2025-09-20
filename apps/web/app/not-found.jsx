import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <h1>Page Not Found</h1>
      <p className="muted">We couldn’t find that page. Try one of these links:</p>
      <div className="badges" style={{marginBottom: '1rem'}}>
        <Link className="badge" href="/">Home</Link>
        <Link className="badge" href="/services">Services</Link>
        <Link className="badge" href="/pricing">Pricing</Link>
        <Link className="badge" href="/contact">Contact</Link>
      </div>
    </section>
  );
}

