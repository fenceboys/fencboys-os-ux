import React, { useState } from 'react';
import { Button } from '../ui';
import { useData } from '../../context/DataContext';

interface InviteUserModalProps {
  onClose: () => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({ onClose }) => {
  const { addUser } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roles: {
      admin: false,
      salesperson: true,
    },
  });
  const [inviteSent, setInviteSent] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (role: 'admin' | 'salesperson', checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roles: { ...prev.roles, [role]: checked },
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

    addUser({
      name: formData.name,
      email: formData.email,
      roles,
      status: 'active',
      integrations: {
        google: { connected: false },
        calendly: { connected: false },
        quo: {},
      },
    });

    setInviteSent(true);
  };

  if (inviteSent) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Invite Sent!</h3>
          <p className="text-sm text-gray-600 mb-6">
            An invitation has been sent to <strong>{formData.email}</strong>. They'll receive an email with instructions to set up their account.
          </p>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Invite User</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              placeholder="John Smith"
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
              placeholder="john@fenceboys.com"
              required
            />
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

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Send Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
