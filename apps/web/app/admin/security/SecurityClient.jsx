"use client";
import { useState } from 'react';
import { 
  PageHeader, 
  Card, 
  StatusBadge, 
  Button, 
  FormInput, 
  FormSelect,
  FormTextarea,
  Tabs,
  LoadingSpinner
} from '../components/ui';

export default function SecurityClient() {
  const [activeTab, setActiveTab] = useState('backup');
  const [loading, setLoading] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);
  
  // Tabs definition
  const tabs = [
    { id: 'backup', label: 'Backup & Restore' },
    { id: 'passwords', label: 'Password Policies' },
    { id: '2fa', label: 'Two-Factor Authentication' },
    { id: 'audit', label: 'Security Audit' }
  ];
  
  // Mock scheduled backups
  const scheduledBackups = [
    { id: 1, name: 'Daily Backup', frequency: 'Daily', time: '01:00 AM', lastRun: '2023-07-05 01:00 AM', status: 'SUCCESS' },
    { id: 2, name: 'Weekly Backup', frequency: 'Weekly', time: '02:00 AM (Sunday)', lastRun: '2023-07-02 02:00 AM', status: 'SUCCESS' },
    { id: 3, name: 'Monthly Backup', frequency: 'Monthly', time: '03:00 AM (1st day)', lastRun: '2023-07-01 03:00 AM', status: 'SUCCESS' }
  ];
  
  // Mock available backups
  const availableBackups = [
    { id: 1, date: '2023-07-05 01:00 AM', size: '256 MB', type: 'Automated', status: 'SUCCESS' },
    { id: 2, date: '2023-07-04 01:00 AM', size: '255 MB', type: 'Automated', status: 'SUCCESS' },
    { id: 3, date: '2023-07-03 01:00 AM', size: '253 MB', type: 'Automated', status: 'SUCCESS' },
    { id: 4, date: '2023-07-02 02:00 AM', size: '252 MB', type: 'Automated', status: 'SUCCESS' },
    { id: 5, date: '2023-07-01 12:35 PM', size: '251 MB', type: 'Manual', status: 'SUCCESS' }
  ];
  
  // Start manual backup
  const startBackup = () => {
    setBackupInProgress(true);
    setTimeout(() => {
      setBackupInProgress(false);
    }, 3000);
  };
  
  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader 
        title="Backup & Security" 
        description="Manage system backups, security policies, and authentication settings"
      />
      
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      {activeTab === 'backup' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card title="Create Backup">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">Manual Backup</h3>
                    <p className="text-sm text-gray-500 mt-1">Create a snapshot of the entire system</p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={startBackup}
                    disabled={backupInProgress}
                    icon={
                      backupInProgress ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                      )
                    }
                  >
                    {backupInProgress ? 'Backing up...' : 'Start Backup'}
                  </Button>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Backup includes database, files, and configuration. The system will remain operational during the backup process.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">Backup Destinations</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="local"
                        name="backup-destination"
                        type="radio"
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        defaultChecked
                      />
                      <label htmlFor="local" className="ml-2 block text-sm text-gray-700">
                        Local Storage
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="cloud"
                        name="backup-destination"
                        type="radio"
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="cloud" className="ml-2 block text-sm text-gray-700">
                        Cloud Storage (AWS S3)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="both"
                        name="backup-destination"
                        type="radio"
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="both" className="ml-2 block text-sm text-gray-700">
                        Both Local and Cloud
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card title="Restore System">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">System Restore</h3>
                    <p className="text-sm text-gray-500 mt-1">Restore from a previous backup</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Warning:</strong> Restoring from a backup will replace all current data. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                
                <FormSelect
                  label="Select Backup to Restore"
                  options={availableBackups.map(backup => ({
                    value: backup.id.toString(),
                    label: `${backup.date} (${backup.size}) - ${backup.type}`
                  }))}
                />
                
                <div className="flex items-center mt-4">
                  <input
                    id="confirm-restore"
                    name="confirm-restore"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="confirm-restore" className="ml-2 block text-sm text-gray-700">
                    I understand this will overwrite current data
                  </label>
                </div>
                
                <div className="pt-4">
                  <Button
                    variant="danger"
                    disabled={true}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    }
                  >
                    Restore System
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          <Card title="Scheduled Backups" className="mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Run
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scheduledBackups.map((backup) => (
                    <tr key={backup.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {backup.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {backup.frequency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {backup.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {backup.lastRun}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <StatusBadge status={backup.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          }
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <Card title="Available Backups">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {availableBackups.map((backup) => (
                    <tr key={backup.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {backup.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {backup.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {backup.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <StatusBadge status={backup.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                              </svg>
                            }
                          >
                            Download
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
      
      {activeTab === 'passwords' && (
        <Card title="Password Policy Settings">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="8"
                    max="24"
                    step="1"
                    defaultValue="12"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">12</span>
                </div>
              </div>
              
              <FormSelect
                label="Password Expiration"
                options={[
                  { value: 'never', label: 'Never' },
                  { value: '30', label: '30 days' },
                  { value: '60', label: '60 days' },
                  { value: '90', label: '90 days' },
                  { value: '180', label: '180 days' }
                ]}
                value="90"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Password Requirements</h3>
              
              <div className="flex items-center">
                <input
                  id="uppercase"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="uppercase" className="ml-2 block text-sm text-gray-700">
                  Require at least one uppercase letter
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="lowercase"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="lowercase" className="ml-2 block text-sm text-gray-700">
                  Require at least one lowercase letter
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="numbers"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="numbers" className="ml-2 block text-sm text-gray-700">
                  Require at least one number
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="special"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="special" className="ml-2 block text-sm text-gray-700">
                  Require at least one special character
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="history"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="history" className="ml-2 block text-sm text-gray-700">
                  Prevent reuse of last 5 passwords
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Account Lockout</h3>
              
              <div className="flex items-center">
                <input
                  id="lockout"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="lockout" className="ml-2 block text-sm text-gray-700">
                  Lock account after failed login attempts
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Failed Login Attempts Before Lockout"
                  type="number"
                  value="5"
                  min="1"
                  max="10"
                />
                
                <FormInput
                  label="Account Lockout Duration (minutes)"
                  type="number"
                  value="15"
                  min="5"
                  max="60"
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                variant="primary"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                }
              >
                Save Password Policies
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {activeTab === '2fa' && (
        <div className="space-y-6">
          <Card title="Two-Factor Authentication Settings">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Require 2FA for Admin Users</h3>
                  <p className="text-sm text-gray-500 mt-1">All administrator accounts must use two-factor authentication</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Enable 2FA for All Users</h3>
                  <p className="text-sm text-gray-500 mt-1">Require two-factor authentication for all user accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-base font-medium text-gray-900">Allowed 2FA Methods</h3>
                
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center">
                    <input
                      id="authenticator"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="authenticator" className="ml-2 block text-sm text-gray-700">
                      Authenticator App (TOTP)
                    </label>
                  </div>
                  <StatusBadge status="Recommended" />
                </div>
                
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center">
                    <input
                      id="sms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="sms" className="ml-2 block text-sm text-gray-700">
                      SMS Text Message
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center">
                    <input
                      id="email"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="email" className="ml-2 block text-sm text-gray-700">
                      Email
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center">
                    <input
                      id="security-key"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="security-key" className="ml-2 block text-sm text-gray-700">
                      Security Key (WebAuthn/FIDO2)
                    </label>
                  </div>
                  <StatusBadge status="Advanced" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <FormSelect
                  label="Verification Code Timeout"
                  options={[
                    { value: '1', label: '1 minute' },
                    { value: '5', label: '5 minutes' },
                    { value: '10', label: '10 minutes' },
                    { value: '15', label: '15 minutes' }
                  ]}
                  value="5"
                />
              </div>
              
              <div className="pt-4">
                <Button
                  variant="primary"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  }
                >
                  Save 2FA Settings
                </Button>
              </div>
            </div>
          </Card>
          
          <Card title="Reset 2FA for Users">
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Use this tool to reset two-factor authentication for users who are locked out of their accounts.
              </p>
            </div>
            
            <FormInput
              label="User Email"
              placeholder="Enter user email address"
            />
            
            <div className="flex mt-4">
              <Button
                variant="warning"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                }
              >
                Reset 2FA
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <Card title="Security Audit Status">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Authentication</h3>
                    <div className="mt-1 text-sm text-green-700">All checks passed</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
                    <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Data Encryption</h3>
                    <div className="mt-1 text-sm text-yellow-700">3 warnings</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Access Control</h3>
                    <div className="mt-1 text-sm text-red-700">1 critical issue</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-base font-medium text-gray-900">Security Issues</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Critical: Default admin credentials not changed</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>The default administrator account still uses the factory-set password.</p>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="danger"
                          size="sm"
                        >
                          Fix Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Warning: File encryption not enabled</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Customer files are being stored without encryption. Enable file encryption for better security.</p>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="warning"
                          size="sm"
                        >
                          Enable Encryption
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Warning: SSL certificate expires soon</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Your SSL certificate will expire in 15 days. Renew soon to avoid security warnings.</p>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="warning"
                          size="sm"
                        >
                          Renew Certificate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button
                variant="primary"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                }
              >
                Run Full Security Scan
              </Button>
            </div>
          </Card>
          
          <Card title="Security Configuration">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Security Headers</h3>
                  <p className="text-sm text-gray-500 mt-1">Enable security-related HTTP headers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-medium text-gray-900">CSRF Protection</h3>
                  <p className="text-sm text-gray-500 mt-1">Protect against Cross-Site Request Forgery attacks</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Rate Limiting</h3>
                  <p className="text-sm text-gray-500 mt-1">Protect against brute force attacks</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between pb-4">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Content Security Policy</h3>
                  <p className="text-sm text-gray-500 mt-1">Restrict which resources can be loaded</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button
                  variant="primary"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  }
                >
                  Save Security Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}