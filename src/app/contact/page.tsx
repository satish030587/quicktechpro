import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact QuickTechPro | Get Expert Remote Tech Support Now",
  description: "Contact QuickTechPro for professional remote tech services. 24/7 support available. Computer repair, website design, and web development services.",
  keywords: "contact quicktechpro, tech support contact, remote computer repair, emergency tech help, website design contact",
};

const contactMethods = [
  {
    type: "Phone",
    icon: "📞",
    title: "Call Us Directly",
    details: "+91-XXXX-XXXXXX",
    description: "Available 24/7 for emergency support",
    availability: "24/7 Emergency Support",
    action: "tel:+91-XXXX-XXXXXX"
  },
  {
    type: "Email",
    icon: "📧",
    title: "Email Support",
    details: "support@quicktechpro.com",
    description: "Get detailed responses within 2 hours",
    availability: "Response within 2 hours",
    action: "mailto:support@quicktechpro.com"
  },
  {
    type: "WhatsApp",
    icon: "💬",
    title: "WhatsApp Chat",
    details: "+91-XXXX-XXXXXX",
    description: "Quick chat support and file sharing",
    availability: "Instant messaging",
    action: "https://wa.me/91XXXXXXXXXX"
  },
  {
    type: "Video Call",
    icon: "📹",
    title: "Schedule Video Call",
    details: "Book consultation",
    description: "Face-to-face project discussions",
    availability: "By appointment",
    action: "#schedule-call"
  }
];

const officeInfo = {
  address: "Tech Hub, Bangalore, Karnataka, India",
  timezone: "IST (UTC +5:30)",
  workingHours: "24/7 Support Available",
  languages: ["English", "Hindi", "Regional Languages"]
};

const emergencyServices = [
  {
    title: "Computer Not Starting",
    description: "Immediate diagnosis and repair",
    responseTime: "15 minutes",
    price: "Starting ₹299"
  },
  {
    title: "Website Down",
    description: "Emergency website recovery",
    responseTime: "30 minutes",
    price: "Starting ₹799"
  },
  {
    title: "Data Recovery",
    description: "Critical data rescue services",
    responseTime: "1 hour",
    price: "Starting ₹1,299"
  },
  {
    title: "Security Breach",
    description: "Immediate security assessment",
    responseTime: "Immediate",
    price: "Starting ₹1,999"
  }
];

const faqItems = [
  {
    question: "How do remote services work?",
    answer: "We use secure remote desktop software to connect to your computer. You'll see everything we do on your screen and can stop the session at any time. All connections are encrypted and secure."
  },
  {
    question: "Is my data safe during remote sessions?",
    answer: "Absolutely. We use enterprise-grade encryption and never access personal files without permission. Our technicians are certified and follow strict privacy protocols."
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer: "We offer a 100% satisfaction guarantee. If you're not happy with our service, we'll make it right or provide a full refund within 7 days."
  },
  {
    question: "Do you work on Mac and Linux systems?",
    answer: "Yes, our team is proficient with Windows, macOS, and various Linux distributions. We support all major operating systems."
  },
  {
    question: "Can you help with business networks?",
    answer: "Yes, we provide business tech support including network troubleshooting, server management, and enterprise software support."
  },
  {
    question: "How quickly can you respond to emergencies?",
    answer: "For critical issues, we typically respond within 15 minutes. We have technicians available 24/7 to handle urgent situations."
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl mb-6">
              Contact QuickTechPro
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Get professional remote tech support when you need it. Multiple ways to reach us, fast response times, and expert solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:+91-XXXX-XXXXXX" className="bg-white text-blue-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105">
                📞 Call Now: +91-XXXX-XXXXXX
              </a>
              <a href="#contact-form" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-xl transition-all duration-200">
                💬 Send Message
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-xl text-gray-600">
              Choose the contact method that works best for you. We&apos;re here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200">
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-blue-600 font-semibold mb-2">{method.details}</p>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                <p className="text-green-600 text-sm font-medium mb-4">{method.availability}</p>
                <a href={method.action} className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-16 bg-red-50 border-l-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🚨 Emergency Services Available
            </div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Critical Issue? We&apos;re Here to Help
            </h2>
            <p className="text-xl text-gray-600">
              Don&apos;t panic! Our emergency response team is standing by for critical tech issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyServices.map((service, index) => (
              <div key={index} className="bg-white rounded-lg border-2 border-red-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Response:</span>
                    <span className="text-sm font-medium text-green-600">{service.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="text-sm font-medium text-blue-600">{service.price}</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Get Emergency Help
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a href="tel:+91-XXXX-XXXXXX" className="inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors">
              🚨 Emergency Hotline: +91-XXXX-XXXXXX
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we&apos;ll get back to you within 2 hours during business hours, 
                or first thing the next business day.
              </p>
              <ContactForm />
            </div>

            {/* Office Information */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Office Information</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📍 Location</h4>
                  <p className="text-gray-600">{officeInfo.address}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🕐 Timezone</h4>
                  <p className="text-gray-600">{officeInfo.timezone}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">⏰ Availability</h4>
                  <p className="text-gray-600">{officeInfo.workingHours}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🗣️ Languages</h4>
                  <p className="text-gray-600">{officeInfo.languages.join(", ")}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
                    📘 Facebook
                  </a>
                  <a href="#" className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors">
                    🐦 Twitter
                  </a>
                  <a href="#" className="bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition-colors">
                    💼 LinkedIn
                  </a>
                  <a href="#" className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors">
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions about our remote tech services.
            </p>
          </div>

          <div className="space-y-6">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <a href="tel:+91-XXXX-XXXXXX" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Call Us for Immediate Answers
            </a>
          </div>
        </div>
      </section>

      {/* Response Time Guarantee */}
      <section className="py-16 bg-green-50 border-t-4 border-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            ✅ Response Time Guarantee
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            We Guarantee Fast Response Times
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">15 min</div>
              <div className="font-semibold text-gray-900">Emergency Issues</div>
              <div className="text-sm text-gray-600">Critical system failures</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2 hours</div>
              <div className="font-semibold text-gray-900">Email Support</div>
              <div className="text-sm text-gray-600">Detailed responses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="font-semibold text-gray-900">Phone Support</div>
              <div className="text-sm text-gray-600">Always available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
