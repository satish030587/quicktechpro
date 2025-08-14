import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          {/* Main CTA */}
          <h2 className="text-4xl font-bold sm:text-5xl lg:text-6xl mb-6">
            Ready to Solve Your Tech Problems?
          </h2>
          <p className="text-xl lg:text-2xl mb-12 max-w-4xl mx-auto opacity-90">
            Join thousands of satisfied customers who chose QuickTechPro for reliable, 
            professional, and affordable tech solutions. Get started with a free consultation today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Get Free Consultation Now
            </Link>
            <Link
              href="tel:+91-XXXX-XXXXXX"
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-xl transition-all duration-200"
            >
              Call Emergency Support
            </Link>
          </div>

          {/* Contact methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-4">📞</div>
              <h3 className="text-lg font-semibold mb-2">Call Us Directly</h3>
              <p className="text-blue-100 mb-3">Speak with our experts immediately</p>
              <p className="font-bold">+91-XXXX-XXXXXX</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">WhatsApp Support</h3>
              <p className="text-blue-100 mb-3">Quick responses on WhatsApp</p>
              <p className="font-bold">+91-XXXX-XXXXXX</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-4">✉️</div>
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-blue-100 mb-3">Detailed support via email</p>
              <p className="font-bold">contact@quicktechpro.in</p>
            </div>
          </div>

          {/* Service highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-blue-100 text-sm">Emergency Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">100%</div>
              <div className="text-blue-100 text-sm">Remote Service</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">500+</div>
              <div className="text-blue-100 text-sm">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">5⭐</div>
              <div className="text-blue-100 text-sm">Average Rating</div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
              ✅ Money-Back Guarantee
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
              🔒 Secure & Encrypted
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
              💯 Transparent Pricing
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
              🚀 Fast Response Time
            </div>
          </div>
        </div>
      </div>

      {/* Emergency support banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-center">
            <div className="flex items-center">
              <div className="animate-pulse mr-3">
                <div className="h-3 w-3 bg-white rounded-full"></div>
              </div>
              <span className="font-semibold">
                🚨 EMERGENCY COMPUTER ISSUES? Get immediate help - Call now!
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
