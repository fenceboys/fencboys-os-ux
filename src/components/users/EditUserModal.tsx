import React, { useState } from 'react';
import { Button } from '../ui';
import { useData } from '../../context/DataContext';
import { User } from '../../types';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose }) => {
  const { updateUser, deleteUser } = useData();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    status: user.status,
    roles: {
      admin: user.roles.includes('admin'),
      salesperson: user.roles.includes('salesperson'),
    },
    integrations: { ...user.integrations },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (role: 'admin' | 'salesperson', checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roles: { ...prev.roles, [role]: checked },
    }));
  };

  const handleGoogleToggle = () => {
    setFormData((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        google: {
          connected: !prev.integrations.google.connected,
          email: !prev.integrations.google.connected ? prev.email : undefined,
        },
      },
    }));
  };

  const handleCalendlyToggle = () => {
    setFormData((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        calendly: {
          connected: !prev.integrations.calendly.connected,
          url: !prev.integrations.calendly.connected ? `https://calendly.com/${prev.name.toLowerCase().replace(/\s+/g, '-')}` : undefined,
        },
      },
    }));
  };

  const handleCalendlyUrlChange = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        calendly: { ...prev.integrations.calendly, url },
      },
    }));
  };

  const handleQuoChange = (lineType: string) => {
    setFormData((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        quo: lineType === 'none'
          ? {}
          : { lineType: lineType as 'main' | 'direct', lineId: lineType === 'main' ? 'main' : `direct_${user.id}` },
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const roles: ('admin' | 'salesperson')[] = [];
    if (formData.roles.admin) roles.push('admin');
    if (formData.roles.salesperson) roles.push('salesperson');

    if (roles.length === 0) {
      alert('Please select at least one role');
      return;
    }

    updateUser(user.id, {
      name: formData.name,
      email: formData.email,
      status: formData.status as 'active' | 'inactive',
      roles,
      integrations: formData.integrations,
    });

    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      deleteUser(user.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Edit User</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Basic Information</h3>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === 'active'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === 'inactive'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>

            {/* Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roles
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.roles.admin}
                    onChange={(e) => handleRoleChange('admin', e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Admin</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.roles.salesperson}
                    onChange={(e) => handleRoleChange('salesperson', e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Salesperson</span>
                </label>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Integrations</h3>

            {/* Google */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Google</p>
                <p className="text-xs text-gray-500">
                  {formData.integrations.google.connected
                    ? formData.integrations.google.email
                    : 'Not connected'}
                </p>
              </div>
              <Button
                variant={formData.integrations.google.connected ? 'secondary' : 'primary'}
                size="sm"
                type="button"
                onClick={handleGoogleToggle}
              >
                {formData.integrations.google.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>

            {/* Calendly */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Calendly</p>
                  <p className="text-xs text-gray-500">
                    {formData.integrations.calendly.connected
                      ? 'Connected'
                      : 'Not connected'}
                  </p>
                </div>
                <Button
                  variant={formData.integrations.calendly.connected ? 'secondary' : 'primary'}
                  size="sm"
                  type="button"
                  onClick={handleCalendlyToggle}
                >
                  {formData.integrations.calendly.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
              {formData.integrations.calendly.connected && (
                <div className="mt-2">
                  <input
                    type="url"
                    value={formData.integrations.calendly.url || ''}
                    onChange={(e) => handleCalendlyUrlChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    placeholder="https://calendly.com/your-link"
                  />
                </div>
              )}
            </div>

            {/* QUO */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">QUO Line</p>
                <p className="text-xs text-gray-500">Phone line assignment</p>
              </div>
              <select
                value={formData.integrations.quo.lineType || 'none'}
                onChange={(e) => handleQuoChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="none">Not Assigned</option>
                <option value="main">Main Line</option>
                <option value="direct">Direct Line</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <Button variant="ghost" type="button" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
              Delete User
            </Button>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
