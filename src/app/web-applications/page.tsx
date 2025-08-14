import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Custom Web Application Development | QuickTechPro - Scalable Business Solutions",
  description: "Custom web application development services. Business management tools, inventory systems, booking platforms, dashboards. Built with modern technologies.",
  keywords: "web application development, custom software, business tools, dashboard development, API integration, database design",
};

const applicationTypes = [
  {
    title: "Business Management Systems",
    description: "Comprehensive solutions to manage your business operations efficiently",
    examples: [
      "Customer Relationship Management (CRM)",
      "Employee Management Systems",
      "Project Management Tools",
      "Invoice & Billing Systems",
      "Document Management Systems"
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "REST APIs"],
    timeline: "4-8 weeks",
    startingPrice: "₹75,000"
  },
  {
    title: "Inventory & Stock Management",
    description: "Keep track of your inventory with real-time updates and reporting",
    examples: [
      "Stock Level Monitoring",
      "Purchase Order Management",
      "Supplier Management",
      "Sales & Reports Dashboard",
      "Barcode Scanning Integration"
    ],
    techStack: ["Vue.js", "Python", "MySQL", "Real-time Updates"],
    timeline: "3-6 weeks",
    startingPrice: "₹60,000"
  },
  {
    title: "Booking & Reservation Systems",
    description: "Online booking platforms for appointments, events, and services",
    examples: [
      "Appointment Scheduling",
      "Room/Resource Booking",
      "Event Management",
      "Calendar Integration",
      "Automated Notifications"
    ],
    techStack: ["React", "Node.js", "MongoDB", "Payment Gateway"],
    timeline: "3-5 weeks",
    startingPrice: "₹50,000"
  },
  {
    title: "Custom Dashboards & Analytics",
    description: "Data visualization and business intelligence solutions",
    examples: [
      "Real-time Analytics Dashboard",
      "Sales Performance Tracking",
      "Financial Reports & Charts",
      "KPI Monitoring",
      "Custom Data Visualization"
    ],
    techStack: ["React", "D3.js", "Node.js", "Data APIs"],
    timeline: "2-4 weeks",
    startingPrice: "₹40,000"
  },
  {
    title: "E-learning & Training Platforms",
    description: "Educational platforms with course management and progress tracking",
    examples: [
      "Course Management System",
      "Student Progress Tracking",
      "Online Assessments",
      "Video Content Delivery",
      "Certificate Generation"
    ],
    techStack: ["React", "Node.js", "Video APIs", "Database"],
    timeline: "6-10 weeks",
    startingPrice: "₹100,000"
  },
  {
    title: "Communication & Collaboration Tools",
    description: "Internal tools to improve team communication and productivity",
    examples: [
      "Team Chat Applications",
      "File Sharing Systems",
      "Task Management Tools",
      "Meeting Scheduler",
      "Internal Wiki/Knowledge Base"
    ],
    techStack: ["Socket.io", "React", "Node.js", "Real-time"],
    timeline: "4-7 weeks",
    startingPrice: "₹70,000"
  }
];

const features = [
  {
    title: "Database Design & Architecture",
    description: "Robust database design for scalable and efficient data management",
    icon: "🗄️"
  },
  {
    title: "API Development & Integration",
    description: "RESTful APIs and third-party service integrations",
    icon: "🔗"
  },
  {
    title: "User Authentication & Security",
    description: "Secure login systems with role-based access control",
    icon: "🔐"
  },
  {
    title: "Payment Gateway Integration",
    description: "Secure payment processing with multiple gateway options",
    icon: "💳"
  },
  {
    title: "Real-time Features",
    description: "Live updates, notifications, and real-time data synchronization",
    icon: "⚡"
  },
  {
    title: "Cloud Hosting & Deployment",
    description: "Scalable cloud infrastructure with automated deployment",
    icon: "☁️"
  },
  {
    title: "Mobile Responsive Design",
    description: "Applications that work perfectly on all devices",
    icon: "📱"
  },
  {
    title: "Data Analytics & Reporting",
    description: "Built-in analytics and comprehensive reporting features",
    icon: "📊"
  }
];

const technologies = [
  {
    category: "Frontend Technologies",
    techs: ["React.js", "Vue.js", "Angular", "TypeScript", "Tailwind CSS", "Bootstrap"]
  },
  {
    category: "Backend Technologies",
    techs: ["Node.js", "Python (Django/Flask)", "PHP (Laravel)", "Express.js", "REST APIs", "GraphQL"]
  },
  {
    category: "Databases",
    techs: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "SQLite"]
  },
  {
    category: "Cloud & DevOps",
    techs: ["AWS", "Google Cloud", "Digital Ocean", "Docker", "Git", "CI/CD"]
  },
  {
    category: "Integration & APIs",
    techs: ["Payment Gateways", "Email Services", "SMS APIs", "Social Media APIs", "Google Services", "Third-party APIs"]
  },
  {
    category: "Additional Tools",
    techs: ["Socket.io", "WebRTC", "Chart.js", "PDF Generation", "File Upload", "Image Processing"]
  }
];

const developmentProcess = [
  {
    phase: "Discovery & Planning",
    duration: "3-5 days",
    activities: [
      "Requirements gathering & analysis",
      "Technical specification document",
      "Project timeline & milestones",
      "Technology stack selection",
      "Database schema design"
    ]
  },
  {
    phase: "UI/UX Design",
    duration: "5-7 days",
    activities: [
      "Wireframe creation",
      "User interface design",
      "User experience optimization",
      "Design system creation",
      "Client approval & feedback"
    ]
  },
  {
    phase: "Backend Development",
    duration: "10-15 days",
    activities: [
      "Database setup & configuration",
      "API development",
      "Authentication system",
      "Business logic implementation",
      "Integration development"
    ]
  },
  {
    phase: "Frontend Development",
    duration: "10-15 days",
    activities: [
      "User interface implementation",
      "API integration",
      "Responsive design implementation",
      "Interactive features development",
      "User experience optimization"
    ]
  },
  {
    phase: "Testing & Quality Assurance",
    duration: "5-7 days",
    activities: [
      "Unit testing",
      "Integration testing",
      "User acceptance testing",
      "Performance optimization",
      "Security testing"
    ]
  },
  {
    phase: "Deployment & Launch",
    duration: "2-3 days",
    activities: [
      "Production environment setup",
      "Application deployment",
      "Domain & SSL configuration",
      "Performance monitoring setup",
      "User training & documentation"
    ]
  }
];

export default function WebApplicationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full bg-indigo-500/20 px-4 py-1.5 text-sm font-medium mb-6">
              <span>⚡ Custom Web Application Development</span>
            </div>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl mb-6">
              Custom Web Applications
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Scalable web applications tailored to your business needs. From business management tools to complex dashboards, we build solutions that grow with you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact" className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105">
                Discuss Your Project
              </a>
              <a href="#applications" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold py-4 px-8 rounded-xl transition-all duration-200">
                View Application Types
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Application Types */}
      <section id="applications" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Types of Web Applications We Build
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From simple business tools to complex enterprise applications, we create solutions that solve real business problems.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {applicationTypes.map((app, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{app.title}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                    {app.timeline}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">{app.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {app.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <svg className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {app.techStack.map((tech, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-indigo-600">{app.startingPrice}</span>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features & Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Application Features & Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every application we build includes modern features and best practices for security, performance, and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Our Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use modern, proven technologies to build robust, scalable, and maintainable web applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{category.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.techs.map((tech, idx) => (
                    <span key={idx} className="bg-white text-gray-700 text-sm px-3 py-1 rounded-full border">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Our Development Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A structured approach to deliver high-quality applications on time and within budget.
            </p>
          </div>

          <div className="space-y-8">
            {developmentProcess.map((phase, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{phase.phase}</h3>
                    <p className="text-indigo-600 font-medium">{phase.duration}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {phase.activities.map((activity, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 text-sm">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Complexity Assessment */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Project Complexity Assessment
            </h2>
            <p className="text-xl text-gray-600">
              Help us understand your project requirements to provide an accurate quote and timeline.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  S
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Simple</h3>
                <p className="text-gray-600 text-sm mb-4">Basic CRUD operations, simple user interface, minimal integrations</p>
                <div className="text-green-600 font-bold">₹25,000 - ₹50,000</div>
                <div className="text-gray-500 text-sm">2-4 weeks</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  M
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Medium</h3>
                <p className="text-gray-600 text-sm mb-4">Advanced features, multiple user roles, API integrations, reporting</p>
                <div className="text-yellow-600 font-bold">₹50,000 - ₹100,000</div>
                <div className="text-gray-500 text-sm">4-8 weeks</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  C
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Complex</h3>
                <p className="text-gray-600 text-sm mb-4">Enterprise features, real-time capabilities, complex integrations</p>
                <div className="text-red-600 font-bold">₹100,000+</div>
                <div className="text-gray-500 text-sm">8+ weeks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 text-white">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">
              Ready to Build Your Web Application?
            </h2>
            <p className="text-xl opacity-90">
              Let&apos;s discuss your project requirements and create a custom solution for your business.
            </p>
          </div>
          <ContactForm serviceType="Web Application" />
        </div>
      </section>
    </div>
  );
}
