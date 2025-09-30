import ContactForm from "./ContactForm";
import Link from "next/link";
import { CheckIcon, ChevronRightIcon, ClockIcon, PhoneIcon } from "../components/Icons";

const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.167519941677!2d77.74876857502745!3d12.964664215115033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae13c0fa4ec4e7%3A0x1f6d80cd2749e8c9!2sWhitefield%20Tech%20Park!5e0!3m2!1sen!2sin!4v1726934400000!5m2!1sen!2sin";

export const metadata = { title: "Contact Us | QuickTech Pro" };

const stats = [
  { label: "Average first response", value: "35 minutes" },
  { label: "Remote slots", value: "Same day" },
  { label: "Repair diagnostics", value: "24 hours" },
];

const contactMethods = [
  {
    label: "Phone and WhatsApp",
    value: "+91 80-4123-7890",
    meta: "Mon-Sat, 10:00-19:00 IST",
    icon: PhoneIcon,
  },
  {
    label: "Email",
    value: "support@quicktechpro.com",
    meta: "Replies within one business day",
    icon: MailIcon,
  },
  {
    label: "Repair lab",
    value: "Whitefield Tech Park, Tower B",
    meta: "Drop-off by appointment only",
    icon: LocationIcon,
  },
];

const escalations = [
  "Priority hardware outages",
  "Cybersecurity incidents",
  "Critical web app downtime",
];

const quickLinks = [
  { href: "/pricing#remote-support", label: "Remote support pricing" },
  { href: "/pricing#ship-in-repairs", label: "Ship-in repair pricing" },
  { href: "/services/web-apps#estimate", label: "Web app project estimate" },
  { href: "/used-laptops", label: "View certified used laptops" },
  { href: "/pricing#care-plans", label: "Compare managed care plans" },
];

function MailIcon({ className = "h-6 w-6", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

function LocationIcon({ className = "h-6 w-6", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 22s-7-5.33-7-11a7 7 0 1 1 14 0c0 5.67-7 11-7 11z" />
      <circle cx="12" cy="11" r="3" />
    </svg>
  );
}

function MapEmbed() {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <iframe
        title="QuickTech Pro on Google Maps"
        src={MAP_EMBED_URL}
        className="h-[360px] w-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default function ContactPage() {
  return (
    <main>
      <section className="w-full bg-white py-16 md:py-20">
        <div className="layout-container text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-blue-700">
            Contact
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            We are ready to help
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600 mx-auto">
            Share your request and a QuickTech Pro coordinator will reply with next steps, transparent pricing, and the right specialist.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-16">
        <div className="layout-container grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">Speak to a coordinator</h2>
              <p className="mt-3 text-sm text-gray-600">
                Prefer a quick call or message? Reach out on the channel that suits you and we will align the right technician or developer.
              </p>
              <ul className="mt-6 space-y-4">
                {contactMethods.map(({ label, value, meta, icon: Icon }) => (
                  <li key={label} className="flex items-start gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{label}</p>
                      <p className="text-base text-gray-800">{value}</p>
                      <p className="text-sm text-gray-500">{meta}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Need urgent assistance?</p>
                <p className="mt-2">Mention your ticket number when calling or messaging so we can escalate immediately.</p>
                <ul className="mt-3 space-y-1">
                  {escalations.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm">
                <p className="text-sm font-semibold text-gray-900">Quick links</p>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {quickLinks.map(({ href, label }) => (
                    <Link key={label} href={href} className="inline-flex items-center justify-between rounded-lg border border-transparent bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600">
                      <span>{label}</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Send us the details</h2>
            <p className="mt-3 text-sm text-gray-600">
              Tell us about your device, project, or support need. We respond within business hours with next steps and scheduling options.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-16">
        <div className="layout-container grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,3fr),minmax(0,2fr)] lg:items-center">
          <MapEmbed />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Visit our repair lab</h2>
            <p className="text-sm text-gray-600">
              Book a drop-in slot or ship your device to our Whitefield facility. We operate an ESD-safe bench with diagnostics, board-level repair, and refurbishment stations.
            </p>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700">
              <p className="text-xs uppercase tracking-wide text-gray-500">Address</p>
              <p className="mt-2 text-gray-800">Whitefield Tech Park, Tower B</p>
              <p className="text-gray-800">Bangalore, Karnataka 560066</p>
              <p className="mt-3 text-xs text-gray-500">Drop-off by appointment only. Ship-in labels provided after diagnostic approval.</p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600">
              <PhoneIcon className="h-4 w-4" />
              Call +91 80-4123-7890 to schedule a visit
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
