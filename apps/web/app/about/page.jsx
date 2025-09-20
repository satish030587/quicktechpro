import Link from "next/link";
import Image from "next/image";
import { CheckIcon, ShieldCheckIcon, GlobeIcon, ClockIcon, BriefcaseIcon } from "../components/Icons";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section - Styled like other pages */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">About QuickTechPro</h1>
              <p className="text-lg text-gray-600 mb-8">Your trusted partner for reliable computer repair, IT support, and web development services in Bangalore. We bring enterprise-level expertise with personalized service for individuals and small businesses.</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Link className="px-6 py-3 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 transition-colors" href="/contact">Contact Us</Link>
                <Link className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center" href="/services">
                  Our Services
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium">15+ Years Experience</span>
                <span className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium">500+ Repairs</span>
                <span className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium">50+ Business Clients</span>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/images/people-with-laptops-office.jpg" 
                  alt="QuickTechPro team" 
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 rounded-full w-20 h-20 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold">Since</div>
                  <div className="text-xs">2010</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story - Enhanced styling */}
      <section className="w-full bg-gray-50 py-16 px-6 border-t border-b border-gray-200">
        <div className="layout-container">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600">
              <ClockIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-600 mb-8">
              Founded with a simple mission: to make technology work seamlessly for individuals and small businesses—without the complexity, high costs, or long wait times of traditional IT services.
            </p>
            
            <p className="text-lg text-gray-600">
              Since 2010, we've grown from a small repair shop to a trusted IT partner for hundreds of clients across Bangalore. We bring enterprise-level expertise with personalized service, from quick remote fixes to comprehensive web development solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">How We Started</h3>
              <p className="text-gray-600">Began as a small computer repair service for friends and family, quickly growing through word-of-mouth referrals.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Our Evolution</h3>
              <p className="text-gray-600">Expanded into professional IT services and web development to meet our clients' growing digital needs.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Where We Are Today</h3>
              <p className="text-gray-600">Now a full-service IT provider with a team of skilled technicians and developers serving businesses across Bangalore.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values - Enhanced styling */}
      <section className="w-full bg-white py-16 px-6">
        <div className="layout-container">
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto mb-12">
            Our commitment to excellence and customer satisfaction drives everything we do at QuickTechPro. These are the core principles that guide our work.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600">Provide fast, transparent, and reliable IT solutions so you can focus on what you do best. We're committed to resolving your tech problems quickly and effectively.</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-blue-600 font-medium">"Technology made simple for you"</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <GlobeIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600">Be Bangalore's most trusted IT partner, known for expertise, honesty, and commitment. We aim to set the standard for customer service in the tech industry.</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-blue-600 font-medium">"Building lasting technology partnerships"</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <CheckIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Values</h3>
              <ul className="space-y-2 text-gray-600">
                {[
                  "Transparency in pricing and process",
                  "Excellence in technical expertise",
                  "Customer success above all",
                  "Continuous learning and improvement",
                  "Honesty and integrity in all interactions",
                  "Respect for your time and resources",
                ].map(v => (
                  <li key={v} className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0"/>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Enhanced styling */}
      <section className="w-full bg-gray-50 py-16 px-6">
        <div className="layout-container">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600">
              <BriefcaseIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Experience & Credentials</h2>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Our team brings years of experience and a proven track record of success across various IT domains.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                key: "15+",
                value: "Years Combined Experience",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                key: "500+",
                value: "Computers Repaired",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                key: "50+",
                value: "Business Clients",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              {
                key: "25+",
                value: "Websites Developed",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                )
              }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-md p-6 flex flex-col items-center text-center">
                <div className="text-blue-600 mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.key}</div>
                <div className="text-gray-600">{stat.value}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600">
              Our technicians hold certifications from Microsoft, CompTIA, Cisco, and other industry leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced styling */}
      <section className="w-full bg-white py-16 px-6">
        <div className="layout-container">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            What sets QuickTechPro apart is our commitment to providing reliable, transparent, and client-focused technology services.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparent Pricing",
                description: "No hidden fees or surprise charges. We provide detailed quotes before any work begins and stick to our agreements.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Fast Response Times",
                description: "We understand that IT issues can cripple your productivity. Our technicians respond quickly to minimize your downtime.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                title: "Satisfaction Guarantee",
                description: "If you're not happy with our service, we'll make it right. Your complete satisfaction is our highest priority.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )
              },
              {
                title: "Small Business Focus",
                description: "We specialize in serving small businesses and individuals, offering personalized service tailored to your needs.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              {
                title: "Clear Communication",
                description: "We explain technical issues in plain language, keeping you informed throughout the entire process.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                )
              },
              {
                title: "Ongoing Support",
                description: "Our relationship doesn't end when the immediate problem is solved. We provide continuous support for all your IT needs.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-blue-600 py-16 px-6">
        <div className="layout-container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left lg:max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
              <p className="text-lg text-blue-100 mb-0 lg:pr-10">
                Partner with QuickTechPro for all your computer repair, IT support, and web development needs. 
                Experience the difference of working with a team that truly cares about your technology success.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="px-8 py-4 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors">
                Contact Us
              </Link>
              <Link href="/book-service" className="px-8 py-4 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 transition-colors">
                Book a Service
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}




