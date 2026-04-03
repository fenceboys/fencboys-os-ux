import React, { useState, useMemo } from 'react';
import { Button, Input, Textarea, Dropdown } from '../ui';
import { useData } from '../../context/DataContext';
import { Customer, RequestType, LeadSource } from '../../types';

// Lead source options
const leadSourceOptions = [
  { value: 'webform', label: 'Webform' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'text', label: 'Text' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'meta_ads', label: 'Meta Ads' },
  { value: 'direct_mail', label: 'Direct Mail' },
  { value: 'out_of_house', label: 'Out of House' },
];

interface CustomerFormProps {
  customer?: Customer;
  onClose: () => void;
}

// Format phone number as (XXX) XXX-XXXX
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Format based on length
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};

export const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onClose }) => {
  const { addCustomer, updateCustomer, addProject, salespeople, requestTypeConfigs } = useData();

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || 'TX',
    zip: customer?.zip || '',
    requestType: customer?.requestType || 'build' as RequestType,
    salespersonId: customer?.salespersonId || '',
    notes: customer?.notes || '',
    leadSource: 'webform' as LeadSource,
  });

  const createCustomerAndProject = () => {
    // Create the customer
    const newCustomer = addCustomer({
      ...formData,
      preferredContact: 'phone',
      status: 'lead',
      tags: [],
    });

    // Create a project for the customer
    const requestTypeLabel = requestTypeConfigs.find(t => t.value === formData.requestType)?.name || formData.requestType;
    addProject({
      customerId: newCustomer.id,
      name: `${formData.name} - ${requestTypeLabel}`,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
      status: 'new_lead',
      customerStatus: 'Processing',
      salespersonId: formData.salespersonId,
      portalLive: false,
      autoNotifications: true,
      leadSource: formData.leadSource,
      statusChangedAt: new Date().toISOString(),
    });

    return newCustomer;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (customer) {
      updateCustomer(customer.id, formData);
    } else {
      createCustomerAndProject();
    }

    onClose();
  };

  const handleOpenPortalForScheduling = () => {
    createCustomerAndProject();
    // Open SMS with portal link and scheduling instructions
    const portalLink = `https://portal.fenceboys.com/schedule`;
    const message = encodeURIComponent(`Hi ${formData.name}! Use this link to schedule your free on-site quote appointment: ${portalLink}\n\nJust pick a date and time that works for you!`);
    window.open(`sms:${formData.phone}?body=${message}`, '_self');
    onClose();
  };

  const handleScheduleManually = () => {
    createCustomerAndProject();

    // Create Google Calendar event URL with pre-filled details
    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`;
    const eventTitle = encodeURIComponent(`Quote Appointment - ${formData.name}`);
    const eventDetails = encodeURIComponent(`Quote appointment for ${fullAddress}\n\nCustomer: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nRequest: ${formData.requestType}`);
    const eventLocation = encodeURIComponent(fullAddress);

    // Default to tomorrow at 9am, 1 hour duration
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const startTime = tomorrow.toISOString().replace(/-|:|\.\d{3}/g, '');
    tomorrow.setHours(10, 0, 0, 0);
    const endTime = tomorrow.toISOString().replace(/-|:|\.\d{3}/g, '');

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}&location=${eventLocation}&dates=${startTime}/${endTime}`;

    window.open(googleCalendarUrl, '_blank');
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    // Auto-format phone number
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const requestTypeOptions = useMemo(() =>
    requestTypeConfigs
      .filter(t => t.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(t => ({ value: t.value, label: t.name })),
    [requestTypeConfigs]
  );

  const salespersonOptions = salespeople.map(sp => ({
    value: sp.id,
    label: sp.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
      </div>

      <Input
        label="Address"
        value={formData.address}
        onChange={(e) => handleChange('address', e.target.value)}
        required
      />

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="City"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          required
        />
        <Input
          label="State"
          value={formData.state}
          onChange={(e) => handleChange('state', e.target.value)}
          required
        />
        <Input
          label="Zip"
          value={formData.zip}
          onChange={(e) => handleChange('zip', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Request Type
          </label>
          <Dropdown
            options={requestTypeOptions}
            value={formData.requestType}
            onChange={(value) => handleChange('requestType', value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lead Source
          </label>
          <Dropdown
            options={leadSourceOptions}
            value={formData.leadSource}
            onChange={(value) => handleChange('leadSource', value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assigned Salesperson
        </label>
        <Dropdown
          options={salespersonOptions}
          value={formData.salespersonId}
          onChange={(value) => handleChange('salespersonId', value)}
          placeholder="Select salesperson..."
        />
      </div>

      <Textarea
        label="Booking Notes"
        value={formData.notes}
        onChange={(e) => handleChange('notes', e.target.value)}
        rows={3}
      />

      {/* Scheduling Section */}
      {!customer && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="text-sm font-medium text-gray-700 mb-3">Schedule Sales Appointment</div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleOpenPortalForScheduling}
              disabled={!formData.phone}
              className={`flex items-center p-3 border border-gray-200 rounded-lg bg-white transition-all group ${formData.phone ? 'hover:border-blue-300 hover:bg-blue-50' : 'opacity-50 cursor-not-allowed'}`}
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <div className="text-left">
                <div className={`text-sm font-medium ${formData.phone ? 'text-gray-900 group-hover:text-blue-600' : 'text-gray-400'}`}>Open Portal for Scheduling</div>
                <div className="text-xs text-gray-500">{formData.phone ? 'Text & email portal link' : 'Phone required'}</div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleScheduleManually}
              className="flex items-center p-3 border border-gray-200 rounded-lg bg-white hover:border-green-300 hover:bg-green-50 transition-all group"
            >
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900 group-hover:text-green-600">Manual</div>
                <div className="text-xs text-gray-500">Google Calendar</div>
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {customer ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};
