import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About QuickTechPro | Expert Remote Tech Services from India",
  description: "Learn about QuickTechPro's mission, expertise, and team. Professional remote tech services including computer repair, website design, and web development since 2020.",
  keywords: "about quicktechpro, remote tech services, computer repair experts, web development team, india tech support",
};

const teamMembers = [
  {
    name: "Rajesh Kumar",
    role: "Founder & Lead Developer",
    experience: "8+ years",
    expertise: ["Full-Stack Development", "System Architecture", "Team Leadership"],
    description: "Passionate about creating innovative tech solutions and leading remote teams to deliver exceptional results."
  },
  {
    name: "Priya Sharma",
    role: "Senior Computer Technician",
    experience: "6+ years",
    expertise: ["Computer Repair", "Network Troubleshooting", "Data Recovery"],
    description: "Expert in diagnosing and solving complex computer issues remotely with a focus on customer satisfaction."
  },
  {
    name: "Amit Patel",
    role: "UI/UX Designer",
    experience: "5+ years",
    expertise: ["Web Design", "User Experience", "Brand Identity"],
    description: "Creates beautiful, user-friendly designs that convert visitors into customers and enhance user experience."
  },
  {
    name: "Sarah Johnson",
    role: "Project Manager",
    experience: "7+ years",
    expertise: ["Project Management", "Client Relations", "Quality Assurance"],
    description: "Ensures all projects are delivered on time and exceed client expectations through effective communication."
  }
];

const companyStats = [
  { number: "500+", label: "Happy Clients", description: "Satisfied customers worldwide" },
  { number: "1200+", label: "Projects Completed", description: "Successful deliveries since 2020" },
  { number: "24/7", label: "Support Available", description: "Round-the-clock emergency support" },
  { number: "99.9%", label: "Uptime Guarantee", description: "Reliable service availability" },
  { number: "15 min", label: "Average Response", description: "Quick response to queries" },
  { number: "5⭐", label: "Average Rating", description: "Client satisfaction rating" }
];

const values = [
  {
    title: "Transparency",
    description: "Clear communication, honest pricing, and no hidden fees. You always know what you're paying for.",
    icon: "🔍"
  },
  {
    title: "Quality",
    description: "We deliver high-quality solutions that are built to last and perform optimally.",
    icon: "⭐"
  },
  {
    title: "Innovation",
    description: "Using cutting-edge technologies and modern practices to solve complex problems.",
    icon: "💡"
  },
  {
    title: "Customer-Centric",
    description: "Your success is our priority. We go above and beyond to ensure your satisfaction.",
    icon: "❤️"
  },
  {
    title: "Security",
    description: "Your data and privacy are protected with enterprise-grade security measures.",
    icon: "🔒"
  },
  {
    title: "Reliability",
    description: "Consistent, dependable service you can count on for all your tech needs.",
    icon: "🛡️"
  }
];

const certifications = [
  "CompTIA A+ Certified Technicians",
  "Microsoft Certified Professional",
  "Google Analytics Certified",
  "AWS Cloud Practitioner",
  "Certified Ethical Hacker (CEH)",
  "Project Management Professional (PMP)"
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl mb-6">
              About QuickTechPro
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Your trusted partner for professional remote tech services. Based in India, serving clients globally with expertise, innovation, and dedication.
            </p>
            <div className="inline-flex items-center rounded-full bg-white/20 px-6 py-2 text-sm font-medium">
              <span>🚀 Serving clients worldwide since 2020</span>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                Our Story & Mission
              </h2>
              <div className="space-y-6 text-gray-700">
                <p className="text-lg">
                  QuickTechPro was founded in 2020 with a simple vision: to provide professional, 
                  affordable, and accessible tech services to businesses and individuals worldwide through remote solutions.
                </p>
                <p>
                  Based in India, we recognized the growing need for reliable remote tech support that could serve 
                  clients across different time zones and geographical boundaries. Our team of certified professionals 
                  combines local expertise with global service standards.
                </p>
                <p>
                  What started as a small computer repair service has evolved into a comprehensive tech solutions 
                  provider, offering everything from emergency computer support to custom web application development.
                </p>
                <p>
                  Our mission is to democratize access to professional tech services by making them affordable, 
                  transparent, and available 24/7 through secure remote connections.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Remote Services?</h3>
              <ul className="space-y-4">
                {[
                  "Faster response times - no travel required",
                  "Cost-effective solutions with transparent pricing",
                  "Access to specialized expertise globally",
                  "Eco-friendly approach with zero carbon footprint",
                  "Convenient for clients - work from anywhere",
                  "Secure connections with enterprise-grade encryption"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and every service we provide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced professionals dedicated to solving your tech challenges and delivering exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm mb-4">{member.experience} experience</p>
                <p className="text-gray-600 text-sm mb-4">{member.description}</p>
                <div className="space-y-1">
                  {member.expertise.map((skill, idx) => (
                    <span key={idx} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Expertise */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Certifications & Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team holds industry-recognized certifications and stays updated with the latest technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-2xl mb-3">🏆</div>
                <p className="font-semibold text-gray-900">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process & Approach */}
      <section id="process" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Our Approach to Remote Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A proven methodology that ensures secure, efficient, and effective remote support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Secure Connection",
                description: "Establish encrypted remote connection using enterprise-grade security protocols"
              },
              {
                step: "2",
                title: "Detailed Assessment",
                description: "Thorough diagnosis and analysis of your technical requirements or issues"
              },
              {
                step: "3",
                title: "Transparent Communication",
                description: "Clear explanation of the problem, solution, and costs before proceeding"
              },
              {
                step: "4",
                title: "Expert Resolution",
                description: "Professional implementation with real-time updates and quality assurance"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white font-bold text-xl rounded-full mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Ready to Experience Professional Remote Tech Support?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of satisfied clients who trust QuickTechPro for their tech needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/contact" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105">
              Get Started Today
            </a>
            <a href="tel:+91-XXXX-XXXXXX" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-xl transition-all duration-200">
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
