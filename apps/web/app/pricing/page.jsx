import Link from "next/link";
import Image from "next/image";
import { CheckIcon, ShieldCheckIcon, ComputerIcon, BriefcaseIcon, GlobeIcon } from "../components/Icons";

export default function PricingPage() {
  return (
    <>
      {/* Hero Section - Styled like services page */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Transparent, Honest Pricing</h1>
              <p className="text-lg text-gray-600 mb-8">No hidden fees, no surprises. Our straightforward pricing ensures you know exactly what you'll pay before we start working on your technology needs.</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Link className="px-6 py-3 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 transition-colors" href="/book-service">Book a Service</Link>
                <Link className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center" href="/contact">
                  Get a Custom Quote
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {['Upfront Pricing','7-Day Guarantee','Money-Back Promise'].map(t => (
                  <span key={t} className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium inline-flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-blue-600"/>{t}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/images/services-hero.png" 
                  alt="IT services pricing" 
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 rounded-full w-20 h-20 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold">Best</div>
                  <div className="text-xs">Value</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Navigation - Enhanced styling */}
      <section className="w-full bg-gray-50 py-8 border-t border-b border-gray-200">
        <div className="layout-container">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="#remote-support" 
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <ComputerIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Remote Support</h3>
              <p className="text-gray-600 text-center mb-2">Fix issues from anywhere</p>
              <p className="font-semibold text-blue-600">{'\u20B9'}1,499+</p>
            </Link>

            <Link 
              href="#onsite-support" 
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <BriefcaseIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Onsite Service</h3>
              <p className="text-gray-600 text-center mb-2">In-person technical support</p>
              <p className="font-semibold text-blue-600">{'\u20B9'}1,200+</p>
            </Link>

            <Link 
              href="#web-development" 
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <GlobeIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Web Development</h3>
              <p className="text-gray-600 text-center mb-2">Professional websites & apps</p>
              <p className="font-semibold text-blue-600">Custom Quote</p>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Remote Support Pricing */}
      <section id="remote-support" className="w-full bg-white py-16">
        <div className="layout-container">
          <div className="flex items-start gap-3 mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
              <ComputerIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Remote Computer Support</h2>
              <p className="text-gray-600">Get your computer fixed from anywhere in India with secure remote access. Our technicians can diagnose and resolve most software issues without requiring an in-person visit.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name:'Quick Fix', 
                price:'\u20B9' + '1,499', 
                desc:'Perfect for simple issues', 
                items:['Up to 1 hour remote session','Basic virus/malware removal','Simple software installation','Performance tune-up','Email & browser setup','7-day guarantee']
              },
              {
                name:'Complete Solution', 
                price:'\u20B9' + '1,999', 
                desc:'For complex problems', 
                featured:true, 
                items:['Up to 2 hours remote session','Deep malware scanning & removal','Registry optimization','Multiple software installs','System backup setup','Network troubleshooting','Follow-up support call']
              },
              {
                name:'Emergency Support', 
                price:'\u20B9' + '2,999', 
                desc:'Urgent same-day service', 
                items:['Priority support within 2 hours','Weekend & holiday availability','Extended 3-hour session limit','Direct technician phone line']
              },
            ].map(card => (
              <div key={card.name} className={`relative rounded-xl border ${card.featured ? 'border-blue-600' : 'border-gray-200'} bg-white p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full`}>
                {card.featured && <div className="absolute -top-3 right-5 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">Most Popular</div>}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{card.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">{card.price}</div>
                  <p className="text-gray-600">{card.desc}</p>
                </div>
                
                <div className="flex-grow mb-6">
                  <ul className="space-y-3">
                    {card.items.map(i => (
                      <li key={i} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"/>
                        <span className="text-gray-700">{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto">
                  <Link 
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full" 
                    href={`/book-service?type=remote&package=${encodeURIComponent(card.name.toLowerCase().replace(/\s+/g,'-'))}`}
                  >
                    Choose {card.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onsite Support - Enhanced styling with fixed alignment */}
      <section id="onsite-support" className="w-full bg-gray-50 py-16">
        <div className="layout-container">
          {/* Section Title with Icon */}
          <div className="flex items-start gap-3 mb-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
              <BriefcaseIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Onsite Support (Bangalore)</h2>
              <p className="text-gray-600">Professional technician visits your location for hardware and complex issues that can't be resolved remotely. We cover all areas within Bangalore.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* First Card - Consultation & Diagnosis */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md h-full flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Consultation & Diagnosis</h3>
              <div className="mb-4">
                <p className="text-3xl font-bold text-blue-600 mb-2">{'\u20B9'}1,200</p>
                <p className="text-gray-700">Covers technician visit, complete diagnosis, and basic configuration.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 flex-grow">
                <h4 className="font-medium text-gray-900 mb-2">What's Included:</h4>
                <ul className="space-y-2">
                  {["Professional technician visit","Hardware & software diagnosis","Detailed problem report","Repair cost estimate","Basic configuration","Up to 1 hour onsite"].map(i => (
                    <li key={i} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"/>
                      <span className="text-gray-700">{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-auto">
                <Link className="inline-flex items-center justify-center px-5 py-2 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors" href="/book-service?type=onsite">
                  Schedule Onsite Visit
                </Link>
                <Link className="inline-flex items-center justify-center px-5 py-2 text-base font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors" href="/contact">
                  Ask Questions First
                </Link>
              </div>
            </div>
            
            {/* Second Card - Additional Services */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Services (If Needed)</h3>
                
                <div className="space-y-3">
                  {[
                    { name: "Extended labor", price: "₹800/hour" },
                    { name: "Data recovery", price: "₹1,500 - ₹5,000" },
                    { name: "Network setup", price: "₹2,500 - ₹4,500" },
                    { name: "Hardware installation", price: "₹500 - ₹1,500" }
                  ].map((service, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0"/>
                        <span className="text-gray-700">{service.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{service.price}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-gray-700">All additional work approved by you before proceeding. Parts charged separately at cost with no markup.</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Areas</h3>
                <p className="text-gray-700 mb-3">We provide onsite service throughout Bangalore including Whitefield, Electronic City, Koramangala, HSR Layout, Indiranagar, and surrounding areas.</p>
                <p className="text-gray-700">
                  <span className="font-semibold">Response time:</span> Same day for emergencies, or schedule at your convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Web Development - Enhanced styling */}
      <section id="web-development" className="w-full bg-white py-16">
        <div className="layout-container">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600">
              <GlobeIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Web Development for Small Business</h2>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-10">Professional websites and web applications to grow your business online. Our transparent pricing ensures you know exactly what you're getting for your investment.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Business Website',
                image: '/images/business-website.png',
                from: 'Starting from',
                price: '₹25,000',
                items: ['5–10 pages','Responsive design','SEO optimization','Contact forms & Maps','1 year hosting','3 months support']
              },
              {
                name: 'E-commerce Store',
                image: '/images/ecommerce-store.png',
                from: 'Starting from',
                price: '₹45,000',
                items: ['Product catalog','Secure payments','Order management','Mobile friendly','SEO setup','Training included']
              },
              {
                name: 'Custom Web App',
                image: '/images/web-application.png',
                from: 'Starting from',
                price: '₹95,000',
                items: ['Tailored features','Auth & roles','API integrations','Scalable architecture','Analytics','Documentation']
              }
            ].map((pkg, idx) => (
              <div key={pkg.name} className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <Image 
                    src={pkg.image}
                    alt={pkg.name} 
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                  <div className="text-gray-600 text-sm mb-1">{pkg.from}</div>
                  <div className="text-2xl font-bold text-blue-600 mb-4">{pkg.price}</div>
                  
                  <ul className="mb-6 space-y-2">
                    {pkg.items.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"/>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between">
                    <Link 
                      className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full" 
                      href={`/contact?service=${encodeURIComponent(pkg.name.toLowerCase().replace(/\s+/g,'-'))}`}
                    >
                      Get Custom Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-200 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Every Web Project Includes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Detailed project proposal",
                "Transparent milestone pricing",
                "Regular progress updates",
                "Quality assurance testing",
                "Content management system",
                "Mobile responsive design",
                "Performance optimization",
                "Training session for your team"
              ].map(benefit => (
                <div key={benefit} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"/>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full bg-blue-600 py-16 text-white">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
              <p className="text-xl opacity-90 mb-8">Not sure which service is right for you? Contact us for a free consultation. We'll help you find the perfect solution at the right price for your needs.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/book-service" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md bg-white text-blue-600 hover:bg-gray-100 transition-colors">
                  Book a Service
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md border-2 border-white text-white hover:bg-blue-700 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500 p-6 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="font-medium">100% Satisfaction</p>
                  <p className="text-sm opacity-80">Guaranteed or money back</p>
                </div>
                
                <div className="bg-blue-500 p-6 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium">24/7 Support</p>
                  <p className="text-sm opacity-80">Available for emergencies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


