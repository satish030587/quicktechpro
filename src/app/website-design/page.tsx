import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PricingTable from "@/components/PricingTable";

export const metadata: Metadata = {
  title: "Professional Website Design Services | QuickTechPro - Responsive & SEO-Friendly",
  description: "Professional website design and development services. Responsive designs, e-commerce solutions, WordPress development, SEO optimization. Portfolio showcasing our work.",
  keywords: "website design, web development, responsive design, e-commerce, WordPress, SEO, professional websites",
};

const portfolioProjects = [
  {
    title: "E-commerce Fashion Store",
    category: "E-commerce",
    description: "Modern online fashion store with shopping cart, payment gateway, and inventory management.",
    features: ["Responsive Design", "Payment Integration", "Inventory System", "SEO Optimized"],
    image: "/portfolio/fashion-store.jpg"
  },
  {
    title: "Restaurant Website",
    category: "Business Website",
    description: "Elegant restaurant website with online menu, reservation system, and photo gallery.",
    features: ["Online Menu", "Booking System", "Photo Gallery", "Contact Forms"],
    image: "/portfolio/restaurant.jpg"
  },
  {
    title: "Medical Clinic Portal",
    category: "Professional Services",
    description: "Professional medical website with appointment booking and patient information system.",
    features: ["Appointment Booking", "Patient Portal", "Service Pages", "Contact Integration"],
    image: "/portfolio/medical.jpg"
  },
  {
    title: "Digital Marketing Agency",
    category: "Corporate",
    description: "Corporate website for digital marketing agency with portfolio and service showcase.",
    features: ["Portfolio Showcase", "Service Pages", "Team Profiles", "Blog Integration"],
    image: "/portfolio/agency.jpg"
  },
  {
    title: "Educational Institute",
    category: "Educational",
    description: "Comprehensive website for educational institute with course catalog and student portal.",
    features: ["Course Catalog", "Student Portal", "News & Events", "Faculty Profiles"],
    image: "/portfolio/education.jpg"
  },
  {
    title: "Real Estate Platform",
    category: "Real Estate",
    description: "Property listing website with search functionality and agent profiles.",
    features: ["Property Listings", "Advanced Search", "Agent Profiles", "Contact Forms"],
    image: "/portfolio/realestate.jpg"
  }
];

const packages = [
  {
    name: "Basic Business Website",
    price: "₹15,000",
    duration: "7-10 days",
    description: "Perfect for small businesses and startups",
    features: [
      "5-page responsive website",
      "Mobile-friendly design",
      "Contact form integration",
      "Basic SEO setup",
      "Social media links",
      "3 months free support"
    ],
    popular: false
  },
  {
    name: "Professional Website",
    price: "₹35,000",
    duration: "10-15 days",
    description: "Comprehensive solution for growing businesses",
    features: [
      "10-page responsive website",
      "Advanced design & animations",
      "Blog/News section",
      "Advanced SEO optimization",
      "Google Analytics integration",
      "Contact forms & maps",
      "6 months free support",
      "Content management system"
    ],
    popular: true
  },
  {
    name: "E-commerce Solution",
    price: "₹75,000",
    duration: "15-20 days",
    description: "Complete online store with payment integration",
    features: [
      "Full e-commerce functionality",
      "Product catalog management",
      "Shopping cart & checkout",
      "Payment gateway integration",
      "Order management system",
      "Customer account portal",
      "Inventory management",
      "12 months free support",
      "Mobile app ready"
    ],
    popular: false
  }
];

const processSteps = [
  {
    step: 1,
    title: "Consultation & Planning",
    description: "We discuss your requirements, target audience, and business goals to create a detailed project plan."
  },
  {
    step: 2,
    title: "Design Mockups",
    description: "Our designers create visual mockups and wireframes for your approval before development begins."
  },
  {
    step: 3,
    title: "Development & Coding",
    description: "We build your website using modern technologies, ensuring responsive design and optimal performance."
  },
  {
    step: 4,
    title: "Content Integration",
    description: "We add your content, images, and optimize everything for search engines and user experience."
  },
  {
    step: 5,
    title: "Testing & Quality Assurance",
    description: "Rigorous testing across devices and browsers to ensure perfect functionality and performance."
  },
  {
    step: 6,
    title: "Launch & Support",
    description: "We launch your website and provide ongoing support, training, and maintenance services."
  }
];

const technologies = [
  { name: "HTML5 & CSS3", description: "Modern web standards for clean, semantic code" },
  { name: "JavaScript & React", description: "Interactive features and modern user interfaces" },
  { name: "WordPress", description: "Easy-to-manage content management system" },
  { name: "Responsive Design", description: "Mobile-first approach for all device compatibility" },
  { name: "SEO Optimization", description: "Search engine friendly structure and content" },
  { name: "Performance Optimization", description: "Fast loading speeds and optimized images" }
];

export default function WebsiteDesignPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full bg-purple-500/20 px-4 py-1.5 text-sm font-medium mb-6">
              <span>🎨 Professional Website Design & Development</span>
            </div>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl mb-6">
              Website Design Services
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Custom website design and development that drives results. Responsive, SEO-friendly, and conversion-optimized websites for your business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105">
                Get Free Website Quote
              </a>
              <a href="#portfolio" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold py-4 px-8 rounded-xl transition-all duration-200">
                View Our Portfolio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Our Website Portfolio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our recent website projects and see how we&apos;ve helped businesses establish their online presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioProjects.map((project, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Portfolio Image Placeholder</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="space-y-2">
                    {project.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <svg className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services & Packages */}
      <section id="packages" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Website Design Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect package for your business needs. All packages include responsive design and basic SEO.
            </p>
          </div>

          <PricingTable packages={packages} />
        </div>
      </section>

      {/* Design Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Our Website Design Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From concept to launch, we follow a proven process to deliver exceptional websites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white font-bold text-xl rounded-full mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Technologies We Use
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use modern, reliable technologies to build fast, secure, and scalable websites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tech.name}</h3>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Why Choose Our Website Design Services?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📱",
                title: "Mobile-First Design",
                description: "All websites are designed mobile-first to ensure perfect performance on all devices."
              },
              {
                icon: "🚀",
                title: "Fast Loading Speed",
                description: "Optimized code and images ensure your website loads quickly for better user experience."
              },
              {
                icon: "🔍",
                title: "SEO Optimized",
                description: "Built-in SEO best practices to help your website rank higher in search results."
              },
              {
                icon: "🔒",
                title: "Secure & Reliable",
                description: "SSL certificates, secure hosting, and regular security updates included."
              },
              {
                icon: "🎨",
                title: "Custom Design",
                description: "Unique designs tailored to your brand and business requirements."
              },
              {
                icon: "💼",
                title: "Easy Management",
                description: "User-friendly admin panels that make updating content simple and efficient."
              },
              {
                icon: "📊",
                title: "Analytics Integration",
                description: "Google Analytics and other tracking tools setup for performance monitoring."
              },
              {
                icon: "🛠️",
                title: "Ongoing Support",
                description: "Free support and maintenance included with all website packages."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 text-white">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">
              Ready to Build Your Website?
            </h2>
            <p className="text-xl opacity-90">
              Get a free consultation and quote for your website project. Let&apos;s bring your vision to life.
            </p>
          </div>
          <ContactForm serviceType="Website Design" />
        </div>
      </section>
    </div>
  );
}
