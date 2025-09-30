"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BriefcaseIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  ComputerIcon,
  GlobeIcon,
  ShieldCheckIcon,
} from "./components/Icons";

const heroSlides = [
  {
    key: "remote",
    image: "/images/remote-support.jpg",
    alt: "Technician providing remote support",
    chip: "Remote support - No fix, no fee",
    title: "Remote Tech Support in Minutes",
    text: "Secure one-time sessions that solve slow systems, Wi-Fi drops, printer issues, and malware without stepping out.",
    cta: { href: "/book-service?type=remote", label: "Book Remote Support" },
    secondary: { href: "/services/remote-support", label: "View Remote Scope" },
  },
  {
    key: "repairs",
    image: "/images/onsite-support.jpg",
    alt: "Laptop repair bench",
    chip: "Diagnostics first - 90 day warranty",
    title: "Ship-in Laptop and PC Repairs",
    text: "Certified technicians restore your hardware with transparent quotes, quality parts, and detailed health reports.",
    cta: { href: "/book-service?type=repair", label: "Start a Repair" },
    secondary: { href: "/services/ship-in-repairs", label: "Repair Checklist" },
  },
  {
    key: "apps",
    image: "/images/business-website.png",
    alt: "Business dashboard interface",
    chip: "Fixed quote - Milestone billing",
    title: "Small Business Web Apps",
    text: "Launch tailored booking, inventory, and client portals with modern UX, milestone demos, and documentation.",
    cta: { href: "/services/web-apps#estimate", label: "Request App Estimate" },
    secondary: { href: "/pricing#web-apps", label: "See Pricing Bundles" },
  },
  {
    key: "laptops",
    image: "/images/people-with-laptops-office.jpg",
    alt: "Professionals using refurbished laptops",
    chip: "Certified devices - Weekly stock",
    title: "Quality Used Laptops",
    text: "Enterprise grade laptops with fresh OS installs, stress tests, and 90 day warranty ready for work or study.",
    cta: { href: "/used-laptops", label: "Browse Current Stock" },
    secondary: { href: "/contact?topic=laptops", label: "Request Sourcing" },
  },
];

const trustStats = [
  { value: "1,200+", label: "Support sessions delivered" },
  { value: "65+", label: "Active business clients" },
  { value: "90 days", label: "Repair workmanship warranty" },
  { value: "4.9 / 5", label: "Average customer rating" },
];

const serviceCards = [
  {
    title: "Remote Tech Support",
    description: "Encrypted screen share, quick diagnostics, and no fix no fee promise.",
    price: "Sessions from Rs. 1,499",
    href: "/services#remote-support",
    cta: "Explore Remote",
    icon: ComputerIcon,
  },
  {
    title: "Ship-in Laptop Repairs",
    description: "Free diagnostics, approved quotes, and OEM grade parts on every repair.",
    price: "Labour from Rs. 2,499",
    href: "/services#ship-in-repairs",
    cta: "Explore Repairs",
    icon: BriefcaseIcon,
  },
  {
    title: "Small Business Web Apps",
    description: "Discovery workshops, UI kit, integrations, and post launch optimisation.",
    price: "Projects from Rs. 45,000",
    href: "/services#web-apps",
    cta: "Explore Web Apps",
    icon: GlobeIcon,
  },
  {
    title: "Certified Used Laptops",
    description: "Stress tested inventory with documentation, sanitisation, and warranty.",
    price: "Stock from Rs. 18,500",
    href: "/services#used-laptops",
    cta: "Explore Devices",
    icon: ShieldCheckIcon,
  },
];

const remoteHighlights = [
  "Certified technicians with same day availability",
  "Secure, consent based access with audit logs",
  "Fixes for OS tune ups, connectivity, email, and printing",
  "Follow up for the same issue free within seven days",
];

const repairSteps = [
  {
    title: "Diagnostics and report",
    copy: "We capture symptoms, run a 16 point hardware check, and share findings within 24 hours.",
  },
  {
    title: "Transparent approval",
    copy: "Quotes list parts and labour clearly. Work only begins once you approve the plan.",
  },
  {
    title: "Precision repair",
    copy: "ESD safe benches, Grade A or OEM parts, and frequent status updates through completion.",
  },
  {
    title: "Quality assurance",
    copy: "Stress tests, thermal checks, clean OS handover, and insured return shipping.",
  },
];

const webAppHighlights = [
  "Discovery workshop and requirements brief",
  "Wireframes and component library aligned to your brand",
  "Responsive build on modern frameworks with staging demos",
  "Payment, CRM, or inventory integrations as needed",
  "Launch documentation and handover training",
  "30 day optimisation sprint after go live",
];

const laptopHighlights = [
  "Inventory sourced from enterprise refresh programs",
  "Fresh OS image with licensed software and drivers",
  "Battery health above 85 percent and stress tested thermals",
  "Data sanitisation certificate and cosmetic grading",
  "Upgrade options for RAM, storage, and accessories",
];

const valueProps = [
  {
    title: "Same week turnarounds",
    description: "Remote sessions, urgent repairs, and quick web iterations are prioritised to minimise downtime.",
    icon: ClockIcon,
  },
  {
    title: "Certified expertise",
    description: "Team members hold vendor and CompTIA credentials across Windows, macOS, and Linux stacks.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Documented outcomes",
    description: "Every service includes before and after notes, recommendations, and digital paperwork.",
    icon: BriefcaseIcon,
  },
];

const testimonials = [
  {
    quote: "Remote session resolved a complex Outlook sync issue in under an hour and came with clear prevention tips.",
    name: "Anita Rao",
    role: "Operations Lead, FinServe Co.",
  },
  {
    quote: "Our laptops came back cleaner than new with thermal issues fixed and full reports for compliance.",
    name: "Rahul Shah",
    role: "Founder, Design Lab",
  },
  {
    quote: "The booking app launch was smooth, milestones were transparent, and adoption was instant for our staff.",
    name: "Meera Thomas",
    role: "Clinic Director, HealthFirst",
  },
];

const faqs = [
  {
    question: "Do you share quotes before work begins?",
    answer: "Yes. Remote sessions are billed only after resolution. Repairs and projects move forward only after you approve a documented quote.",
  },
  {
    question: "Can you support hybrid teams across cities?",
    answer: "Remote sessions and managed care plans cover devices anywhere. Ship in repairs and laptop sourcing include insured logistics.",
  },
  {
    question: "How quickly can I get started?",
    answer: "Remote slots are available the same day. Repairs usually start within 24 hours of arrival. Web projects kick off after a discovery call.",
  },
];

function ArrowLeftIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M12.707 15.707a1 1 0 01-1.414 0L6 10.414l5.293-5.293a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" />
    </svg>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M7.293 4.293a1 1 0 011.414 0L13 8.586 8.707 12.88a1 1 0 01-1.414-1.414L10.172 9 7.293 6.121a1 1 0 010-1.828z" />
    </svg>
  );
}

function HeroCarousel() {
  const slides = heroSlides;
  const FALLBACK = "/images/hero-bg.jpg";
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  const goTo = (i) => setIndex((i + slides.length) % slides.length);
  const current = slides[index];

  return (
    <section
      className="relative isolate flex h-screen min-h-[640px] w-full overflow-hidden -mt-[4.5rem]"
      aria-roledescription="carousel"
      aria-label="QuickTech Pro service highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.key}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <Image
            src={slide.image || FALLBACK}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/45 to-black/25" />
        </div>
      ))}

      <div className="relative z-10 flex h-full w-full items-center">
        <div className="layout-container max-w-screen-xl flex h-full flex-col justify-center">
          <div className="w-full max-w-3xl space-y-8 text-left text-white">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                IT
              </span>
              <span>{current.chip}</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{current.title}</h1>

            <p className="text-lg md:text-xl text-white/85">{current.text}</p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-blue-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-blue-600"
                href={current.cta.href}
              >
                {current.cta.label}
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-base font-semibold text-white/90 transition-colors hover:bg-white/10"
                href={current.secondary.href}
              >
                {current.secondary.label}
                <ChevronRightIcon className="ml-1.5 h-5 w-5" />
              </Link>
            </div>

            <p className="text-xs md:text-sm text-white/75">
              Remote experts - Diagnostics first repairs - Fixed quote web apps - Certified hardware sourcing
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-20">
        <div className="layout-container flex items-center justify-between">
          <div className="flex gap-2" aria-label="Carousel slides">
            {slides.map((slide, i) => (
              <button
                key={slide.key}
                onClick={() => goTo(i)}
                aria-label={`Go to ${slide.title}`}
                className={`h-2.5 w-8 rounded-full transition-all ${i === index ? "bg-white" : "bg-white/40 hover:bg-white/60"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous slide"
              className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next slide"
              className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />

      <section className="w-full border-t border-b border-gray-200 bg-gray-50 py-12">
        <div className="layout-container grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {trustStats.map((item) => (
            <div key={item.label} className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="mt-2 text-sm text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-white py-20">
        <div className="layout-container">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900">One trusted partner for every technology need</h2>
            <p className="mt-4 text-lg text-gray-600">
              QuickTech Pro blends remote experts, a certified repair lab, web engineers, and hardware sourcing under one roof so you can keep teams productive without juggling multiple vendors.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {serviceCards.map(({ title, description, price, href, cta, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="mt-3 text-sm text-gray-600">{description}</p>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-blue-600">{price}</p>
                  <span className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600">
                    {cta}
                    <ChevronRightIcon className="ml-1.5 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="remote-support" className="w-full bg-gray-50 py-20">
        <div className="layout-container grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Remote Tech Support</span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Fix issues fast with secure remote sessions</h2>
            <p className="mt-4 text-lg text-gray-600">
              Book a certified specialist to connect, diagnose, and resolve in a single sitting. Every session ends with a summary, preventive advice, and a seven day safety net for the same issue.
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
                Schedule a remote session
              </Link>
              <Link
                href="/pricing#remote-support"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600"
              >
                View remote pricing
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/images/remote-support.jpg"
              alt="Technician guiding a client remotely"
              width={640}
              height={480}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="ship-in-repairs" className="w-full bg-white py-20">
        <div className="layout-container grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/onsite-support.jpg"
                alt="Laptop repair in progress"
                width={640}
                height={480}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-6 rounded-2xl bg-white p-5 shadow-lg">
              <p className="text-sm font-semibold text-gray-900">Included with every repair</p>
              <p className="mt-2 text-xs text-gray-600">Photo documentation, diagnostic summary, secure packaging, insured shipping.</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Ship-in Repairs</span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Diagnostics first, approvals before parts, zero surprises</h2>
            <p className="mt-4 text-lg text-gray-600">
              From dead motherboards to thermal throttling, our repair lab treats every device with enterprise grade care. Expect proactive updates and a warranty you can trust.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {repairSteps.map((step) => (
                <div key={step.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{step.copy}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/book-service?type=repair"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Start a repair ticket
              </Link>
              <Link
                href="/pricing#ship-in-repairs"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600"
              >
                Review repair pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="web-apps" className="w-full bg-gray-50 py-20">
        <div className="layout-container grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Small Business Web Apps</span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Fixed quote delivery for critical workflows</h2>
            <p className="mt-4 text-lg text-gray-600">
              We translate your operations into streamlined digital experiences. From bookings to billing, every module is scoped, prototyped, and reviewed with your stakeholders.
            </p>
            <ul className="mt-6 space-y-3">
              {webAppHighlights.map((item) => (
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
                Request a project estimate
              </Link>
              <Link
                href="/pricing#web-apps"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600"
              >
                View web app bundles
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/images/business-website.png"
              alt="Responsive web application preview"
              width={640}
              height={480}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="used-laptops" className="w-full bg-white py-20">
        <div className="layout-container grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative order-2 lg:order-2">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/people-with-laptops-office.jpg"
                alt="Team working on refurbished laptops"
                width={640}
                height={480}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-6 rounded-2xl bg-white p-5 shadow-lg">
              <p className="text-sm font-semibold text-gray-900">Grades and inclusions</p>
              <p className="mt-2 text-xs text-gray-600">Grade A like new, Grade B light wear, Grade C value. Charger, warranty card, and stress test report included.</p>
            </div>
          </div>
          <div className="order-1 lg:order-1">
            <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Certified Used Laptops</span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Curated devices prepared for work, study, or field teams</h2>
            <p className="mt-4 text-lg text-gray-600">
              Share your workloads and we shortlist the right models, reserve them for inspection, and deliver ready to deploy with documentation and warranty.
            </p>
            <ul className="mt-6 space-y-3">
              {laptopHighlights.map((item) => (
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
      </section>

      <section className="w-full bg-gray-50 py-20">
        <div className="layout-container grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Why teams trust QuickTech Pro</h2>
            <p className="mt-4 text-lg text-gray-600">
              Engage one partner for helpdesk, repair, development, and hardware. We document every interaction so your technology keeps pace with the business.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {valueProps.map(({ title, description, icon: Icon }) => (
                <div key={title} className="rounded-2xl border border-white bg-white p-5 shadow-sm">
                  <Icon className="h-8 w-8 text-blue-600" />
                  <h3 className="mt-3 text-base font-semibold text-gray-900">{title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8 text-gray-700">
            <h3 className="text-xl font-semibold text-gray-900">Managed care plans</h3>
            <p className="mt-3 text-sm">
              Keep teams productive with monthly support bundles that include remote incidents, onsite visits, asset tracking, and quarterly strategy reviews.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-600" />
                <span>Essential Care from Rs. 4,999 per month</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-600" />
                <span>Growth Team for distributed teams up to ten members</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-600" />
                <span>Managed Desk with SLA backed response targets</span>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/pricing#care-plans"
                className="inline-flex items-center justify-center rounded-full border border-blue-600 px-6 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                Compare care plans
              </Link>
              <Link
                href="/contact?topic=care-plan"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Schedule a call
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-20">
        <div className="layout-container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Clients say it best</h2>
            <p className="mt-4 text-lg text-gray-600">Remote sessions, repairs, and product builds all come with the same focus on clarity, speed, and care.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map(({ quote, name, role }) => (
              <div key={name} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                <p className="text-sm text-gray-700">{quote}</p>
                <p className="mt-6 text-base font-semibold text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-20">
        <div className="layout-container grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Questions before you book?</h2>
            <p className="mt-4 text-lg text-gray-600">
              We are happy to prepare a personalised plan that spells out scope, timelines, and billing cadence. Start with a short discovery call or send a quick brief.
            </p>
            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Need something custom?</p>
              <p className="mt-2">Book a fifteen minute discovery call and receive a tailored quote within one business day.</p>
            </div>
          </div>
          <div className="space-y-6">
            {faqs.map(({ question, answer }) => (
              <div key={question} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
                <p className="mt-3 text-sm text-gray-700">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-blue-600 py-16 text-white">
        <div className="layout-container grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold">Ready to get your technology humming?</h2>
            <p className="mt-4 text-lg text-blue-100">
              Share your challenges or upcoming projects and we will confirm pricing, availability, and next steps within the business day.
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
                Talk to our team
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-blue-400 bg-blue-500/60 p-8 text-blue-50">
            <h3 className="text-xl font-semibold text-white">When you reach out</h3>
            <ul className="mt-5 space-y-4">
              <li className="flex gap-3">
                <CheckIcon className="h-5 w-5 flex-none text-white" />
                <span>Receive a same day response with timelines and next steps.</span>
              </li>
              <li className="flex gap-3">
                <CheckIcon className="h-5 w-5 flex-none text-white" />
                <span>Get digital paperwork, GST invoice, and secure payment links.</span>
              </li>
              <li className="flex gap-3">
                <CheckIcon className="h-5 w-5 flex-none text-white" />
                <span>Work with one coordinator through delivery and aftercare.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

