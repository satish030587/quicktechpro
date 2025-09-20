"use client";
import { useEffect, useState } from 'react';
import { AdminAPI } from '../../lib/adminApi';
import { 
  PageHeader, 
  Card, 
  StatusBadge, 
  Button, 
  FormInput,
  FormSelect,
  EmptyState,
  LoadingSpinner
} from '../components/ui';

export default function AppointmentsClient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ 
    ticketId: '', 
    scheduledAt: '', 
    durationMins: 60, 
    address: '' 
  });
  
  async function load() { 
    setLoading(true);
    try {
      const r = await AdminAPI.appointments({}); 
      setItems(r.items || []); 
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { load(); }, []);
  
  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  
  async function createAppointment(e) { 
    e.preventDefault(); 
    setLoading(true);
    try {
      await AdminAPI.createAppointment(form); 
      setForm({ 
        ticketId: '', 
        scheduledAt: '', 
        durationMins: 60, 
        address: '' 
      }); 
      await load(); 
    } catch (error) {
      console.error("Error creating appointment:", error);
    } finally {
      setLoading(false);
    }
  }
  
  // Helper to format date
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  
  // Duration options for the select
  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
  ];

  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader 
        title="Appointments" 
        description="Schedule and manage customer appointments"
        actions={[
          <Button 
            key="calendar"
            variant="secondary"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            }
          >
            Calendar View
          </Button>
        ]}
      />
      
      {/* New Appointment Form */}
      <Card 
        title="Create New Appointment" 
        className="mb-6"
        footer={
          <div className="flex justify-end">
            <Button 
              type="submit"
              form="create-appointment-form"
              variant="primary"
              disabled={loading}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              }
            >
              Create Appointment
            </Button>
          </div>
        }
      >
        <form id="create-appointment-form" onSubmit={createAppointment}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Ticket ID"
              id="ticketId"
              value={form.ticketId}
              onChange={(e) => updateField('ticketId', e.target.value)}
              placeholder="Enter ticket ID"
              required
            />
            
            <FormInput
              label="Scheduled Date & Time"
              id="scheduledAt"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => updateField('scheduledAt', e.target.value)}
              required
            />
            
            <FormSelect
              label="Duration"
              id="durationMins"
              value={form.durationMins}
              onChange={(e) => updateField('durationMins', Number(e.target.value))}
              options={durationOptions}
            />
            
            <FormInput
              label="Address"
              id="address"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Customer address (optional)"
            />
          </div>
        </form>
      </Card>
      
      {/* Appointments List */}
      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description="There are no appointments scheduled yet."
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          }
          action={
            <Button
              variant="primary"
              onClick={() => document.getElementById('create-appointment-form').scrollIntoView({ behavior: 'smooth' })}
            >
              Schedule Your First Appointment
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(appointment => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="text-lg font-medium text-gray-900 mb-1">
                    {formatDate(appointment.scheduledAt)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointment.durationMins} minutes
                  </div>
                </div>
                <StatusBadge status={appointment.status || 'Scheduled'} />
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                  </svg>
                  <span className="text-sm text-gray-700">
                    Ticket: {appointment.ticket?.code || appointment.ticketId}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span className="text-sm text-gray-700">
                    Technician: {appointment.technician?.email || '—'}
                  </span>
                </div>
                
                {appointment.address && (
                  <div className="flex items-center mt-2">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-sm text-gray-700 truncate">
                      {appointment.address}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex gap-2 justify-end">
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
                
                {['Scheduled', 'Confirmed'].includes(appointment.status) && (
                  <Button
                    variant="success"
                    size="sm"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    }
                  >
                    Complete
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

