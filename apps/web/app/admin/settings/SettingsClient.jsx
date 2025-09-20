"use client";
import { useEffect, useState } from 'react';
import { AdminAPI } from '../../lib/adminApi';
import { 
  PageHeader, 
  Card, 
  Button, 
  FormInput,
  Tabs,
  LoadingSpinner
} from '../components/ui';

export default function SettingsClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('business');
  const [settings, setSettings] = useState({
    BUSINESS_NAME: '', 
    BUSINESS_EMAIL: '', 
    BUSINESS_PHONE: '', 
    HOURS: '',
    BUSINESS_ADDRESS: '',
    BUSINESS_WEBSITE: '',
    TAX_ID: ''
  });
  
  const [integrations, setIntegrations] = useState({
    RAZORPAY: { key: '', secret: '' }, 
    SENDGRID: { apiKey: '' }, 
    MSG91: { apiKey: '' },
    GOOGLE: { apiKey: '' },
    TWILIO: { accountSid: '', authToken: '' }
  });
  
  // Tabs definition
  const tabs = [
    { id: 'business', label: 'Business Profile' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'advanced', label: 'Advanced' }
  ];
  
  async function load() {
    setLoading(true);
    try {
      const r = await AdminAPI.settingsGet();
      const s = Object.fromEntries((r.settings || []).map((x) => [x.key, x.value]));
      const i = Object.fromEntries((r.integrations || []).map((x) => [x.key, x.jsonValue]));
      setSettings(sPrev => ({ ...sPrev, ...s }));
      setIntegrations(iPrev => ({ ...iPrev, ...i }));
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { load(); }, []);
  
  const updateSetting = (key, value) => setSettings(s => ({ ...s, [key]: value }));
  
  const updateIntegration = (key, value) => 
    setIntegrations(s => ({ ...s, [key]: { ...s[key], ...value } }));
  
  async function saveSettings() {
    setSaving(true);
    try {
      await AdminAPI.settingsSave({
        settings: Object.entries(settings)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => ({ key, value })),
        integrations: Object.entries(integrations)
          .filter(([, value]) => Object.values(value).some(v => v !== ''))
          .map(([key, jsonValue]) => ({ key, jsonValue }))
      });
      // Show success notification
    } catch (error) {
      console.error("Error saving settings:", error);
      // Show error notification
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader 
        title="System Settings" 
        description="Configure your business profile and system integrations"
        actions={[
          <Button 
            key="save"
            variant="primary"
            onClick={saveSettings}
            disabled={saving}
            icon={
              saving ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )
            }
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        ]}
      />
      
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      {activeTab === 'business' && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Business Name"
              id="business_name"
              value={settings.BUSINESS_NAME || ''}
              onChange={(e) => updateSetting('BUSINESS_NAME', e.target.value)}
              placeholder="Your business name"
            />
            
            <FormInput
              label="Business Email"
              id="business_email"
              type="email"
              value={settings.BUSINESS_EMAIL || ''}
              onChange={(e) => updateSetting('BUSINESS_EMAIL', e.target.value)}
              placeholder="contact@example.com"
            />
            
            <FormInput
              label="Business Phone"
              id="business_phone"
              value={settings.BUSINESS_PHONE || ''}
              onChange={(e) => updateSetting('BUSINESS_PHONE', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
            
            <FormInput
              label="Business Hours"
              id="business_hours"
              value={settings.HOURS || ''}
              onChange={(e) => updateSetting('HOURS', e.target.value)}
              placeholder="Mon-Fri: 9AM-5PM, Sat: 10AM-2PM"
            />
            
            <FormInput
              label="Business Address"
              id="business_address"
              value={settings.BUSINESS_ADDRESS || ''}
              onChange={(e) => updateSetting('BUSINESS_ADDRESS', e.target.value)}
              placeholder="123 Main St, City, State, ZIP"
              className="md:col-span-2"
            />
            
            <FormInput
              label="Business Website"
              id="business_website"
              value={settings.BUSINESS_WEBSITE || ''}
              onChange={(e) => updateSetting('BUSINESS_WEBSITE', e.target.value)}
              placeholder="https://example.com"
            />
            
            <FormInput
              label="Tax ID / GST Number"
              id="tax_id"
              value={settings.TAX_ID || ''}
              onChange={(e) => updateSetting('TAX_ID', e.target.value)}
              placeholder="Enter your tax ID or GST number"
            />
          </div>
        </Card>
      )}
      
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <Card title="Payment Gateways">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Razorpay Key"
                id="razorpay_key"
                value={integrations.RAZORPAY?.key || ''}
                onChange={(e) => updateIntegration('RAZORPAY', { key: e.target.value })}
                placeholder="rzp_live_xxxxxxxxxxxx"
              />
              
              <FormInput
                label="Razorpay Secret"
                id="razorpay_secret"
                type="password"
                value={integrations.RAZORPAY?.secret || ''}
                onChange={(e) => updateIntegration('RAZORPAY', { secret: e.target.value })}
                placeholder="••••••••••••••••••••••"
              />
            </div>
          </Card>
          
          <Card title="Communication Services">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="SendGrid API Key"
                id="sendgrid_api_key"
                type="password"
                value={integrations.SENDGRID?.apiKey || ''}
                onChange={(e) => updateIntegration('SENDGRID', { apiKey: e.target.value })}
                placeholder="SG.••••••••••••••••••••••"
              />
              
              <FormInput
                label="MSG91 API Key"
                id="msg91_api_key"
                type="password"
                value={integrations.MSG91?.apiKey || ''}
                onChange={(e) => updateIntegration('MSG91', { apiKey: e.target.value })}
                placeholder="••••••••••••••••••••••"
              />
              
              <FormInput
                label="Twilio Account SID"
                id="twilio_account_sid"
                value={integrations.TWILIO?.accountSid || ''}
                onChange={(e) => updateIntegration('TWILIO', { accountSid: e.target.value })}
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
              
              <FormInput
                label="Twilio Auth Token"
                id="twilio_auth_token"
                type="password"
                value={integrations.TWILIO?.authToken || ''}
                onChange={(e) => updateIntegration('TWILIO', { authToken: e.target.value })}
                placeholder="••••••••••••••••••••••"
              />
            </div>
          </Card>
          
          <Card title="Maps & Location">
            <FormInput
              label="Google Maps API Key"
              id="google_api_key"
              type="password"
              value={integrations.GOOGLE?.apiKey || ''}
              onChange={(e) => updateIntegration('GOOGLE', { apiKey: e.target.value })}
              placeholder="AIza••••••••••••••••••••••"
            />
          </Card>
        </div>
      )}
      
      {activeTab === 'notifications' && (
        <Card title="Notification Settings">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Notify users via email for important events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.EMAIL_NOTIFICATIONS === 'true'} onChange={(e) => updateSetting('EMAIL_NOTIFICATIONS', e.target.checked ? 'true' : 'false')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-500">Send SMS notifications for critical updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.SMS_NOTIFICATIONS === 'true'} onChange={(e) => updateSetting('SMS_NOTIFICATIONS', e.target.checked ? 'true' : 'false')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Admin Alerts</h3>
                <p className="text-sm text-gray-500">Send alerts to administrators for system events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.ADMIN_ALERTS === 'true'} onChange={(e) => updateSetting('ADMIN_ALERTS', e.target.checked ? 'true' : 'false')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>
      )}
      
      {activeTab === 'appearance' && (
        <Card title="Appearance Settings">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
              <div className="flex items-center space-x-4">
                {['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(color => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer ${settings.PRIMARY_COLOR === color ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateSetting('PRIMARY_COLOR', color)}
                  ></div>
                ))}
                <input
                  type="color"
                  value={settings.PRIMARY_COLOR || '#2563EB'}
                  onChange={(e) => updateSetting('PRIMARY_COLOR', e.target.value)}
                  className="w-8 h-8 p-0 border-0 rounded-full cursor-pointer"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              <div className="flex items-center">
                {settings.LOGO_URL && (
                  <div className="mr-4">
                    <img src={settings.LOGO_URL} alt="Business Logo" className="h-10 w-auto" />
                  </div>
                )}
                <Button
                  variant="secondary"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  }
                >
                  Upload Logo
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme Mode</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={settings.THEME_MODE !== 'dark'}
                    onChange={() => updateSetting('THEME_MODE', 'light')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Light</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={settings.THEME_MODE === 'dark'}
                    onChange={() => updateSetting('THEME_MODE', 'dark')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Dark</span>
                </label>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {activeTab === 'advanced' && (
        <Card title="Advanced Settings">
          <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Maintenance Mode</h3>
              <p className="text-sm text-gray-500 mb-2">Enable maintenance mode to temporarily block access to the portal</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.MAINTENANCE_MODE === 'true'} onChange={(e) => updateSetting('MAINTENANCE_MODE', e.target.checked ? 'true' : 'false')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">{settings.MAINTENANCE_MODE === 'true' ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>
            
            <div className="pb-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-1">System Email</h3>
              <p className="text-sm text-gray-500 mb-2">Email address for system notifications and alerts</p>
              <FormInput
                value={settings.SYSTEM_EMAIL || ''}
                onChange={(e) => updateSetting('SYSTEM_EMAIL', e.target.value)}
                placeholder="system@example.com"
              />
            </div>
            
            <div className="pb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Debug Mode</h3>
              <p className="text-sm text-gray-500 mb-2">Enable detailed logging for troubleshooting (may affect performance)</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.DEBUG_MODE === 'true'} onChange={(e) => updateSetting('DEBUG_MODE', e.target.checked ? 'true' : 'false')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">{settings.DEBUG_MODE === 'true' ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="danger"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                }
              >
                Reset to Default Settings
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

