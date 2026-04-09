import React, { useState } from 'react';
import { CustomerStatusConfig, StatusTrigger } from '../../types';
import { Button } from '../ui';

interface CustomerStatusEditModalProps {
  status: CustomerStatusConfig | null;
  onSave: (updates: Partial<CustomerStatusConfig>) => void;
  onClose: () => void;
}

const triggerOptions: { value: StatusTrigger; label: string; description: string }[] = [
  { value: 'manual', label: 'Manual', description: 'Staff manually changes status' },
  { value: 'calendly_scheduled', label: 'Calendly Scheduled', description: 'Customer books via Calendly in portal' },
  { value: 'portal_signed', label: 'Portal Signed', description: 'Customer signs document in portal' },
  { value: 'deposit_paid', label: 'Deposit Paid', description: 'Deposit payment received' },
  { value: 'final_payment_paid', label: 'Final Payment', description: 'Final balance payment received' },
];

const defaultColors = {
  bgColor: '#dbeafe',
  textColor: '#1d4ed8',
};

export const CustomerStatusEditModal: React.FC<CustomerStatusEditModalProps> = ({
  status,
  onSave,
  onClose,
}) => {
  const isNew = !status;
  const [formData, setFormData] = useState({
    name: status?.name || '',
    customerLabel: status?.customerLabel || '',
    trigger: (status?.trigger || 'manual') as StatusTrigger,
    triggerNote: status?.triggerNote || '',
    sortOrder: status?.sortOrder || 1,
    bgColor: status?.bgColor || defaultColors.bgColor,
    textColor: status?.textColor || defaultColors.textColor,
    isActive: status?.isActive ?? true,
    notifications: status?.notifications || {
      slack: { enabled: false, channel: '' },
      sms: { enabled: false, template: '' },
      email: { enabled: false, subject: '', body: '' },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isNew ? 'Add Status' : 'Edit Status'}
          </h2>
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
          {/* Row 1: Name and Sort Order */}
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => handleChange('sortOrder', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                min="1"
              />
            </div>
          </div>

          {/* Row 2: Trigger */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trigger
            </label>
            <select
              value={formData.trigger}
              onChange={(e) => handleChange('trigger', e.target.value as StatusTrigger)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {triggerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {triggerOptions.find(t => t.value === formData.trigger)?.description}
            </p>
          </div>

          {/* Row 3: Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.triggerNote}
              onChange={(e) => handleChange('triggerNote', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Describe when this status is used..."
            />
          </div>

          {/* Row 4: Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.bgColor}
                  onChange={(e) => handleChange('bgColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.bgColor}
                  onChange={(e) => handleChange('bgColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
                  placeholder="#dbeafe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
                  placeholder="#1d4ed8"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-center">
              <span
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: formData.bgColor,
                  color: formData.textColor,
                }}
              >
                {formData.name || 'Status Name'}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isNew ? 'Create' : 'Update'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
