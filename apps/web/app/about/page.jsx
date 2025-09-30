import Link from "next/link";
import Image from "next/image";
import {
  BriefcaseIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  ComputerIcon,
  GlobeIcon,
  ShieldCheckIcon,
} from "../components/Icons";

const heroStats = [
  { value: "1,200+", label: "Remote and onsite sessions delivered" },
  { value: "65+", label: "Active business clients across India" },
  { value: "90 days", label: "Repair workmanship warranty" },
  { value: "35 mins", label: "Average first response time" },
];

const servicePillars = [
  {
    title: "Remote Tech Support",
    description: "Certified specialists resolve performance, connectivity, and security issues in a single secure session.",
    href: "/services#remote-support",
    cta: "Explore remote support",
    icon: ComputerIcon,
  },
  {
    title: "Ship-in Laptop Repairs",
    description: "Diagnostics-first repairs with OEM grade parts, status updates, and a documented quality report.",
    href: "/services#ship-in-repairs",
    cta: "Explore repairs",
    icon: BriefcaseIcon,
  },
  {
    title: "Small Business Web Apps",
    description: "Discovery led delivery that turns operations into intuitive booking, inventory, and client portals.",
    href: "/services#web-apps",
    cta: "Explore web apps",
    icon: GlobeIcon,
  },
  {
    title: "Certified Used Laptops",
    description: "Enterprise refresh devices rebuilt with fresh OS images, stress tests, and documented grading.",
    href: "/services#used-laptops",
    cta: "Explore devices",
    icon: ShieldCheckIcon,
  },
];

const commitments = [
  "Clear scope, deliverables, and pricing before work begins",
  "Enterprise grade security for every remote and onsite engagement",
  "Warranty backed repairs with detailed diagnostics and aftercare",
  "Dedicated coordinator who stays with you through completion",
];

const values = [
  {
    title: "Accountable expertise",
    description: "CompTIA and vendor certified engineers who document every action for traceability.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Communication first",
    description: "You receive progress checkpoints, shared workspaces, and crystal clear next steps.",
    icon: GlobeIcon,
  },
  {
    title: "Continuous improvement",
    description: "We audit outcomes, gather feedback, and fold lessons into future playbooks for your team.",
    icon: ClockIcon,
  },
];

const processSteps = [
  {
    title: "Discover and prioritise",
    copy: "We listen to the challenge, gather context, and capture success metrics for your devices or project.",
  },
  {
    title: "Plan and approve",
    copy: "Detailed scope, effort, and cost are shared upfront so you can approve with full confidence.",
  },
  {
    title: "Deliver and document",
    copy: "Work is executed by specialists with secure tools, live updates, and in depth service notes.",
  },
  {
    title: "Support and optimise",
    copy: "Post delivery follow ups, warranty support, and optimisation sprints keep everything running smooth.",
  },
];

const timeline = [
  {
    year: "2010",
    title: "QuickTech Pro launches",
    description: "Started as a neighbourhood repair desk focused on honest pricing and fast turnaround for laptops and desktops.",
  },
  {
    year: "2014",
    title: "Remote support desk opens",
    description: "Introduced secure remote sessions so customers could resolve urgent issues without travel delays.",
  },
  {
    year: "2018",
    title: "Ship-in lab upgrades",
    description: "Built an ESD safe facility for board level repairs, data recovery, and enterprise refurbishment projects.",
  },
  {
    year: "2021",
    title: "Digital solutions team",
    description: "Expanded with full stack developers and designers delivering small business web applications on fixed quotes.",
  },
  {
    year: "2023",
    title: "Managed care and hardware",
    description: "Launched monthly care plans and certified used laptop sourcing to support distributed teams end to end.",
  },
];

const leadership = [
  {
    name: "Rohan Desai",
    role: "Founder and Lead Technician",
    bio: "Oversees the repair lab and support desk with a focus on diagnostics discipline, quality control, and customer success.",
  },
  {
    name: "Nisha Kapoor",
    role: "Director of Digital Solutions",
    bio: "Leads discovery workshops and product delivery, ensuring every web build aligns with measurable business outcomes.",
  },
];

const certifications = [
  "CompTIA A+ and Network+ certified technicians",
  "Microsoft 365 and Azure administrators on staff",
  "Google Workspace deployment specialists",
  "ITIL aligned service documentation and workflows",
  "Partner network for OEM grade components and logistics",
];

export default function AboutPage() {
  return (
    <main>
      <section className="w-full bg-white py-16 md:py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-blue-700">
                About QuickTech Pro
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                The people behind dependable tech support
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                QuickTech Pro blends certified technicians, web engineers, and hardware specialists under one roof so homes and businesses in Bangalore can rely on one trusted partner for every technology moment.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-blue-700"
                >
                  Talk with our team
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-full border border-blue-600 px-8 py-3 text-base font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                >
                  View services
                </Link>
              </div>
              <dl className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
                {heroStats.map(({ value, label }) => (
                  <div key={label} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                    <dt className="text-sm uppercase tracking-wide text-gray-500">{label}</dt>
                    <dd className="mt-2 text-2xl font-bold text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <Image
                  src="/images/about-us.jpg"
                  alt="QuickTech Pro team collaborating"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-8 -right-6 rounded-2xl bg-blue-600 p-5 text-white shadow-xl">
                <p className="text-sm uppercase tracking-wide text-blue-100">Founded</p>
                <p className="text-3xl font-bold">2010</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full border-y border-gray-200 bg-gray-50 py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our mission and promise</h2>
              <p className="mt-4 text-lg text-gray-600">
                Technology should just work. We are here to make that a reality through transparent communication, security minded practices, and measurable outcomes that keep your day productive.
              </p>
              <ul className="mt-6 space-y-3">
                {commitments.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckIcon className="mt-1 h-5 w-5 flex-none text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {values.map(({ title, description, icon: Icon }) => (
                <div key={title} className="rounded-2xl border border-white bg-white p-6 shadow-sm">
                  <Icon className="h-8 w-8 text-blue-600" />
                  <h3 className="mt-3 text-base font-semibold text-gray-900">{title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-20">
        <div className="layout-container">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900">Service pillars that power our clients</h2>
            <p className="mt-4 text-lg text-gray-600">
              Every engagement is anchored in the same proven practice areas that appear across our home, services, and pricing pages.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {servicePillars.map(({ title, description, href, cta, icon: Icon }) => (
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
                <span className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600">
                  {cta}
                  <ChevronRightIcon className="ml-1.5 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">How we work with you</h2>
              <p className="mt-4 text-lg text-gray-600">
                Whether it is a same day remote session or a multi week web project, the process stays predictable and fully transparent.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {processSteps.map((step, index) => (
                  <div key={step.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{step.copy}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8 text-gray-700">
              <h3 className="text-xl font-semibold text-gray-900">What you can expect</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-600" />
                  <span>Digital paperwork with GST invoices, service notes, and next step recommendations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-600" />
                  <span>Secure tooling with consent based access for every remote interaction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-600" />
                  <span>Aftercare window that keeps your team covered once work is delivered.</span>
                </li>
              </ul>
              <div className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-600">
                Managed care plans start at Rs. 4,999 per month
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-20">
        <div className="layout-container">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900">Milestones that shaped our team</h2>
            <p className="mt-4 text-lg text-gray-600">
              Growth has been driven by listening to clients and investing in the infrastructure, people, and processes that keep technology running.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {timeline.map(({ year, title, description }) => (
              <div key={year} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{year}</p>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Leadership and coordination</h2>
              <p className="mt-4 text-lg text-gray-600">
                A dedicated leadership pod keeps operations responsive while client coordinators ensure every engagement feels personal and accountable.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {leadership.map(({ name, role, bio }) => (
                  <div key={name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{role}</p>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">{name}</h3>
                    <p className="mt-3 text-sm text-gray-600">{bio}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Certifications and tooling</h3>
              <p className="mt-3 text-sm text-gray-600">
                Our technicians maintain active certifications and partnerships so your devices and apps benefit from current best practices.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-gray-700">
                {certifications.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon className="mt-1 h-4 w-4 flex-none text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl bg-blue-50 p-5 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Partner ecosystem</p>
                <p className="mt-2">We coordinate logistics with trusted couriers, component suppliers, and cloud providers to keep every promise we make.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Here for every stage of your technology journey</h2>
              <p className="mt-4 text-lg text-gray-600">
                From the first ticket to long term managed support, QuickTech Pro is structured to scale with you. Tell us what you are working on and we will design a plan that fits.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/book-service"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-base font-semibold text-white hover:bg-blue-700"
                >
                  Book a service
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3 text-base font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600"
                >
                  Review pricing
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-blue-400 bg-blue-500/60 p-8 text-blue-50">
              <h3 className="text-xl font-semibold text-white">When you reach out</h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <CheckIcon className="h-5 w-5 flex-none text-white" />
                  <span>Same day acknowledgement with timeline and resource assignment.</span>
                </li>
                <li className="flex gap-3">
                  <CheckIcon className="h-5 w-5 flex-none text-white" />
                  <span>Transparent quote that matches the pricing guidance published on our site.</span>
                </li>
                <li className="flex gap-3">
                  <CheckIcon className="h-5 w-5 flex-none text-white" />
                  <span>Documented aftercare window with direct access to your coordinator.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


