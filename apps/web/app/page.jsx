"use client";
import Link from "next/link";
import Image from "next/image";
import { CheckCircleIcon, ChevronRightIcon } from './components/Icons';

export default function HomePage() {
  return (
    <main>
      {/* Hero Section with video background */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden -mt-14">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full">
          <div className="layout-container flex h-full flex-col justify-center pt-16 pb-16">
            <div className="space-y-12 text-white text-left w-full">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-base font-medium text-white/90 backdrop-blur">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-base font-medium text-white">IT</span>
                <span>Trusted technicians for small businesses</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">Innovative IT Solutions for Modern Businesses</h1>
              <p className="max-w-2xl text-xl text-white/85 md:text-2xl md:leading-relaxed">Keep your technology running smoothly with certified technicians delivering instant remote support, on-site repairs, and custom web experiences tailored for growing businesses.</p>
              <div className="flex flex-wrap gap-4">
                <Link className="inline-flex items-center justify-center rounded-full bg-blue-500 px-9 py-3.5 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-blue-600" href="/book-service?type=remote">Book appointment</Link>
                <Link className="inline-flex items-center justify-center rounded-full border border-white/60 px-9 py-3.5 text-lg font-semibold text-white transition-colors hover:bg-white/10" href="/contact">
                  Talk to a specialist
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="w-full bg-gray-50 py-12 border-t border-b border-gray-200">
        <div className="layout-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-blue-600 mb-1">500+</h3>
              <p className="text-gray-600 font-medium">Computers Repaired</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-blue-600 mb-1">50+</h3>
              <p className="text-gray-600 font-medium">Business Clients</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-blue-600 mb-1">24/7</h3>
              <p className="text-gray-600 font-medium">Emergency Support</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-blue-600 mb-1">98%</h3>
              <p className="text-gray-600 font-medium">First-Time Fix Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Company Section (Similar to the reference) */}
      <section className="w-full bg-white py-16">
        <div className="layout-container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Our Company</h2>
              <p className="text-gray-600 mb-6">With years of expertise in the technology industry, we specialize in delivering reliable IT solutions, computer repair services, and web development projects that meet the unique needs of small businesses and individuals.</p>
              <p className="text-gray-600 mb-8">Our certified technicians are committed to providing fast, effective solutions with transparent pricing and exceptional customer service.</p>
              <Link href="/about" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src="/images/about-us.jpg"
                  alt="IT professionals at work" 
                  width={600}
                  height={200}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview - Using tabs like reference */}
      <section className="w-full py-16 bg-gray-50">
        <div className="layout-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Services Tailored to You</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">From quick remote fixes to complete business IT solutions - we've got you covered with transparent, upfront pricing.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Remote Support</h3>
              <p className="text-gray-600 mb-5">Instant help for virus removal, system optimization, and software issues. Connect securely.</p>
              <Link href="/services/remote-support" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Onsite Support</h3>
              <p className="text-gray-600 mb-5">Professional technician visits for hardware repairs and network setup in Bangalore.</p>
              <Link href="/services/onsite-support" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Web Development</h3>
              <p className="text-gray-600 mb-5">Custom websites, e-commerce platforms, and web applications for small businesses.</p>
              <Link href="/services/web-development" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Data Recovery</h3>
              <p className="text-gray-600 mb-5">Professional data recovery services for hard drives, SSDs, and other storage devices.</p>
              <Link href="/services/data-recovery" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/services" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section - Similar to reference */}
      <section className="w-full bg-white py-16">
        <div className="layout-container">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Projects</h2>
            <p className="text-lg text-gray-600">Explore our portfolio of successful projects, where innovative design, quality craftsmanship, and exceptional outcomes showcase our capabilities.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Project 1 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="relative h-64">
                <img 
                  src="/images/project1.jpg" 
                  alt="Corporate office network setup" 
                  className="w-full h-full object-cover"
                  
                  />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise Network Solution</h3>
                <p className="text-gray-600 mb-4">A comprehensive network infrastructure implementation for a 100-employee office building with secure remote access capabilities.</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">Whitefield, Bangalore</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">June 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Scope</p>
                    <p className="font-medium">Network Infrastructure</p>
                  </div>
                </div>
                <Link href="/projects/network-solution" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Project 2 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="relative h-64">
                <img 
                  src="/images/project2.jpg" 
                  alt="E-commerce website development" 
                  className="w-full h-full object-cover"
                  
                  />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">E-commerce Platform Launch</h3>
                <p className="text-gray-600 mb-4">A complete e-commerce solution with inventory management, payment processing, and mobile-responsive design for a retail business.</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-medium">Fashion Retailer</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">May 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Scope</p>
                    <p className="font-medium">Web Development</p>
                  </div>
                </div>
                <Link href="/projects/ecommerce-platform" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/projects" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Quality That Speaks Section - Based on reference */}
      <section className="w-full bg-gray-50 py-16">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quality That Speaks for Itself</h2>
              <p className="text-gray-600 mb-8">Our commitment to excellence drives everything we do. We take pride in our work and focus on delivering high-quality results that exceed our customers' expectations.</p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mt-0.5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-900">Excellence in Every Detail</h3>
                    <p className="text-gray-600">We pay attention to every aspect of our work, ensuring comprehensive solutions.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mt-0.5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-900">Trusted Expertise, Proven Results</h3>
                    <p className="text-gray-600">Our certified team brings years of experience to solve your technology challenges.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mt-0.5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-900">Your Vision, Our Commitment</h3>
                    <p className="text-gray-600">We align our services with your specific needs and business objectives.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/about" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/images/quality-service.jpg" 
                  alt="IT professional providing quality service" 
                  className="w-full h-auto object-cover"
                  
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Based on reference */}
      <section className="w-full bg-white py-16">
        <div className="layout-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">We've streamlined our process to make getting IT support as simple as possible. Here's how we make technology work for you.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 relative z-10">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Contact Us</h3>
                <p className="text-gray-600 text-center">Call, WhatsApp, or book online. Describe your issue and choose remote or onsite service.</p>
              </div>
              {/* Connector line - hidden on mobile, visible on larger screens */}
              <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -z-10 transform -translate-x-8"></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 relative z-10">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Upfront Pricing</h3>
                <p className="text-gray-600 text-center">Get clear, honest pricing before we start. No surprises, no hidden fees.</p>
              </div>
              {/* Connector line */}
              <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -z-10 transform -translate-x-8"></div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 relative z-10">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Expert Service</h3>
                <p className="text-gray-600 text-center">Our certified technicians diagnose and fix your issues quickly and efficiently.</p>
              </div>
              {/* Connector line */}
              <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -z-10 transform -translate-x-8"></div>
            </div>
            
            {/* Step 4 */}
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 relative z-10">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Follow-up Support</h3>
                <p className="text-gray-600 text-center">7-day guarantee on all work. Free follow-up if the same issue returns.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/book-service" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Book a Service
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Based on reference */}
      <section className="w-full bg-gray-50 py-16">
        <div className="layout-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Don't just take our word for it - see what our satisfied clients have to say about our services.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="mb-4 text-gray-700 italic">
                "QuickTechPro saved our business when our entire network went down before a major client presentation. Their technician arrived within the hour and had us back online in no time. The follow-up to ensure everything was still working was a nice touch."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                  <img 
                      src="/images/testimonial1.jpg" 
                      alt="Client" 
                      className="w-full h-full object-cover"
                      
                      />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Rajiv Mehta</h4>
                  <p className="text-gray-600 text-sm">Marketing Director, TechVantage Solutions</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="mb-4 text-gray-700 italic">
                "As a small business owner, I appreciate that QuickTechPro explains technical issues in plain language and provides options that fit our budget. They've helped us set up a secure network and maintain our computers for over two years now."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                  <img 
                      src="/images/testimonial2.jpg" 
                      alt="Client" 
                      className="w-full h-full object-cover"
                      
                      />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Priya Sharma</h4>
                  <p className="text-gray-600 text-sm">Owner, Elegant Interiors</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="mb-4 text-gray-700 italic">
                "I've worked with several IT support companies in Bangalore, and QuickTechPro stands out for their responsiveness and knowledge. Their team developed our company website and handles all our IT support needs with professionalism and efficiency."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                  <img 
                      src="/images/testimonial3.jpg" 
                      alt="Client" 
                      className="w-full h-full object-cover"
                      
                      />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Vikram Desai</h4>
                  <p className="text-gray-600 text-sm">CEO, Innovative Solutions Ltd</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/testimonials" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors">
              View All Testimonials
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section - Based on reference */}
      <section className="w-full bg-white py-16">
        <div className="layout-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Find answers to common questions about our services, pricing, and support options.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* FAQ Item 1 */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">What areas of Bangalore do you service?</h3>
              <p className="text-gray-600">We provide IT support services throughout Bangalore, including Whitefield, Electronic City, Koramangala, HSR Layout, Indiranagar, and all surrounding areas. For remote support, we can assist clients anywhere.</p>
            </div>
            
            {/* FAQ Item 2 */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Do you offer emergency IT support?</h3>
              <p className="text-gray-600">Yes, we offer 24/7 emergency IT support for critical situations. Our team aims to respond within 30 minutes for remote support and can provide same-day onsite visits for urgent issues.</p>
            </div>
            
            {/* FAQ Item 3 */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">What are your service rates?</h3>
              <p className="text-gray-600">Our service rates depend on the type of support required. Remote support starts at ₹999, while onsite visits begin at ₹1,499. We provide clear, upfront pricing before starting any work and offer package deals for regular maintenance.</p>
            </div>
            
            {/* FAQ Item 4 */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Do you provide support for both Windows and Mac?</h3>
              <p className="text-gray-600">Yes, our technicians are certified to support both Windows and Mac systems, as well as various Linux distributions. We also support mobile devices, servers, and network equipment from all major manufacturers.</p>
            </div>
            
            {/* FAQ Item 5 */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Can you help with website development?</h3>
              <p className="text-gray-600">Absolutely! We offer comprehensive web development services including responsive website design, e-commerce solutions, content management systems, and ongoing maintenance and support.</p>
            </div>
            
            {/* FAQ Item 6 */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Do you offer service contracts for businesses?</h3>
              <p className="text-gray-600">Yes, we provide flexible IT service contracts for businesses of all sizes. Our managed service plans include regular maintenance, priority support, security monitoring, and proactive issue resolution at a predictable monthly cost.</p>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/faq" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors">
              View All FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Based on reference */}
      <section className="w-full bg-blue-600 py-16 text-white">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Ready to Solve Your IT Challenges?</h2>
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
                
                <div className="bg-blue-500 p-6 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-sm opacity-80">Mon-Sat: 9AM-8PM</p>
                </div>
                
                <div className="bg-blue-500 p-6 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="font-medium">Location</p>
                  <p className="text-sm opacity-80">Whitefield, Bangalore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}





