'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckIcon, ClockIcon } from '../../components/Icons';

export default function BookingThankYouContent() {
  const searchParams = useSearchParams();
  const [bookingInfo, setBookingInfo] = useState({
    type: '',
    category: '',
    name: '',
  });

  useEffect(() => {
    setBookingInfo({
      type: searchParams.get('type') || 'service',
      category: searchParams.get('category') || '',
      name: searchParams.get('name') || 'valued customer',
    });
  }, [searchParams]);

  const getServiceTypeLabel = () => {
    switch(bookingInfo.type) {
      case 'remote': return 'Remote Support';
      case 'onsite': return 'Onsite Visit';
      case 'web': return 'Web Development';
      default: return 'Service';
    }
  };

  return (
    <div className="layout-container py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
            <p className="mt-2 text-gray-600">
              Thank you, {bookingInfo.name}, for booking a {getServiceTypeLabel()} with QuickTechPro.
            </p>
            
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4">
              <div className="flex items-center justify-center space-x-2 text-gray-700 mb-2">
                <ClockIcon className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Next Steps</span>
              </div>
              <p className="text-sm text-gray-600">
                We've received your booking details and a confirmation email has been sent. 
                One of our technicians will contact you shortly to confirm your appointment 
                and provide any additional information needed.
              </p>
            </div>
            
            <div className="mt-6 p-4 border border-blue-100 bg-blue-50 rounded-md text-sm text-blue-800">
              <p>
                <strong>Urgent support needed?</strong> Call our help desk at <strong>+91 80 4123 5678</strong> for immediate assistance.
              </p>
            </div>
            
            <div className="mt-8 space-y-4">
              <div>
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Return to Home
                </Link>
              </div>
              <div>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
