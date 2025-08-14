import Link from 'next/link';

const services = [
  {
    id: 'computer-repair',
    title: 'Remote Computer Repair',
    description: 'Expert computer troubleshooting and repair services delivered remotely. No on-site visits required.',
    features: [
      'Virus & Malware Removal',
      'Performance Optimization',
      'Software Installation & Updates',
      'Data Recovery Services',
      'Email Setup & Configuration',
      'Windows & Mac Support'
    ],
    pricing: 'Starting from ₹500/hour',
    icon: '🖥️',
    badge: 'Most Popular',
    link: '/computer-repair'
  },
  {
    id: 'website-design',
    title: 'Professional Website Design',
    description: 'Custom website design and development services for businesses of all sizes.',
    features: [
      'Responsive Web Design',
      'E-commerce Solutions',
      'WordPress Development',
      'SEO Optimization',
      'Mobile-First Approach',
      'Free Maintenance (3 months)'
    ],
    pricing: 'Starting from ₹15,000',
    icon: '🎨',
    badge: null,
    link: '/website-design'
  },
  {
    id: 'web-applications',
    title: 'Custom Web Applications',
    description: 'Scalable web applications tailored to your business needs with modern technologies.',
    features: [
      'Custom Dashboard Development',
      'Database Design & Integration',
      'API Development',
      'User Authentication Systems',
      'Payment Gateway Integration',
      'Cloud Hosting Setup'
    ],
    pricing: 'Starting from ₹50,000',
    icon: '⚡',
    badge: 'Enterprise',
    link: '/web-applications'
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl mb-4">
            Our Professional Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tech solutions designed to solve your problems quickly and efficiently. 
            All services delivered remotely with transparent pricing.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
            >
              {/* Badge */}
              {service.badge && (
                <div className="absolute -top-3 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {service.badge}
                </div>
              )}

              <div className="p-8">
                {/* Icon and title */}
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6">{service.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <svg className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Pricing and CTA */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">{service.pricing}</span>
                  </div>
                  <Link
                    href={service.link}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center block group-hover:bg-blue-700"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-8">
            Not sure which service you need? Get a free consultation to discuss your requirements.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Get Free Consultation
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
