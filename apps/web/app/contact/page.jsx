import ContactForm from "./ContactForm";

export const metadata = { title: "Contact Us | QuickTechPro" };

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="layout-container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
            <p className="text-lg text-gray-600 mb-8">
              Need technical support or have questions about our services? We are here to help.
              Our team responds within 2 hours during business hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-gray-50 py-16">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Business Information */}
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Phone & WhatsApp</h3>
                    <p className="text-gray-600">+91-XXXXXXXXXX</p>
                    <p className="text-gray-600">+91-XXXXXXXXXX (WhatsApp)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">support@quicktechpro.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday – Saturday: 9 AM – 7 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">Bangalore, Karnataka</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 rounded-lg overflow-hidden">
                <iframe 
                  title="Map" 
                  src="https://www.google.com/maps?q=Bangalore&output=embed" 
                  className="w-full h-64 border-0" 
                  loading="lazy" 
                  allowFullScreen
                />
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="w-full bg-white py-16">
        <div className="layout-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Have questions about our services? Find quick answers to common queries below.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                question: "How quickly can you respond to IT emergencies?",
                answer: "For urgent issues, we aim to provide immediate remote assistance and can typically be on-site within 2-4 hours in Bangalore."
              },
              {
                question: "Do you offer service contracts or pay-as-you-go options?",
                answer: "Yes, we provide both flexible service contracts with regular maintenance and pay-as-you-need support options."
              },
              {
                question: "What areas do you service for on-site support?",
                answer: "We provide on-site support throughout Bangalore and surrounding areas. Remote support is available nationwide."
              },
              {
                question: "Do you work with both individuals and businesses?",
                answer: "Yes, we serve both individual clients and businesses of all sizes, from startups to established companies."
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full bg-blue-600 py-12">
        <div className="w-full text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need urgent tech support?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't wait! Call us now for immediate assistance with your computer issues or IT emergencies.
          </p>
          <div className="inline-flex items-center justify-center bg-white rounded-full px-6 py-3 text-blue-600 font-bold text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +91-XXXXXXXXXX
          </div>
        </div>
      </section>
    </>
  );
}




