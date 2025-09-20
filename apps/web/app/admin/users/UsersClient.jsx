"use client";
import { useEffect, useState } from 'react';
import { AdminAPI } from '../../lib/adminApi';
import { 
  Card, 
  Button, 
  FormInput,
  FormSelect,
  StatusBadge,
  PageHeader,
  EmptyState,
  LoadingSpinner,
  Tabs
} from '../components/ui';

export default function UsersClient() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('users');
  
  async function loadUsers() {
    try {
      setLoading(true);
      const data = await AdminAPI.listUsers();
      setUsers(data.items || []);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { loadUsers(); }, []);
  
  async function onPromote(e) {
    e.preventDefault();
    setMsg('');
    setStatus('');
    
    try {
      setLoading(true);
      await AdminAPI.promote(email, role);
      setMsg(`Successfully promoted ${email} to ${role}`);
      setStatus('success');
      setEmail('');
      await loadUsers();
    } catch(err) {
      setMsg(err.message || 'Failed to promote user');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }
  
  // Function to render role badges with appropriate colors
  function getRoleBadge(role) {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      technician: 'bg-green-100 text-green-800',
      customer: 'bg-gray-100 text-gray-800',
      content_moderator: 'bg-yellow-100 text-yellow-800',
    };
    
    const color = colors[role] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {role}
      </span>
    );
  }
  
  return (
    <div className="pb-6">
      <PageHeader
        title="User Management"
        description="Manage users and assign roles"
      />
      
      <Card className="mb-6">
        <Tabs
          tabs={[
            { id: 'users', label: 'All Users' },
            { id: 'promote', label: 'Promote User' }
          ]}
          activeTab={currentTab}
          onChange={setCurrentTab}
        />
      </Card>
      
      {currentTab === 'promote' && (
        <Card className="mb-6" title="Promote User">
          <form onSubmit={onPromote} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                type="email"
              />
              
              <FormSelect
                label="Role to Assign"
                value={role}
                onChange={e => setRole(e.target.value)}
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'technician', label: 'Technician' },
                  { value: 'content_moderator', label: 'Content Moderator' }
                ]}
              />
            </div>
            
            {msg && (
              <div className={`p-4 rounded-md ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {status === 'success' ? (
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{msg}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                  </svg>
                }
              >
                Promote User
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {currentTab === 'users' && (
        loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            title="No users found"
            description="There are no users in the system."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(u => (
              <Card key={u.id}>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                    {u.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{u.email}</h3>
                    <div className="text-sm text-gray-500 mb-3">
                      User ID: {u.id}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {(u.roles || []).length === 0 ? (
                        <span className="text-sm text-gray-500">No roles assigned</span>
                      ) : (
                        (u.roles || []).map((role, index) => (
                          <div key={index}>
                            {getRoleBadge(role)}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
}

