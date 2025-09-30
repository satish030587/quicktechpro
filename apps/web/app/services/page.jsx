import Link from "next/link";
import Image from "next/image";
import {
  BriefcaseIcon,
  CheckIcon,
  ClockIcon,
  ComputerIcon,
  GlobeIcon,
  ShieldCheckIcon,
} from "../components/Icons";

const serviceCards = [
  {
    id: "remote-support",
    title: "Remote Tech Support",
    description: "Secure screen-share sessions to resolve software, network, and setup issues in one sitting.",
    price: "Rs. 1,499 per session",
    icon: ComputerIcon,
    href: "/book-service?type=remote",
    ctaLabel: "Book Remote Help",
  },
  {
    id: "ship-in-repairs",
    title: "Ship-in Laptop & PC Repairs",
    description: "Diagnostic-first repairs with clear quotes, quality parts, and careful workmanship.",
    price: "Free diagnostics + Rs. 2,499 onward",
    icon: BriefcaseIcon,
    href: "/book-service?type=repair",
    ctaLabel: "Start a Repair",
  },
  {
    id: "web-apps",
    title: "Small Business Web Apps",
    description: "Quotation-based web apps that automate bookings, inventory, billing, and customer portals.",
    price: "Projects from Rs. 45,000",
    icon: GlobeIcon,
    href: "/services/web-apps",
    ctaLabel: "See App Options",
  },
  {
    id: "used-laptops",
    title: "Quality Used Laptops",
    description: "Certified pre-owned devices with fresh OS installs, data sanitisation, and 90-day warranty.",
    price: "Stock updated weekly",
    icon: ShieldCheckIcon,
    href: "/used-laptops",
    ctaLabel: "Browse Inventory",
  },
];

const remoteHighlights = [
  "Secure, one-time quick assist sessions",
  "Fix slow PCs, printer and Wi-Fi problems",
  "Remove malware and tune up performance",
  "Set up new devices, email, and backups",
];

const repairSteps = [
  {
    title: "Free Diagnostics",
    copy: "Ship or drop off your device. We run a 16-point diagnostic and share findings within 24 hours.",
  },
  {
    title: "Transparent Quote",
    copy: "You approve parts and labour before we start. No work is completed without your go-ahead.",
  },
  {
    title: "Expert Repair",
    copy: "Certified technicians complete repairs in an ESD-safe bench with OEM or Grade-A components.",
  },
  {
    title: "Quality Assurance",
    copy: "Every device passes stress tests, thermal checks, and a clean OS handover before return shipping.",
  },
];

const webAppDeliverables = [
  "Discovery workshop and requirements brief",
  "Wireframes and UI kit tailored to your brand",
  "Responsive build on modern frameworks",
  "Integrations with payment, CRM, or inventory systems",
  "UAT, documentation, and staff walkthroughs",
  "30-day post-launch optimization sprint",
];

const laptopChecks = [
  "Full hardware diagnostics and battery health",
  "Fresh OS install with licensed software",
  "Security hardening and firmware updates",
  "Professional cleaning and cosmetic grading",
  "Data sanitation certificate",
  "90-day carry-in warranty with upgrade options",
];

const valueProps = [
  {
    title: "Same-Week Turnarounds",
    description: "Remote sessions and urgent repairs are prioritised so you can get back to business fast.",
    icon: ClockIcon,
  },
  {
    title: "Certified Technicians",
    description: "Our team holds vendor and CompTIA certifications with deep experience across Windows, macOS, and Linux.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Documented Outcomes",
    description: "Every service includes before-and-after notes, preventive recommendations, and secure records.",
    icon: BriefcaseIcon,
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="w-full bg-white py-16 md:py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-blue-700">
                Services
              </span>
              <h1 className="mt-5 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                End-to-End Tech Support for Modern Teams and Homes
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                QuickTech Pro delivers dependable remote sessions, ship-in repairs, business web apps, and curated used laptops for customers across Bangalore and beyond. Every engagement is transparent, secure, and tailored to your goals.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/book-service"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-blue-700"
                >
                  Book a Service
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-blue-600 px-8 py-3 text-base font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                >
                  Talk to a Specialist
                </Link>
              </div>
              <dl className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                  <dt className="text-sm uppercase tracking-wide text-gray-500">Support Sessions</dt>
                  <dd className="mt-1 text-2xl font-bold text-gray-900">1,200+</dd>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                  <dt className="text-sm uppercase tracking-wide text-gray-500">Business Clients</dt>
                  <dd className="mt-1 text-2xl font-bold text-gray-900">65+</dd>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                  <dt className="text-sm uppercase tracking-wide text-gray-500">Customer Rating</dt>
                  <dd className="mt-1 text-2xl font-bold text-gray-900">4.9 / 5</dd>
                </div>
              </dl>
            </div>
            <div className="relative hidden lg:block">
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <Image
                  src="/images/services-hero.jpg"
                  alt="Technicians collaborating on a laptop repair"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-8 -right-6 flex w-36 flex-col items-center rounded-2xl bg-blue-600 p-4 text-white shadow-xl">
                <span className="text-sm uppercase tracking-wide text-blue-100">Average response</span>
                <span className="text-3xl font-bold">35m</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full border-y border-gray-200 bg-gray-50 py-16">
        <div className="layout-container">
          <h2 className="text-3xl font-bold text-gray-900">What We Deliver</h2>
          <p className="mt-3 max-w-3xl text-lg text-gray-600">
            Choose a service pathway below to explore scope, turnaround, and pricing guidance. We combine remote expertise with hands-on repair facilities and a product bench for reliable hardware sourcing.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {serviceCards.map(({ id, title, description, price, icon: Icon, href, ctaLabel }) => (
              <article
                key={id}
                className="flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="mt-3 text-sm text-gray-600">{description}</p>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-blue-600">{price}</p>
                  <Link
                    href={href}
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    {ctaLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="remote-support" className="w-full bg-white py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Remote Tech Support</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Instant Resolutions from Certified Experts</h2>
              <p className="mt-4 text-lg text-gray-600">
                Book a secure remote session to resolve nagging issues without downtime. We deploy enterprise-grade tools for encrypted connections and provide a detailed service report after every call.
              </p>
              <ul className="mt-6 space-y-3">
                {remoteHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckIcon className="mt-1 h-5 w-5 flex-none text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/book-service?type=remote"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Schedule a Remote Session
                </Link>
                <Link
                  href="/services/remote-support"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600"
                >
                  View Detailed Scope
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/remote-support.jpg"
                  alt="Specialist providing remote tech assistance"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ship-in-repairs" className="w-full bg-gray-50 py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/onsite-support.jpg"
                  alt="Laptop being repaired on an ESD-safe workbench"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 left-6 rounded-2xl bg-white p-5 shadow-lg">
                <p className="text-sm font-semibold text-gray-900">Common Repairs</p>
                <p className="mt-2 text-xs text-gray-600">Logic board rework, SSD upgrades, OS rebuilds, thermal servicing, hinge repair.</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Ship-in Repairs</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Diagnostics-First Repairs with Honest Pricing</h2>
              <p className="mt-4 text-lg text-gray-600">
                Whether it is a dead laptop, water damage, or performance issues, we restore hardware with precision. Expect frequent status updates, approved parts, and professional packaging when we ship your device back.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {repairSteps.map(({ title, copy }) => (
                  <div key={title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{copy}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/book-service?type=repair"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Start a Repair Ticket
                </Link>
                <Link
                  href="/services/ship-in-repairs"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600"
                >
                  View Service Checklist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="web-apps" className="w-full bg-white py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Small Business Web Apps</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Fixed-Quote Delivery for Critical Workflows</h2>
              <p className="mt-4 text-lg text-gray-600">
                We design and ship bespoke web apps that keep your operations running. From booking engines to inventory and customer portals, our team builds using modular stacks that are easy to maintain and scale.
              </p>
              <ul className="mt-6 space-y-3">
                {webAppDeliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckIcon className="mt-1 h-5 w-5 flex-none text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/services/web-apps#estimate"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Request a Project Estimate
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600"
                >
                  Explore Recent Work
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/business-website.png"
                  alt="Dashboard style web application interface"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="used-laptops" className="w-full bg-gray-50 py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/people-with-laptops-office.jpg"
                  alt="Professionals using refurbished laptops in an office"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 right-6 rounded-2xl bg-white p-5 shadow-lg">
                <p className="text-sm font-semibold text-gray-900">Device Grades</p>
                <p className="mt-2 text-xs text-gray-600">Grade A (like new), Grade B (light wear), Grade C (value). Includes power adapter.</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Quality Used Laptops</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Certified Devices Ready for Work or Study</h2>
              <p className="mt-4 text-lg text-gray-600">
                Access business-grade laptops without the steep price. Every unit is sourced from corporate refresh programs, fully restored by our technicians, and backed by a dependable warranty.
              </p>
              <ul className="mt-6 space-y-3">
                {laptopChecks.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckIcon className="mt-1 h-5 w-5 flex-none text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/used-laptops"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  View Current Stock
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600"
                >
                  Request a Sourcing List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-20">
        <div className="layout-container">
          <div className="rounded-3xl border border-gray-200 bg-blue-50 p-10 md:p-16">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Why QuickTech Pro</h2>
                <p className="mt-4 text-lg text-gray-700">
                  We combine a dedicated support desk, certified repair lab, and experienced developers so you can rely on one trusted partner for everything technology.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {valueProps.map(({ title, description, icon: Icon }) => (
                    <div key={title} className="rounded-2xl border border-white bg-white p-5 shadow-sm">
                      <Icon className="h-8 w-8 text-blue-600" />
                      <h3 className="mt-3 text-base font-semibold text-gray-900">{title}</h3>
                      <p className="mt-2 text-sm text-gray-600">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-white p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900">How to Engage</h3>
                <ol className="mt-5 space-y-4 text-gray-700">
                  <li>
                    <strong className="text-gray-900">1. Connect</strong>
                    <p className="text-sm">Book a slot or share your requirement via phone, WhatsApp, or the contact form.</p>
                  </li>
                  <li>
                    <strong className="text-gray-900">2. Confirm Scope</strong>
                    <p className="text-sm">We review needs, set expectations, and share a transparent estimate or proposal.</p>
                  </li>
                  <li>
                    <strong className="text-gray-900">3. Deliver & Support</strong>
                    <p className="text-sm">Our team executes, keeps you informed, and provides aftercare with clear documentation.</p>
                  </li>
                </ol>
                <div className="mt-6 rounded-xl bg-blue-600 p-6 text-white">
                  <p className="text-sm uppercase tracking-wide text-blue-100">Need Priority Support?</p>
                  <p className="mt-2 text-lg font-semibold">Call +91 80-4123-7890 or message us on WhatsApp for immediate assistance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-blue-600 py-16 text-white">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold">Let us keep your technology running effortlessly</h2>
              <p className="mt-4 text-lg text-blue-100">
                Tell us what you are working on and we will tailor a support plan, repair workflow, or development sprint that fits your timeline.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/book-service"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-base font-semibold text-blue-600 hover:bg-gray-100"
                >
                  Book a Service
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-blue-400 bg-blue-500/60 p-8">
              <h3 className="text-xl font-semibold">What to Expect Next</h3>
              <ul className="mt-5 space-y-4 text-blue-50">
                <li className="flex gap-3">
                  <CheckIcon className="h-5 w-5 flex-none text-white" />
                  <span>Response within business hours or sooner for priority tickets.</span>
                </li>
                <li className="flex gap-3">
                  <CheckIcon className="h-5 w-5 flex-none text-white" />
                  <span>Clear pricing with digital invoices and receipts.</span>
                </li>
                <li className="flex gap-3">
                  <CheckIcon className="h-5 w-5 flex-none text-white" />
                  <span>Dedicated point of contact until your service is completed.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
