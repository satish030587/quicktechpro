'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckIcon, ClockIcon, ComputerIcon, GlobeIcon, BriefcaseIcon } from './Icons';

export default function BookingForm() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    type: 'remote',
    category: 'performance',
    details: '',
    address: '',
    name: '',
    contact: '',
    date: '',
    time: '',
    loading: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Redirect to thank you page with query parameters
      const params = new URLSearchParams({
        type: formState.type,
        category: formState.category,
        name: formState.name
      }).toString();
      
      router.push(`/thank-you/booking?${params}`);
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error: 'There was an error submitting your booking. Please try again.',
        loading: false,
      }));
    }
  };

  const generateAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 19; hour++) {
      times.push(`${hour}:00`);
      if (hour < 19) {
        times.push(`${hour}:30`);
      }
    }
    return times;
  };

  const availableTimes = generateAvailableTimes();
  const showAddressField = formState.type === 'onsite';

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        {/* Service Type Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Service Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'type', value: 'remote' } })}
              className={`flex flex-col items-center p-4 border rounded-md ${
                formState.type === 'remote'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <ComputerIcon className="h-6 w-6 mb-2" />
              <span className="font-medium">Remote Support</span>
              <span className="text-sm text-gray-600 mt-1">₹1,499</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'type', value: 'onsite' } })}
              className={`flex flex-col items-center p-4 border rounded-md ${
                formState.type === 'onsite'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <BriefcaseIcon className="h-6 w-6 mb-2" />
              <span className="font-medium">Onsite Visit</span>
              <span className="text-sm text-gray-600 mt-1">₹1,200</span>
            </button>

            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'type', value: 'web' } })}
              className={`flex flex-col items-center p-4 border rounded-md ${
                formState.type === 'web'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <GlobeIcon className="h-6 w-6 mb-2" />
              <span className="font-medium">Web Development</span>
              <span className="text-sm text-gray-600 mt-1">Custom Quote</span>
            </button>
          </div>
        </div>
        
        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="field">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Issue Category
            </label>
            <select
              id="category"
              name="category"
              value={formState.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="performance">Performance Issues</option>
              <option value="malware">Virus/Malware</option>
              <option value="software">Software Troubleshooting</option>
              <option value="network">Network</option>
              <option value="hardware">Hardware</option>
              <option value="web-project">Web Project</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Date*
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formState.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time*
              </label>
              <select
                id="time"
                name="time"
                value={formState.time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a time</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="field">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
              Details*
            </label>
            <textarea
              id="details"
              name="details"
              value={formState.details}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the problem or project in detail"
            />
          </div>

          {showAddressField && (
            <div className="field">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address (Onsite only)*
              </label>
              <input
                id="address"
                name="address"
                value={formState.address}
                onChange={handleChange}
                required={showAddressField}
                placeholder="Area / PIN code (Bangalore)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="field">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name*
              </label>
              <input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                placeholder="Full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="field">
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Contact*
              </label>
              <input
                id="contact"
                name="contact"
                value={formState.contact}
                onChange={handleChange}
                required
                placeholder="Phone or Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {formState.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">{formState.error}</p>
            </div>
          )}

          {/* Pricing Information */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Pricing Information</h3>
            {formState.type === 'remote' ? (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Remote Support:</strong> ₹1,499 for up to 1 hour of technical support.
                </p>
                <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
                  <li>Secure remote access to your computer</li>
                  <li>No fix, no fee guarantee</li>
                  <li>Additional time charged at ₹499 per 30 minutes</li>
                </ul>
              </div>
            ) : formState.type === 'onsite' ? (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Onsite Visit:</strong> ₹1,200 for consultation and diagnosis.
                </p>
                <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
                  <li>In-person service in Bangalore area</li>
                  <li>Consultation fee applied toward repair cost</li>
                  <li>Additional charges for parts and extended labor (with your approval)</li>
                </ul>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Web Development:</strong> Custom quote based on project requirements.
                </p>
                <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
                  <li>Free initial consultation and estimate</li>
                  <li>Responsive design and development</li>
                  <li>Ongoing maintenance and support packages available</li>
                </ul>
              </div>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={formState.loading}
              className={`w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                formState.loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {formState.loading ? 'Processing...' : 'Submit Booking'}
            </button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            By booking a service, you agree to our <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}

