export const metadata = { title: "FAQ" };

import FAQClient from "./FAQClient";

export default function FAQPage() {
  const faqs = [
    { q: "How does remote support work?", a: "We securely connect to your computer with your permission, diagnose issues, and fix them while you watch. You can end the session anytime." },
    { q: "Is remote access safe?", a: "Yes. We use reputable remote tools and only access what you allow. Sessions are encrypted and audited." },
    { q: "Do you offer same-day service?", a: "Most remote sessions start within hours. Onsite visits depend on schedule and area coverage." },
    { q: "What areas in Bangalore do you cover?", a: "Koramangala, Indiranagar, HSR Layout, Whitefield, JP Nagar, Jayanagar, Marathahalli, and nearby areas." }
  ];
  return (
    <section className="section">
      <h1>Frequently Asked Questions</h1>
      <FAQClient faqs={faqs} />
      <p className="muted">Didn’t find what you need? <a href="/contact">Contact us</a>.</p>
    </section>
  );
}
