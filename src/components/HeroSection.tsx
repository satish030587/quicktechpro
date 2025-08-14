'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-28 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10 mb-8">
            <span>🚀 Trusted by 500+ clients worldwide</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Complete Tech Solutions
          </h1>
          <div className="mt-6 text-2xl font-semibold text-blue-600 sm:text-3xl lg:text-4xl">
            Remote Computer Repair, Professional Website Design & Custom Web Applications
          </div>
          
          {/* Description */}
          <p className="mt-8 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            QuickTechPro delivers comprehensive tech solutions with transparent pricing and 24/7 support. 
            Based in India, serving globally through secure remote services. No on-site visits required.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Free Consultation
            </Link>
            <Link
              href="#services"
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-8 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              View Our Services
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-600">Remote</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600">5⭐</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>

          {/* Emergency support banner */}
          <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                  <span className="text-green-600 font-bold">!</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">
                  Emergency Computer Issues?
                </h3>
                <p className="text-green-700">
                  Get immediate help with our 24/7 emergency support service
                </p>
              </div>
              <div className="ml-6">
                <Link
                  href="/contact"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Get Help Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
