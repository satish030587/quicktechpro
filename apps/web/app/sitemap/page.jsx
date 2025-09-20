import Link from "next/link";

export const metadata = { title: "Sitemap" };

export default function HtmlSitemapPage() {
  const routes = [
    "/",
    "/services",
    "/pricing",
    "/about",
    "/contact",
    "/book-service",
    "/blog",
    "/faq",
    "/testimonials",
    "/knowledge-base",
    "/service-areas",
    "/partners",
    "/careers",
    "/privacy-policy",
    "/terms"
  ];
  return (
    <section className="section">
      <h1>HTML Sitemap</h1>
      <div className="grid">
        {routes.map((r) => (
          <div key={r} className="card"><Link href={r}>{r}</Link></div>
        ))}
      </div>
    </section>
  );
}

