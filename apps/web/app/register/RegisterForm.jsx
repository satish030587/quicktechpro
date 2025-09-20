"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers';
import Link from 'next/link';

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ 
    email: '', 
    name: '', 
    phone: '', 
    password: '', 
    acceptPrivacy: false, 
    marketingEmailOptIn: false, 
    marketingSmsOptIn: false 
  });
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(s => ({ ...s, [k]: v }));

  async function onSubmit(e) {
    e.preventDefault(); 
    setError('');
    setLoading(true);
    
    try {
      if (!form.acceptPrivacy) throw new Error('Please accept the privacy policy');
      await register(form);
      setOk(true);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) { 
      setError(err.message || 'Registration failed'); 
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full mx-auto px-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 h-1 w-full"></div>
        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="John Smith"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="+91 98765 43210"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="••••••••"
              />
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptPrivacy"
                    type="checkbox"
                    checked={form.acceptPrivacy}
                    onChange={e => update('acceptPrivacy', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptPrivacy" className="text-gray-700">
                    I accept the {' '}
                    <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-500" target="_blank">
                      privacy policy
                    </Link>
                  </label>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Marketing preferences (optional)</p>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="marketingEmailOptIn"
                        type="checkbox"
                        checked={form.marketingEmailOptIn}
                        onChange={e => update('marketingEmailOptIn', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketingEmailOptIn" className="text-gray-700">
                        Email me about new services and special offers
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="marketingSmsOptIn"
                        type="checkbox"
                        checked={form.marketingSmsOptIn}
                        onChange={e => update('marketingSmsOptIn', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketingSmsOptIn" className="text-gray-700">
                        Send me SMS updates about my services
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {ok && (
              <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
                Account created successfully! Redirecting you to login...
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

