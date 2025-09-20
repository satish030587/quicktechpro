import Link from "next/link";

export const metadata = { title: "Page Not Found" };

export default function FourOhFourPage() {
  return (
    <section className="section">
      <h1>Oops — Page Not Found</h1>
      <p className="muted">That link looks broken. Try one of these:</p>
      <div className="badges" style={{marginBottom: '1rem'}}>
        <Link className="badge" href="/">Home</Link>
        <Link className="badge" href="/services">Services</Link>
        <Link className="badge" href="/book-service">Book Service</Link>
        <Link className="badge" href="/blog">Blog</Link>
        <Link className="badge" href="/contact">Contact</Link>
      </div>
    </section>
  );
}

