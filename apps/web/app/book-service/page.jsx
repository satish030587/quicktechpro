import BookingForm from "../components/BookingForm";
import { CheckCircleIcon } from "../components/Icons";

export const metadata = { title: "Book a Service | QuickTechPro" };

export default function BookServicePage() {
  return (
    <div className="layout-container py-12 sm:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Book a Service</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Schedule a service with our expert technicians. Whether you need remote support, 
          an onsite visit, or web development services, we're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="text-blue-600 mb-4">
            <CheckCircleIcon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Technicians</h3>
          <p className="text-gray-600">
            Our certified technicians have years of experience solving complex technical issues.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="text-blue-600 mb-4">
            <CheckCircleIcon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Guaranteed Solutions</h3>
          <p className="text-gray-600">
            We offer a no-fix, no-fee guarantee on our services. Your satisfaction is our priority.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="text-blue-600 mb-4">
            <CheckCircleIcon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Response</h3>
          <p className="text-gray-600">
            Book today and get same-day or next-day service based on availability and urgency.
          </p>
        </div>
      </div>

      <BookingForm />

      <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">How does remote support work?</h3>
            <p className="text-gray-600">
              Our technicians connect to your computer securely over the internet using industry-standard 
              remote access software. You'll receive simple instructions to grant access, and you can watch 
              as we diagnose and fix your issues in real-time.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">What areas do you cover for onsite support?</h3>
            <p className="text-gray-600">
              We currently provide onsite IT support services throughout Bangalore and surrounding areas. 
              Travel fees may apply for locations outside central Bangalore.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">What's included in the web development service?</h3>
            <p className="text-gray-600">
              Our web development services include custom website design, e-commerce solutions, content management 
              systems, website maintenance, and ongoing support. We'll provide a detailed quote based on your specific requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

