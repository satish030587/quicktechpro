import Link from 'next/link';

const footerSections = [
  {
    title: 'Services',
    links: [
      { name: 'Remote Computer Repair', href: '/computer-repair' },
      { name: 'Website Design', href: '/website-design' },
      { name: 'Web Applications', href: '/web-applications' },
      { name: 'Emergency Support', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Process', href: '/about#process' },
      { name: 'Testimonials', href: '/#testimonials' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">QuickTechPro</h3>
                <p className="text-sm text-gray-400">Complete Tech Solutions</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Your trusted partner for remote computer repair, professional website design, 
              and custom web application development. Serving globally from India with 
              transparent pricing and 24/7 support.
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-green-600 text-xs px-2 py-1 rounded">100% Remote</span>
              <span className="bg-blue-600 text-xs px-2 py-1 rounded">Secure</span>
              <span className="bg-purple-600 text-xs px-2 py-1 rounded">24/7 Support</span>
            </div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Contact Information</h4>
              <p className="text-gray-400">Email: contact@quicktechpro.in</p>
              <p className="text-gray-400">Phone: +91-XXXX-XXXXXX</p>
              <p className="text-gray-400">WhatsApp: +91-XXXX-XXXXXX</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Business Hours</h4>
              <p className="text-gray-400">Monday - Friday: 9:00 AM - 8:00 PM IST</p>
              <p className="text-gray-400">Saturday: 10:00 AM - 6:00 PM IST</p>
              <p className="text-gray-400">Emergency Support: 24/7</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Location</h4>
              <p className="text-gray-400">India (Remote Services Only)</p>
              <p className="text-gray-400">Serving Globally</p>
              <p className="text-gray-400">No On-Site Visits</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 QuickTechPro.in - All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
