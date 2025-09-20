'use client';

import { useState } from 'react';
import { 
  PageHeader, 
  Card, 
  StatusBadge, 
  Button, 
  FormInput, 
  FormSelect,
  FormTextarea,
  Tabs
} from '../components/ui';

export default function IntegrationsClient() {
  const [activeTab, setActiveTab] = useState('payment');
  const [testLoading, setTestLoading] = useState(false);
  
  // Tabs definition
  const tabs = [
    { id: 'payment', label: 'Payment Gateways' },
    { id: 'email', label: 'Email Services' },
    { id: 'sms', label: 'SMS Services' },
    { id: 'maps', label: 'Maps & Location' },
    { id: 'analytics', label: 'Analytics & Tracking' },
    { id: 'social', label: 'Social Media' }
  ];
  
  // Mock integration statuses
  const integrationStatus = {
    razorpay: 'active',
    stripe: 'inactive',
    sendgrid: 'active',
    mailchimp: 'inactive',
    msg91: 'active',
    twilio: 'inactive',
    googleMaps: 'active',
    googleAnalytics: 'active',
    facebook: 'inactive',
    twitter: 'inactive'
  };
  
  // Test connection function
  const testConnection = (service) => {
    setTestLoading(true);
    setTimeout(() => {
      setTestLoading(false);
      alert(`Connection to ${service} tested successfully!`);
    }, 2000);
  };
  
  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader 
        title="Integrations" 
        description="Connect your QuickTechPro portal with third-party services and APIs"
      />
      
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      {activeTab === 'payment' && (
        <div className="space-y-6 mt-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src="/images/razorpay-logo.svg" alt="Razorpay" className="h-8 w-auto mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Razorpay</h3>
                  <p className="text-sm text-gray-500">Process payments in Indian Rupees</p>
                </div>
              </div>
              <StatusBadge status={integrationStatus.razorpay === 'active' ? 'active' : 'inactive'} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="API Key"
                type="password"
                value="rzp_test_1234567890abcdef"
              />
              
              <FormInput
                label="API Secret"
                type="password"
                value="••••••••••••••••"
              />
              
              <FormSelect
                label="Mode"
                options={[
                  { value: 'test', label: 'Test Mode' },
                  { value: 'live', label: 'Live Mode' }
                ]}
                value="test"
              />
              
              <FormSelect
                label="Webhook Enabled"
                options={[
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' }
                ]}
                value="true"
              />
              
              <div className="md:col-span-2">
                <FormTextarea
                  label="Webhook URL"
                  value="https://quicktechpro.com/api/webhooks/razorpay"
                  rows={1}
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Copy this URL to your Razorpay Dashboard &gt; Settings &gt; Webhooks section.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => testConnection('Razorpay')}
                disabled={testLoading}
                icon={
                  testLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null
                }
              >
                Test Connection
              </Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src="/images/stripe-logo.svg" alt="Stripe" className="h-8 w-auto mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Stripe</h3>
                  <p className="text-sm text-gray-500">Process international payments</p>
                </div>
              </div>
              <StatusBadge status={integrationStatus.stripe === 'active' ? 'active' : 'inactive'} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Publishable Key"
                placeholder="pk_test_..."
              />
              
              <FormInput
                label="Secret Key"
                type="password"
                placeholder="sk_test_..."
              />
              
              <FormSelect
                label="Mode"
                options={[
                  { value: 'test', label: 'Test Mode' },
                  { value: 'live', label: 'Live Mode' }
                ]}
                value="test"
              />
              
              <FormSelect
                label="Webhook Enabled"
                options={[
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' }
                ]}
                value="false"
              />
              
              <div className="md:col-span-2">
                <FormTextarea
                  label="Webhook URL"
                  value="https://quicktechpro.com/api/webhooks/stripe"
                  rows={1}
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Copy this URL to your Stripe Dashboard &gt; Developers &gt; Webhooks section.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => testConnection('Stripe')}
                disabled={testLoading}
              >
                Test Connection
              </Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
        </div>
      )}
      
      {activeTab === 'email' && (
        <div className="space-y-6 mt-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src="/images/sendgrid-logo.svg" alt="SendGrid" className="h-8 w-auto mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">SendGrid</h3>
                  <p className="text-sm text-gray-500">Transactional emails and marketing campaigns</p>
                </div>
              </div>
              <StatusBadge status={integrationStatus.sendgrid === 'active' ? 'active' : 'inactive'} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="API Key"
                type="password"
                value="SG.xxxxxxxxxxxxxxxxxxxxxxxx"
              />
              
              <FormInput
                label="From Email"
                type="email"
                value="noreply@quicktechpro.com"
              />
              
              <FormInput
                label="From Name"
                value="QuickTechPro Support"
              />
              
              <FormSelect
                label="Track Opens & Clicks"
                options={[
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' }
                ]}
                value="true"
              />
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Email Templates</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium">Welcome Email</h5>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Sent when a new user registers</p>
                    <Button variant="secondary" size="xs">Edit Template</Button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium">Password Reset</h5>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Sent when user requests password reset</p>
                    <Button variant="secondary" size="xs">Edit Template</Button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium">Appointment Confirmation</h5>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Sent after booking confirmation</p>
                    <Button variant="secondary" size="xs">Edit Template</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => testConnection('SendGrid')}
                disabled={testLoading}
              >
                Send Test Email
              </Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src="/images/mailchimp-logo.svg" alt="Mailchimp" className="h-8 w-auto mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Mailchimp</h3>
                  <p className="text-sm text-gray-500">Email marketing campaigns and automation</p>
                </div>
              </div>
              <StatusBadge status={integrationStatus.mailchimp === 'active' ? 'active' : 'inactive'} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="API Key"
                type="password"
                placeholder="Enter Mailchimp API key"
              />
              
              <FormInput
                label="Server Prefix"
                placeholder="us1"
              />
              
              <div className="md:col-span-2">
                <FormSelect
                  label="Default List/Audience"
                  options={[
                    { value: '', label: 'Select a list' },
                    { value: 'list1', label: 'QuickTechPro Customers' },
                    { value: 'list2', label: 'Newsletter Subscribers' }
                  ]}
                  value=""
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => testConnection('Mailchimp')}
                disabled={testLoading}
              >
                Test Connection
              </Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
        </div>
      )}
      
      {activeTab === 'sms' && (
        <div className="space-y-6 mt-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src="/images/msg91-logo.svg" alt="MSG91" className="h-8 w-auto mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">MSG91</h3>
                  <p className="text-sm text-gray-500">SMS notifications for Indian customers</p>
                </div>
              </div>
              <StatusBadge status={integrationStatus.msg91 === 'active' ? 'active' : 'inactive'} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Authentication Key"
                type="password"
                value="123456789012345678901234"
              />
              
              <FormInput
                label="Sender ID"
                value="QCKPRO"
                maxLength={6}
              />
              
              <FormSelect
                label="Route"
                options={[
                  { value: '4', label: 'Transactional' },
                  { value: '1', label: 'Promotional' }
                ]}
                value="4"
              />
              
              <FormSelect
                label="SMS Type"
                options={[
                  { value: 'text', label: 'Text' },
                  { value: 'unicode', label: 'Unicode' }
                ]}
                value="text"
              />
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">SMS Templates</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium">OTP Verification</h5>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Your QuickTechPro verification code is {"{#code#}"}. Valid for 10 minutes.</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium">Appointment Reminder</h5>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Reminder: Your appointment with QuickTechPro is scheduled for {"{#date#}"} at {"{#time#}"}.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => testConnection('MSG91')}
                disabled={testLoading}
              >
                Send Test SMS
              </Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src="/images/twilio-logo.svg" alt="Twilio" className="h-8 w-auto mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Twilio</h3>
                  <p className="text-sm text-gray-500">Global SMS and voice services</p>
                </div>
              </div>
              <StatusBadge status={integrationStatus.twilio === 'active' ? 'active' : 'inactive'} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Account SID"
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
              
              <FormInput
                label="Auth Token"
                type="password"
                placeholder="Enter Auth Token"
              />
              
              <FormInput
                label="From Number"
                placeholder="+1xxxxxxxxxx"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Messaging Service SID (Optional)</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => testConnection('Twilio')}
                disabled={testLoading}
              >
                Test Connection
              </Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
        </div>
      )}
      
      {activeTab === 'maps' && (
        <div className="space-y-6 mt-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src="/images/google-maps-logo.svg" alt="Google Maps" className="h-8 w-auto mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Google Maps</h3>
                  <p className="text-sm text-gray-500">Location services and mapping</p>
                </div>
              </div>
              <StatusBadge status={integrationStatus.googleMaps === 'active' ? 'active' : 'inactive'} />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <FormInput
                label="API Key"
                type="password"
                value="AIza••••••••••••••••••••••••••••••"
              />
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Enabled APIs</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="maps-js"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="maps-js" className="ml-2 block text-sm text-gray-700">
                      Maps JavaScript API
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="places"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="places" className="ml-2 block text-sm text-gray-700">
                      Places API
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="geocoding"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="geocoding" className="ml-2 block text-sm text-gray-700">
                      Geocoding API
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="directions"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="directions" className="ml-2 block text-sm text-gray-700">
                      Directions API
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Map Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormSelect
                    label="Default Map Type"
                    options={[
                      { value: 'roadmap', label: 'Road Map' },
                      { value: 'satellite', label: 'Satellite' },
                      { value: 'hybrid', label: 'Hybrid' },
                      { value: 'terrain', label: 'Terrain' }
                    ]}
                    value="roadmap"
                  />
                  
                  <FormSelect
                    label="Map Style"
                    options={[
                      { value: 'default', label: 'Default' },
                      { value: 'silver', label: 'Silver' },
                      { value: 'retro', label: 'Retro' },
                      { value: 'dark', label: 'Dark' },
                      { value: 'night', label: 'Night' },
                      { value: 'custom', label: 'Custom' }
                    ]}
                    value="default"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => testConnection('Google Maps')}
                disabled={testLoading}
              >
                Test Connection
              </Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
        </div>
      )}
      
      {activeTab === 'analytics' && (
        <div className="space-y-6 mt-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src="/images/google-analytics-logo.svg" alt="Google Analytics" className="h-8 w-auto mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Google Analytics</h3>
                  <p className="text-sm text-gray-500">Website traffic and user behavior analytics</p>
                </div>
              </div>
              <StatusBadge status={integrationStatus.googleAnalytics === 'active' ? 'active' : 'inactive'} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormInput
                  label="Measurement ID (GA4)"
                  value="G-XXXXXXXXXX"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can find this in your Google Analytics admin under Data Streams.
                </p>
              </div>
              
              <FormSelect
                label="User ID Tracking"
                options={[
                  { value: 'enabled', label: 'Enabled' },
                  { value: 'disabled', label: 'Disabled' }
                ]}
                value="enabled"
              />
              
              <FormSelect
                label="IP Anonymization"
                options={[
                  { value: 'enabled', label: 'Enabled' },
                  { value: 'disabled', label: 'Disabled' }
                ]}
                value="enabled"
              />
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Event Tracking</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="page_view"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="page_view" className="ml-2 block text-sm text-gray-700">
                    Page Views
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="clicks"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="clicks" className="ml-2 block text-sm text-gray-700">
                    Button Clicks
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="form_submit"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="form_submit" className="ml-2 block text-sm text-gray-700">
                    Form Submissions
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="ecommerce"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="ecommerce" className="ml-2 block text-sm text-gray-700">
                    E-commerce Transactions
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="scroll"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="scroll" className="ml-2 block text-sm text-gray-700">
                    Scroll Depth
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src="/images/facebook-pixel-logo.svg" alt="Facebook Pixel" className="h-8 w-auto mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Facebook Pixel</h3>
                  <p className="text-sm text-gray-500">Track conversions from Facebook ads</p>
                </div>
              </div>
              <StatusBadge status="inactive" />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <FormInput
                label="Pixel ID"
                placeholder="Enter your Facebook Pixel ID"
              />
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="fb_page_view"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fb_page_view" className="ml-2 block text-sm text-gray-700">
                    Track PageView
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="fb_purchase"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fb_purchase" className="ml-2 block text-sm text-gray-700">
                    Track Purchase
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="fb_lead"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fb_lead" className="ml-2 block text-sm text-gray-700">
                    Track Lead
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
        </div>
      )}
      
      {activeTab === 'social' && (
        <div className="space-y-6 mt-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src="/images/facebook-logo.svg" alt="Facebook" className="h-8 w-auto mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Facebook</h3>
                  <p className="text-sm text-gray-500">Share content and login with Facebook</p>
                </div>
              </div>
              <StatusBadge status={integrationStatus.facebook === 'active' ? 'active' : 'inactive'} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="App ID"
                placeholder="Enter Facebook App ID"
              />
              
              <FormInput
                label="App Secret"
                type="password"
                placeholder="Enter Facebook App Secret"
              />
              
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="fb_login"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="fb_login" className="ml-2 block text-sm text-gray-700">
                      Enable Facebook Login
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="fb_share"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="fb_share" className="ml-2 block text-sm text-gray-700">
                      Enable Share to Facebook
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="fb_comments"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="fb_comments" className="ml-2 block text-sm text-gray-700">
                      Enable Facebook Comments
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => testConnection('Facebook')}
                disabled={testLoading}
              >
                Test Connection
              </Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src="/images/twitter-logo.svg" alt="Twitter" className="h-8 w-auto mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Twitter</h3>
                  <p className="text-sm text-gray-500">Share content and login with Twitter</p>
                </div>
              </div>
              <StatusBadge status={integrationStatus.twitter === 'active' ? 'active' : 'inactive'} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="API Key"
                placeholder="Enter Twitter API Key"
              />
              
              <FormInput
                label="API Secret"
                type="password"
                placeholder="Enter Twitter API Secret"
              />
              
              <FormInput
                label="Access Token"
                placeholder="Enter Twitter Access Token"
              />
              
              <FormInput
                label="Access Token Secret"
                type="password"
                placeholder="Enter Twitter Access Token Secret"
              />
              
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="tw_login"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tw_login" className="ml-2 block text-sm text-gray-700">
                      Enable Twitter Login
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="tw_share"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tw_share" className="ml-2 block text-sm text-gray-700">
                      Enable Tweet Button
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="tw_timeline"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tw_timeline" className="ml-2 block text-sm text-gray-700">
                      Enable Twitter Timeline
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => testConnection('Twitter')}
                disabled={testLoading}
              >
                Test Connection
              </Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
