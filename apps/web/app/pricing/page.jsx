import Link from "next/link";
import Image from "next/image";
import {
  BriefcaseIcon,
  CheckIcon,
  ComputerIcon,
  GlobeIcon,
  ShieldCheckIcon,
} from "../components/Icons";

const navCards = [
  {
    id: "remote-support",
    title: "Remote Tech Support",
    description: "Secure fixes without downtime",
    price: "Rs. 1,499 per session",
    icon: ComputerIcon,
  },
  {
    id: "ship-in-repairs",
    title: "Ship-in Laptop & PC Repairs",
    description: "Diagnostics-first lab service",
    price: "Labour from Rs. 2,499",
    icon: BriefcaseIcon,
  },
  {
    id: "web-apps",
    title: "Small Business Web Apps",
    description: "Fixed-quote project delivery",
    price: "Projects from Rs. 45,000",
    icon: GlobeIcon,
  },
  {
    id: "used-laptops",
    title: "Quality Used Laptops",
    description: "Certified, warranty-backed devices",
    price: "Inventory from Rs. 18,500",
    icon: ShieldCheckIcon,
  },
];

const heroBadges = [
  "Transparent quotes before work begins",
  "No fix, no fee on remote support",
  "90-day repair warranty",
  "GST invoices and digital reports",
];

const heroStats = [
  { label: "Support Sessions", value: "1,200+" },
  { label: "Average Response", value: "35 mins" },
  { label: "Customer Rating", value: "4.9 / 5" },
];

const remoteSupportPackages = [
  {
    name: "Quick Fix Session",
    price: "Rs. 1,499",
    duration: "Up to 45 minutes",
    description: "Perfect for single-issue fixes, printer problems, or performance tune-ups.",
    includes: [
      "Secure connection with certified technician",
      "Troubleshooting for one core issue and preventive tips",
      "7-day follow-up for the same issue",
    ],
    href: "/book-service?type=remote&package=quick-fix",
  },
  {
    name: "Advanced Care Session",
    price: "Rs. 1,899",
    duration: "Up to 90 minutes",
    description: "Ideal for multi-issue cleanups, malware removal, and OS optimisation.",
    includes: [
      "Malware scan and removal",
      "Startup, registry, and browser optimisation",
      "Security hardening checklist",
    ],
    href: "/book-service?type=remote&package=advanced-care",
  },
  {
    name: "Business Priority Support",
    price: "Rs. 2,699",
    duration: "Priority queue scheduling",
    description: "Designed for SMB teams needing rapid response and documentation.",
    includes: [
      "Immediate technician assignment",
      "Multi-device support within the same session",
      "Service summary and prevention notes",
    ],
    href: "/book-service?type=remote&package=business-priority",
  },
];

const remoteAssurance = [
  "Encrypted, one-time access with consent-based control",
  "Session recording available on request",
  "Pay only after the resolution is confirmed",
];

const repairPackages = [
  {
    name: "Diagnostic & Health Report",
    price: "Free",
    turnaround: "Findings within 24 hours",
    description: "Comprehensive hardware and software check with a documented report.",
    includes: [
      "16-point diagnostic checklist",
      "Thermal, storage, and battery evaluation",
      "Repair quote with parts options",
    ],
  },
  {
    name: "Standard Repair",
    price: "Labour from Rs. 2,499",
    turnaround: "2-4 business days",
    description: "Covers storage upgrades, OS rebuilds, component swaps, and hinge fixes.",
    includes: [
      "OEM or Grade-A parts only",
      "ESD-safe bench handling",
      "90-day labour warranty",
    ],
  },
  {
    name: "Advanced Board-Level Repair",
    price: "Labour from Rs. 4,999",
    turnaround: "4-7 business days",
    description: "Board rework, liquid damage treatment, and complex diagnostics.",
    includes: [
      "Microsoldering and board-level inspection",
      "Ultrasonic cleaning and corrosion control",
      "Stress testing before dispatch",
    ],
  },
];

const repairAddOns = [
  "Pickup and delivery within Bangalore: Rs. 499 each way",
  "Priority 48-hour turnaround add-on: Rs. 1,200",
  "Data backup and migration: Rs. 1,099 (up to 256 GB)",
];

const carePlans = [
  {
    name: "Essential Care",
    price: "Rs. 4,999 / month",
    bestFor: "Home offices and freelancers",
    items: [
      "2 remote sessions each month",
      "Endpoint security monitoring",
      "Quarterly health reports",
    ],
  },
  {
    name: "Growth Team",
    price: "Rs. 9,999 / month",
    bestFor: "Teams up to 10 members",
    items: [
      "Unlimited remote incident support",
      "Monthly onsite visit",
      "Asset and license tracking",
    ],
  },
  {
    name: "Managed Desk",
    price: "Rs. 17,999 / month",
    bestFor: "Multi-location SMBs",
    items: [
      "Dedicated account manager",
      "SLA-backed resolution targets",
      "Proactive maintenance playbooks",
    ],
  },
];

const webBundles = [
  {
    name: "Launch Website",
    price: "Rs. 45,000",
    timeline: "3-4 weeks",
    image: "/images/business-website.png",
    description: "For service businesses that need a polished, lead-ready site.",
    includes: [
      "Up to 6 custom-designed pages",
      "CMS for easy edits",
      "Contact forms and lead routing",
    ],
  },
  {
    name: "Commerce Suite",
    price: "Rs. 85,000",
    timeline: "5-6 weeks",
    image: "/images/ecommerce-store.png",
    description: "Full-featured commerce deployment with secure payments.",
    includes: [
      "Product catalogue and inventory rules",
      "Payment gateway integration",
      "Order tracking dashboard",
    ],
  },
  {
    name: "Operations Portal",
    price: "Rs. 135,000+",
    timeline: "6-10 weeks",
    image: "/images/web-application.png",
    description: "Workflow automation for bookings, inventory, or customer portals.",
    includes: [
      "Discovery workshops and UX wireframes",
      "Role-based access and reporting",
      "Handover, training, and 30-day optimisation",
    ],
  },
];

const laptopBands = [
  {
    name: "Business Essentials",
    range: "Rs. 18,500 - 28,500",
    idealFor: "Students, remote workers, SME staff",
    points: [
      "Intel Core i5 / Ryzen 5, 8 GB RAM, 256 GB SSD",
      "Grade A/B cosmetics with fresh OS install",
      "90-day carry-in warranty",
    ],
  },
  {
    name: "Performance Plus",
    range: "Rs. 29,000 - 42,000",
    idealFor: "Designers, engineers, analytics teams",
    points: [
      "Intel Core i7 / Ryzen 7, 16 GB RAM, SSD + upgrades",
      "Pro calibration and stress testing",
      "Extended warranty options up to 6 months",
    ],
  },
  {
    name: "Ultrabook & 2-in-1",
    range: "Rs. 38,000 - 55,000",
    idealFor: "Executives and frequent travellers",
    points: [
      "Premium lightweight chassis with touch or convertible displays",
      "Battery health above 85% guaranteed",
      "Travel-ready accessories kit",
    ],
  },
];

const faqs = [
  {
    question: "Do prices include GST?",
    answer:
      "Yes. All pricing listed is inclusive of GST. Invoices are issued digitally alongside service summaries.",
  },
  {
    question: "What happens if my issue is not fixed?",
    answer:
      "Remote sessions operate on a no fix, no fee basis. For repairs, you only pay once you approve the quote and the device passes quality checks.",
  },
  {
    question: "How are web projects billed?",
    answer:
      "Projects follow a milestone-based schedule: 40% to initiate, 40% on staging approval, and 20% on launch. Retainer options are available for ongoing iterations.",
  },
  {
    question: "Can I reserve a specific laptop model?",
    answer:
      "Yes. Share the configuration you need and we will source, certify, and hold the unit with a small refundable deposit.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="w-full bg-white py-16 md:py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-blue-700">
                Pricing
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                Predictable Pricing, Real Results
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                QuickTech Pro keeps technology budgets clear. From remote sessions to managed care plans and custom web apps, every engagement is scoped upfront with transparent deliverables and timelines.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
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
                  Request a Custom Quote
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {heroBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
                    {badge}
                  </span>
                ))}
              </div>
              <dl className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {heroStats.map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                    <dt className="text-sm uppercase tracking-wide text-gray-500">{label}</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative hidden lg:block">
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <Image
                  src="/images/services-hero.jpg"
                  alt="Technicians planning IT service pricing"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-8 -right-6 flex w-36 flex-col items-center rounded-2xl bg-blue-600 p-4 text-white shadow-xl">
                <span className="text-sm uppercase tracking-wide text-blue-100">Average turnaround</span>
                <span className="text-3xl font-bold">24 h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full border-y border-gray-200 bg-gray-50 py-12">
        <div className="layout-container">
          <h2 className="text-2xl font-bold text-gray-900">Browse pricing by service</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {navCards.map(({ id, title, description, price, icon: Icon }) => (
              <Link
                key={id}
                href={`#${id}`}
                className="flex flex-col items-start rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
                <span className="mt-4 text-sm font-semibold text-blue-600">{price}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="remote-support" className="w-full bg-white py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Remote Tech Support Pricing</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Resolve issues in a single secure session</h2>
              <p className="mt-4 text-lg text-gray-600">
                Every remote visit includes a documented checklist, preventive recommendations, and billing only after your approval.
              </p>
              <ul className="mt-6 space-y-3">
                {remoteAssurance.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckIcon className="mt-1 h-5 w-5 flex-none text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {remoteSupportPackages.map(({ name, price, duration, description, includes, href }) => (
                <article
                  key={name}
                  className="flex h-full flex-col rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{price}</p>
                    <p className="text-sm text-gray-500">{duration}</p>
                    <p className="mt-3 text-sm text-gray-700">{description}</p>
                  </div>
                  <ul className="mt-4 flex-1 space-y-2">
                    {includes.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={href}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Book this session
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ship-in-repairs" className="w-full bg-gray-50 py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/onsite-support.jpg"
                  alt="Technician performing a laptop repair"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 left-6 rounded-2xl bg-white p-5 shadow-lg">
                <p className="text-sm font-semibold text-gray-900">Included with every repair</p>
                <p className="mt-2 text-xs text-gray-600">Diagnostic report, photo documentation, secure packaging for return shipping.</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Ship-in Repairs</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Diagnostics-first repairs with clear approvals</h2>
              <p className="mt-4 text-lg text-gray-600">
                Send or drop off your device and approve the plan before we touch a screw. We only invoice once the repair is complete and stress tested.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {repairPackages.map(({ name, price, turnaround, description, includes }) => (
                  <article key={name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                    <p className="mt-2 text-xl font-bold text-blue-600">{price}</p>
                    <p className="text-xs uppercase tracking-wide text-gray-500">{turnaround}</p>
                    <p className="mt-3 text-sm text-gray-700">{description}</p>
                    <ul className="mt-4 space-y-2">
                      {includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-dashed border-blue-300 bg-blue-50 p-5 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Popular add-ons</p>
                <ul className="mt-3 space-y-1">
                  {repairAddOns.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/book-service?type=repair"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Start a repair ticket
                </Link>
                <Link
                  href="/services/ship-in-repairs"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600"
                >
                  View repair checklist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="care-plans" className="w-full bg-white py-20">
        <div className="layout-container">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Managed Care Plans</span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Keep teams productive with predictable monthly support</h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose a plan that matches your device count and coverage needs. All plans include onboarding, documentation, and a quarterly strategy review.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {carePlans.map(({ name, price, bestFor, items }) => (
              <article key={name} className="flex h-full flex-col rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                  <p className="mt-2 text-3xl font-bold text-blue-600">{price}</p>
                  <p className="text-sm text-gray-500">{bestFor}</p>
                </div>
                <ul className="mt-4 flex-1 space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact?topic=care-plan"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Schedule a pricing call
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="web-apps" className="w-full bg-gray-50 py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Small Business Web Apps</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Fixed-quote delivery with milestone billing</h2>
              <p className="mt-4 text-lg text-gray-600">
                We map requirements, lock scope, and deliver each milestone with demos and QA. Maintenance retainers are available once you launch.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {webBundles.map(({ name, price, timeline, image, description, includes }) => (
                <article key={name} className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="h-40 overflow-hidden">
                    <Image src={image} alt={name} width={400} height={200} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{price}</p>
                    <p className="text-sm text-gray-500">Timeline: {timeline}</p>
                    <p className="mt-3 text-sm text-gray-700">{description}</p>
                    <ul className="mt-4 flex-1 space-y-2">
                      {includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/services/web-apps#estimate"
                      className="mt-6 inline-flex items-center justify-center rounded-full border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      Request full proposal
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-12 rounded-3xl border border-blue-200 bg-blue-50 p-8 text-center text-sm text-gray-700">
            <p>
              Need ongoing enhancements? Bundle post-launch sprints at a discounted hourly rate when booked within 60 days of go-live.
            </p>
          </div>
        </div>
      </section>

      <section id="used-laptops" className="w-full bg-white py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative order-2 lg:order-1">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/people-with-laptops-office.jpg"
                  alt="Professionals using refurbished laptops"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 right-6 rounded-2xl bg-white p-5 shadow-lg">
                <p className="text-sm font-semibold text-gray-900">Each device includes</p>
                <p className="mt-2 text-xs text-gray-600">Data sanitisation, stress test report, charger, and warranty card.</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Quality Used Laptops</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Certified hardware with enterprise-grade refurbishment</h2>
              <p className="mt-4 text-lg text-gray-600">
                Stock changes weekly. Share your workload, and we will shortlist the best-matched devices within your budget and reserve them for inspection.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-5">
                {laptopBands.map(({ name, range, idealFor, points }) => (
                  <article key={name} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                      <span className="text-sm font-semibold text-blue-600">{range}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{idealFor}</p>
                    <ul className="mt-4 space-y-2">
                      {points.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/used-laptops"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  View current stock
                </Link>
                <Link
                  href="/contact?topic=laptops"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600"
                >
                  Request sourcing support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Questions</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Pricing and billing FAQ</h2>
              <p className="mt-4 text-lg text-gray-600">
                Still unsure about scope or budget? We are happy to prepare a detailed proposal that covers deliverables, milestones, and payment cadence.
              </p>
              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Need something custom?</p>
                <p className="mt-2">
                  Book a 15-minute discovery call. We will map your requirements and send a tailored quote within one business day.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {faqs.map(({ question, answer }) => (
                <article key={question} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
                  <p className="mt-3 text-sm text-gray-700">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-blue-600 py-16 text-white">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold">Ready to lock in your service slot?</h2>
              <p className="mt-4 text-lg text-blue-100">
                Share your challenge or project goals and we will confirm pricing, availability, and next steps within the business day.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/book-service"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-base font-semibold text-blue-600 hover:bg-gray-100"
                >
                  Book a service
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Talk to sales
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-blue-400 bg-blue-500/60 p-8 text-blue-50">
              <h3 className="text-xl font-semibold text-white">When you reach out</h3>
              <ul className="mt-5 space-y-4">
                <li className="flex gap-3">
                  <CheckIcon className="h-5 w-5 flex-none text-white" />
                  <span>Get a same-day response with estimated timelines.</span>
                </li>
                <li className="flex gap-3">
                  <CheckIcon className="h-5 w-5 flex-none text-white" />
                  <span>Receive digital paperwork, GST invoice, and payment links.</span>
                </li>
                <li className="flex gap-3">
                  <CheckIcon className="h-5 w-5 flex-none text-white" />
                  <span>Work with one coordinator through completion.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}



