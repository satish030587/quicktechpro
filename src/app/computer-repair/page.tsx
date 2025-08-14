import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PricingTable from "@/components/PricingTable";

export const metadata: Metadata = {
  title: "Remote Computer Repair Services | QuickTechPro - No On-Site Visits",
  description: "Professional remote computer repair services. Virus removal, performance optimization, software issues, data recovery. 24/7 support. No on-site visits required.",
  keywords: "remote computer repair, virus removal, computer fix, performance optimization, data recovery, tech support",
};

const services = [
  {
    category: "Virus & Malware Removal",
    description: "Complete system cleanup and protection",
    services: [
      "Deep virus and malware scanning",
      "Rootkit and spyware removal",
      "Browser hijacker cleanup",
      "Antivirus installation and setup",
      "System security optimization"
    ],
    estimatedTime: "1-3 hours",
    urgency: "high"
  },
  {
    category: "Performance Optimization",
    description: "Speed up your slow computer",
    services: [
      "System startup optimization",
      "Disk cleanup and defragmentation",
      "Registry cleanup and repair",
      "Unnecessary program removal",
      "Memory and CPU optimization"
    ],
    estimatedTime: "2-4 hours",
    urgency: "medium"
  },
  {
    category: "Software Issues",
    description: "Fix software problems and installations",
    services: [
      "Software installation and updates",
      "Driver installation and updates",
      "Program crashes and errors",
      "Windows update issues",
      "Software compatibility problems"
    ],
    estimatedTime: "1-2 hours",
    urgency: "medium"
  },
  {
    category: "System Recovery",
    description: "Data recovery and system restoration",
    services: [
      "System backup and restore",
      "Data recovery from crashed systems",
      "System file repair",
      "Boot problems resolution",
      "Blue screen error fixes"
    ],
    estimatedTime: "3-6 hours",
    urgency: "high"
  },
  {
    category: "Email & Internet Setup",
    description: "Configure email and internet settings",
    services: [
      "Email account setup (Outlook, Gmail, etc.)",
      "Internet connection troubleshooting",
      "WiFi password recovery",
      "Network printer setup",
      "VPN configuration"
    ],
    estimatedTime: "30 minutes - 1 hour",
    urgency: "low"
  },
  {
    category: "General Troubleshooting",
    description: "Diagnose and fix various computer issues",
    services: [
      "Hardware diagnostic testing",
      "System crash investigation",
      "Error message troubleshooting",
      "Performance monitoring setup",
      "Preventive maintenance"
    ],
    estimatedTime: "1-3 hours",
    urgency: "medium"
  }
];

const packages = [
  {
    name: "Quick Fix",
    price: "₹500",
    duration: "Up to 1 hour",
    description: "Perfect for simple issues and quick fixes",
    features: [
      "Basic troubleshooting",
      "Software installation",
      "Simple virus removal",
      "Email setup",
      "Basic optimization"
    ],
    popular: false
  },
  {
    name: "Standard Repair",
    price: "₹1,500",
    duration: "2-3 hours",
    description: "Comprehensive repair for most computer problems",
    features: [
      "Deep virus/malware removal",
      "Performance optimization",
      "System cleanup",
      "Driver updates",
      "Software troubleshooting",
      "30-day follow-up support"
    ],
    popular: true
  },
  {
    name: "Complete Cleanup",
    price: "₹3,000",
    duration: "4+ hours",
    description: "Full system overhaul and optimization",
    features: [
      "Complete system cleanup",
      "Advanced malware removal",
      "Registry optimization",
      "Data backup service",
      "System security setup",
      "90-day follow-up support",
      "Priority support access"
    ],
    popular: false
  }
];

const processSteps = [
  {
    step: 1,
    title: "Contact & Assessment",
    description: "Call or message us describing your computer problem. We provide a free initial assessment and quote."
  },
  {
    step: 2,
    title: "Remote Connection Setup",
    description: "We guide you through installing our secure remote access software (TeamViewer, AnyDesk, or similar)."
  },
  {
    step: 3,
    title: "Diagnosis & Approval",
    description: "Our technician diagnoses the issue and explains the solution before starting any work."
  },
  {
    step: 4,
    title: "Repair Process",
    description: "Watch as we fix your computer remotely. You can disconnect at any time if needed."
  },
  {
    step: 5,
    title: "Testing & Verification",
    description: "We thoroughly test the solution and ensure your computer is working optimally."
  },
  {
    step: 6,
    title: "Follow-up Support",
    description: "Get continued support and tips to prevent future issues."
  }
];

export default function ComputerRepairPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full bg-blue-500/20 px-4 py-1.5 text-sm font-medium mb-6">
              <span>🖥️ 100% Remote Service - No On-Site Visits</span>
            </div>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl mb-6">
              Remote Computer Repair Services
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Expert computer troubleshooting and repair delivered remotely. Fast, secure, and affordable solutions for all your PC problems.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105">
                Get Emergency Help Now
              </a>
              <a href="#packages" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-xl transition-all duration-200">
                View Pricing Packages
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* No On-Site Policy */}
      <section className="py-16 bg-yellow-50 border-l-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-center">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🚫 Important: No On-Site Visits Policy
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                QuickTechPro operates exclusively through remote support. We do not provide on-site or in-person computer repair services. 
                All repairs are conducted remotely using secure screen-sharing technology.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold text-gray-900 mb-2">✅ What We Do</h3>
                  <p className="text-gray-600">Remote diagnosis, software repair, virus removal, optimization, and technical support</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold text-gray-900 mb-2">❌ What We Don&apos;t Do</h3>
                  <p className="text-gray-600">Physical hardware repairs, on-site visits, or in-person services</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold text-gray-900 mb-2">🔧 Hardware Issues</h3>
                  <p className="text-gray-600">We can diagnose hardware problems and recommend local repair shops</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Computer Problems We Solve Remotely
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our certified technicians can fix most software-related computer issues remotely, saving you time and money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{service.category}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.urgency === 'high' ? 'bg-red-100 text-red-800' :
                    service.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {service.urgency === 'high' ? 'Urgent' : service.urgency === 'medium' ? 'Standard' : 'Quick'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.services.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <svg className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="text-sm text-blue-600 font-medium">
                  ⏱️ Estimated Time: {service.estimatedTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section id="packages" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Transparent Pricing Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the package that best fits your needs. No hidden fees, no surprises.
            </p>
          </div>

          <PricingTable packages={packages} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              How Remote Computer Repair Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and efficient. Here&apos;s how we fix your computer problems remotely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white font-bold text-xl rounded-full mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Is remote computer repair safe?",
                a: "Yes, absolutely. We use enterprise-grade encrypted connections and never access your personal files without permission. You can watch everything we do and disconnect at any time."
              },
              {
                q: "What if you can't fix my computer remotely?",
                a: "If we cannot resolve your issue remotely, you don't pay anything. We'll provide recommendations for local hardware repair services if needed."
              },
              {
                q: "How long does a typical repair take?",
                a: "Most software issues can be resolved within 1-3 hours. Complex problems may take longer, but we always provide time estimates upfront."
              },
              {
                q: "Do you support both Windows and Mac?",
                a: "Yes, we support Windows (all versions), macOS, and can help with basic Linux issues as well."
              },
              {
                q: "What happens to my data during repair?",
                a: "Your data remains on your computer. We focus on fixing software issues and never access personal files unless specifically requested for data recovery."
              },
              {
                q: "Can you fix hardware problems remotely?",
                a: "We can diagnose hardware issues and provide recommendations, but physical hardware repairs require local service. We can help you find reputable local repair shops."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 text-white">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">
              Get Your Computer Fixed Today
            </h2>
            <p className="text-xl opacity-90">
              Describe your problem and get a free quote. Emergency support available 24/7.
            </p>
          </div>
          <ContactForm serviceType="Computer Repair" />
        </div>
      </section>
    </div>
  );
}
