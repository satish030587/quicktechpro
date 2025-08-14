const benefits = [
  {
    title: '100% Remote Service',
    description: 'No need for on-site visits. We solve your problems remotely, saving you time and ensuring social distancing.',
    icon: '🌐',
    stats: 'Zero physical contact required'
  },
  {
    title: 'Transparent Pricing',
    description: 'No hidden fees or surprise charges. Know exactly what you&apos;ll pay before we start working.',
    icon: '💰',
    stats: 'Fixed pricing for all services'
  },
  {
    title: '24/7 Emergency Support',
    description: 'Critical computer issues can&apos;t wait. Our emergency support team is available round the clock.',
    icon: '🚨',
    stats: 'Average response time: 15 minutes'
  },
  {
    title: 'Expert Technicians',
    description: 'Our certified professionals have years of experience in computer repair and web development.',
    icon: '👨‍💻',
    stats: '5+ years average experience'
  },
  {
    title: 'Secure & Safe',
    description: 'Your data security is our priority. We use encrypted connections and follow strict privacy protocols.',
    icon: '🔒',
    stats: 'SSL encrypted connections'
  },
  {
    title: 'Money-Back Guarantee',
    description: 'Not satisfied with our service? Get your money back within 7 days, no questions asked.',
    icon: '✅',
    stats: '7-day satisfaction guarantee'
  }
];

const processSteps = [
  {
    step: '01',
    title: 'Contact Us',
    description: 'Reach out via phone, email, or our contact form. Describe your tech problem or requirements.'
  },
  {
    step: '02',
    title: 'Free Assessment',
    description: 'We analyze your issue and provide a free quote with transparent pricing and timeline.'
  },
  {
    step: '03',
    title: 'Remote Access',
    description: 'For computer repair, we establish a secure remote connection to your device.'
  },
  {
    step: '04',
    title: 'Problem Resolution',
    description: 'Our experts work on your issue while you watch or go about your day.'
  },
  {
    step: '05',
    title: 'Quality Check',
    description: 'We thoroughly test the solution and ensure everything works perfectly.'
  },
  {
    step: '06',
    title: 'Follow-up Support',
    description: 'Get continued support and advice to prevent future issues.'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Benefits section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl mb-4">
            Why Choose Remote Tech Services?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the convenience and efficiency of professional remote tech support. 
            Here&apos;s why thousands of clients trust QuickTechPro.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 mb-4">{benefit.description}</p>
              <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                {benefit.stats}
              </div>
            </div>
          ))}
        </div>

        {/* Process section */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How Our Remote Process Works
            </h3>
            <p className="text-lg text-gray-600">
              Simple, secure, and efficient. Here&apos;s how we solve your tech problems remotely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent transform translate-x-4"></div>
                )}
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white font-bold text-xl rounded-full mb-4">
                    {step.step}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Ready to Experience Remote Tech Support?
              </h4>
              <p className="text-gray-600 mb-4">
                Join thousands of satisfied customers who chose the convenience of remote service.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Start Your Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
