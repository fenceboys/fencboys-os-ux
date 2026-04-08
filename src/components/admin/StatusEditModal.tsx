import React, { useState } from 'react';
import { ProjectStatusConfig, ProjectPhase } from '../../types';
import { Button } from '../ui';

interface StatusEditModalProps {
  status: ProjectStatusConfig | null;
  onSave: (updates: Partial<ProjectStatusConfig>) => void;
  onClose: () => void;
}

const phaseOptions: { value: ProjectPhase; label: string }[] = [
  { value: 'permits', label: 'Permits' },
  { value: 'materials', label: 'Materials' },
  { value: 'scheduling', label: 'Scheduling' },
  { value: 'installation', label: 'Installation' },
  { value: 'close_out', label: 'Close Out' },
];

const customerLabelOptions = [
  'Preparing Your Quote',
  'Reviewing & Signing',
  'Processing Permits',
  'Scheduling Your Installation',
  'Installation in Progress',
  'Closed',
];

const defaultColors = {
  bgColor: '#dbeafe',
  textColor: '#1d4ed8',
};

export const StatusEditModal: React.FC<StatusEditModalProps> = ({
  status,
  onSave,
  onClose,
}) => {
  const isNew = !status;
  const [formData, setFormData] = useState({
    name: status?.name || '',
    customerLabel: status?.customerLabel || customerLabelOptions[0],
    phase: status?.phase || 'permits' as ProjectPhase,
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
          {/* Row 1: Name and Customer Label */}
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
                Customer Label
              </label>
              <select
                value={formData.customerLabel}
                onChange={(e) => handleChange('customerLabel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {customerLabelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Phase */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phase
              </label>
              <select
                value={formData.phase}
                onChange={(e) => handleChange('phase', e.target.value as ProjectPhase)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {phaseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div></div>
          </div>

          {/* Row 3: Trigger Note and Sort Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trigger Note
              </label>
              <input
                type="text"
                value={formData.triggerNote}
                onChange={(e) => handleChange('triggerNote', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="When this status is triggered..."
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
