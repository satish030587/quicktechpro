"use client";
import { useEffect, useState } from 'react';
import { CustomerAPI } from '../../lib/customerApi';

export default function ProfileClient() {
  const [profile, setProfile] = useState({ 
    email: '', 
    name: '', 
    phone: '', 
    marketingEmailOptIn: false, 
    marketingSmsOptIn: false 
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => { 
    CustomerAPI.profile().then(setProfile).catch(() => {}); 
  }, []);
  
  const updateField = (key, value) => {
    setProfile(prev => ({...prev, [key]: value}));
  };
  
  async function saveProfile() {
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      
      await CustomerAPI.saveProfile({ 
        name: profile.name, 
        phone: profile.phone, 
        marketingEmailOptIn: profile.marketingEmailOptIn, 
        marketingSmsOptIn: profile.marketingSmsOptIn 
      });
      
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your personal information and preferences</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email || ''}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Your email cannot be changed</p>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={profile.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={profile.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketingEmailOptIn"
                  checked={profile.marketingEmailOptIn || false}
                  onChange={(e) => updateField('marketingEmailOptIn', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="marketingEmailOptIn" className="ml-2 block text-sm text-gray-700">
                  Receive email offers, promotions, and updates about new services
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketingSmsOptIn"
                  checked={profile.marketingSmsOptIn || false}
                  onChange={(e) => updateField('marketingSmsOptIn', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="marketingSmsOptIn" className="ml-2 block text-sm text-gray-700">
                  Receive SMS notifications for appointment reminders and updates
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                {message.text && (
                  <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message.text}
                  </p>
                )}
              </div>
              <button
                onClick={saveProfile}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

