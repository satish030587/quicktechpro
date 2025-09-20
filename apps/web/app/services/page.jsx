import Link from "next/link";
import Image from "next/image";
import { BriefcaseIcon, CheckIcon, ComputerIcon, GlobeIcon, ShieldCheckIcon, ClockIcon } from "../components/Icons";

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section - Styled like home page */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Professional IT Services & Solutions</h1>
              <p className="text-lg text-gray-600 mb-8">From quick computer fixes to complete web development projects — transparent, expert technology solutions for individuals and small businesses in Bangalore.</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Link className="px-6 py-3 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 transition-colors" href="/book-service">Book Now</Link>
                <Link className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center" href="/contact">
                  Contact Us
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium">500+ Computers Repaired</span>
                <span className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium">50+ Business Clients</span>
                <span className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium">98% First-Time Fix Rate</span>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/images/services-hero.jpg" 
                  alt="IT services professional helping a client" 
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 rounded-full w-20 h-20 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold">24/7</div>
                  <div className="text-xs">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Navigation - Enhanced styling */}
      <section className="w-full bg-gray-50 py-8 border-t border-b border-gray-200">
        <div className="layout-container">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="#remote-support" 
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <ComputerIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Remote Support</h3>
              <p className="text-gray-600 text-center mb-2">Instant technical help from anywhere</p>
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
              <p className="text-gray-600 text-center mb-2">Hands-on technical support at your location</p>
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
              <p className="text-gray-600 text-center mb-2">Custom websites and web applications</p>
              <p className="font-semibold text-blue-600">Custom Quote</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Remote Support - Professional styling */}
      <section id="remote-support" className="w-full bg-white py-16">
        <div className="layout-container">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-4">
              <ComputerIcon className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Remote Computer Support</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Instant help for most computer issues via secure remote access. Watch us work in real time and ask questions as we solve your technical problems.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                <div className="relative">
                  <Image 
                    src="/images/remote-support.jpg" 
                    alt="Remote IT support" 
                    width={800}
                    height={450}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">Fast, Secure Solutions</h3>
                      <p className="text-white/90">Our technicians can fix most software issues remotely</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                      <ShieldCheckIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Secure Connection</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                      <ClockIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Same-Day Service</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Fix Remotely</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[
                      "Virus & malware removal",
                      "Performance optimization",
                      "Software installs & updates",
                      "Email & browser setup",
                      "Driver updates",
                      "Windows/Mac troubleshooting",
                      "Printer & device configuration",
                      "Data recovery & backup"
                    ].map(i => (
                      <div key={i} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"/>
                        <p className="text-gray-700">{i}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center">
                    <Link className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors" href="/book-service?type=remote">
                      Book Remote Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden mb-6">
                <div className="bg-blue-600 text-white p-5">
                  <h3 className="text-xl font-semibold">Remote Support Pricing</h3>
                  <p className="text-blue-100 text-sm">Transparent pricing with no hidden fees</p>
                </div>
                
                <div className="p-5">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Quick Fix</h4>
                        <p className="text-sm text-gray-600">Single issue, up to 1 hour</p>
                      </div>
                      <p className="text-xl font-bold text-blue-600">{'\u20B9'}1,499</p>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Standard Support</h4>
                        <p className="text-sm text-gray-600">Complex issues, up to 2 hours</p>
                      </div>
                      <p className="text-xl font-bold text-blue-600">{'\u20B9'}1,999</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">System Overhaul</h4>
                        <p className="text-sm text-gray-600">Complete system tune-up</p>
                      </div>
                      <p className="text-xl font-bold text-blue-600">{'\u20B9'}2,999</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                    <p className="font-medium mb-2">What's included:</p>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <CheckIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0"/>
                        <span>Secure remote connection</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0"/>
                        <span>Expert technician support</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0"/>
                        <span>100% satisfaction guarantee</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0"/>
                        <span>Follow-up support for 7 days</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How Remote Support Works</h3>
                  
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">1</div>
                      <div>
                        <p className="text-gray-700">Book an appointment online or call us</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">2</div>
                      <div>
                        <p className="text-gray-700">We'll guide you to install our secure remote access tool</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">3</div>
                      <div>
                        <p className="text-gray-700">Watch as our technicians diagnose and fix your issue</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">4</div>
                      <div>
                        <p className="text-gray-700">Payment only after successful resolution</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onsite Support - Professional styling */}
      <section id="onsite-support" className="w-full bg-gray-50 py-16">
        <div className="layout-container">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-4">
              <BriefcaseIcon className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Onsite IT Support (Bangalore)</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Professional technicians come to your home or business for hands-on hardware repair, network setup, and comprehensive IT consultation.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden mb-6">
                <div className="bg-blue-600 text-white p-5">
                  <h3 className="text-xl font-semibold">Onsite Service Pricing</h3>
                  <p className="text-blue-100 text-sm">Transparent pricing with no hidden fees</p>
                </div>
                
                <div className="p-5">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Diagnostic Visit</h4>
                        <p className="text-sm text-gray-600">Assessment & quick fixes</p>
                      </div>
                      <p className="text-xl font-bold text-blue-600">{'\u20B9'}1,200</p>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Hardware Repair</h4>
                        <p className="text-sm text-gray-600">Parts & labor</p>
                      </div>
                      <p className="text-sm font-medium text-gray-700">Custom Quote</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">Business IT Setup</h4>
                        <p className="text-sm text-gray-600">Network & multiple devices</p>
                      </div>
                      <p className="text-sm font-medium text-gray-700">Custom Quote</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                    <p className="font-medium mb-2">Service Areas:</p>
                    <p className="mb-2">We provide onsite service throughout Bangalore including:</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <span className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-blue-600 mr-1"/>
                        Whitefield
                      </span>
                      <span className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-blue-600 mr-1"/>
                        Electronic City
                      </span>
                      <span className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-blue-600 mr-1"/>
                        Koramangala
                      </span>
                      <span className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-blue-600 mr-1"/>
                        HSR Layout
                      </span>
                      <span className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-blue-600 mr-1"/>
                        Indiranagar
                      </span>
                      <span className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-blue-600 mr-1"/>
                        Surrounding areas
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Choose Onsite Support</h3>
                  
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-gray-700">Hardware issues that can't be fixed remotely</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-gray-700">Network setup and troubleshooting</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-gray-700">Multiple device configurations</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-gray-700">Business IT infrastructure assessment</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="mt-6">
                    <Link className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors" href="/book-service?type=onsite">
                      Schedule Onsite Visit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                <div className="relative">
                  <Image 
                    src="/images/onsite-support.jpg" 
                    alt="Onsite IT support" 
                    width={800}
                    height={450}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">Expert Hands-On Service</h3>
                      <p className="text-white/90">Our technicians come directly to your location</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                      <ShieldCheckIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Experienced Technicians</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                      <ClockIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Same-Day Emergency Service</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Onsite Services We Provide</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[
                      "Hardware diagnosis & repair",
                      "Network setup & configuration",
                      "Business IT consultation",
                      "Data recovery & transfer",
                      "Computer setup & optimization",
                      "Security assessment",
                      "Printer & peripheral setup",
                      "Custom business IT solutions"
                    ].map(i => (
                      <div key={i} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"/>
                        <p className="text-gray-700">{i}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-3">Our Process</h4>
                    
                    <ol className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-medium text-xs mr-3 mt-0.5">1</div>
                        <p className="text-gray-700"><span className="font-medium">Book an appointment</span> at your preferred date and time</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-medium text-xs mr-3 mt-0.5">2</div>
                        <p className="text-gray-700"><span className="font-medium">Our technician arrives</span> at your location with the necessary tools</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-medium text-xs mr-3 mt-0.5">3</div>
                        <p className="text-gray-700"><span className="font-medium">Diagnosis and assessment</span> of your IT issues and needs</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-medium text-xs mr-3 mt-0.5">4</div>
                        <p className="text-gray-700"><span className="font-medium">Clear explanation</span> of the problem and recommended solutions</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-medium text-xs mr-3 mt-0.5">5</div>
                        <p className="text-gray-700"><span className="font-medium">Implementation of solutions</span> with your approval</p>
                      </li>
                    </ol>
                  </div>
                </div>
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
          
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-10">We build modern, mobile-friendly websites and web applications that look great, perform well, and help grow your business online. All projects include responsive design and SEO best practices.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Business Websites",
                image: "/images/business-website.png",
                features: ["Responsive design", "Fast performance", "SEO setup", "Analytics & forms", "Content management", "Social media integration"],
                pricing: "Starting at ₹30,000"
              },
              {
                title: "E-commerce Stores",
                image: "/images/ecommerce-store.png", 
                features: ["Product management", "Secure payments", "Inventory tracking", "Order management", "Customer accounts", "Mobile shopping"],
                pricing: "Starting at ₹60,000"
              },
              {
                title: "Web Applications",
                image: "/images/web-application.png",
                features: ["Custom functionality", "User authentication", "Database integration", "API development", "Cloud hosting", "Ongoing support"],
                pricing: "Custom quote"
              }
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <Image 
                    src={card.image} 
                    alt={card.title} 
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <ul className="mb-6 space-y-2">
                    {card.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"/>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{card.pricing}</span>
                    <Link className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors" href="/contact">
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full bg-blue-600 py-16 text-white">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl opacity-90 mb-8">Contact us today for expert IT support and web development services. Our team is ready to help you with fast, reliable solutions tailored to your needs.</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm opacity-80">+91 80-4123-7890</p>
                </div>
                
                <div className="bg-blue-500 p-6 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm opacity-80">support@quicktechpro.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}




