import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../layout';
import { Card, Button, Modal } from '../ui';
import { useData } from '../../context/DataContext';
import { RequestTypeConfig, RequestType } from '../../types';

const defaultColors: Record<RequestType, { bg: string; text: string }> = {
  build: { bg: '#dcfce7', text: '#166534' },
  replace: { bg: '#dbeafe', text: '#1e40af' },
  repair: { bg: '#ffedd5', text: '#c2410c' },
};

export const RequestTypesPage: React.FC = () => {
  const { requestTypeConfigs, addRequestTypeConfig, updateRequestTypeConfig, deleteRequestTypeConfig } = useData();
  const [editingType, setEditingType] = useState<RequestTypeConfig | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const activeTypes = requestTypeConfigs
    .filter((t) => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const handleDeactivate = (type: RequestTypeConfig) => {
    if (window.confirm(`Deactivate "${type.name}"? This will hide it from request type options.`)) {
      updateRequestTypeConfig(type.id, { isActive: false });
    }
  };

  const handleMoveUp = (type: RequestTypeConfig) => {
    const currentIndex = activeTypes.findIndex((t) => t.id === type.id);
    if (currentIndex > 0) {
      const prevType = activeTypes[currentIndex - 1];
      updateRequestTypeConfig(type.id, { sortOrder: prevType.sortOrder });
      updateRequestTypeConfig(prevType.id, { sortOrder: type.sortOrder });
    }
  };

  const handleMoveDown = (type: RequestTypeConfig) => {
    const currentIndex = activeTypes.findIndex((t) => t.id === type.id);
    if (currentIndex < activeTypes.length - 1) {
      const nextType = activeTypes[currentIndex + 1];
      updateRequestTypeConfig(type.id, { sortOrder: nextType.sortOrder });
      updateRequestTypeConfig(nextType.id, { sortOrder: type.sortOrder });
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Job Types"
        subtitle="Manage fence project job types"
        icon={
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        }
        actions={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add Job Type
          </Button>
        }
      />

      <Card>
        <div className="divide-y divide-gray-100">
          {activeTypes.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No job types configured
            </div>
          ) : (
            activeTypes.map((type, index) => (
              <div
                key={type.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  {/* Colored Badge */}
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: type.bgColor || defaultColors[type.value]?.bg || '#f3f4f6',
                      color: type.textColor || defaultColors[type.value]?.text || '#374151',
                    }}
                  >
                    {type.name}
                  </span>
                  {type.description && (
                    <span className="text-sm text-gray-500">{type.description}</span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {/* Move Up */}
                  <button
                    onClick={() => handleMoveUp(type)}
                    disabled={index === 0}
                    className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  {/* Move Down */}
                  <button
                    onClick={() => handleMoveDown(type)}
                    disabled={index === activeTypes.length - 1}
                    className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Edit */}
                  <button
                    onClick={() => setEditingType(type)}
                    className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  >
                    Edit
                  </button>
                  {/* Deactivate */}
                  <button
                    onClick={() => handleDeactivate(type)}
                    className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Edit/Add Modal */}
      {(editingType || showAddModal) && (
        <RequestTypeEditModal
          type={editingType}
          onSave={(data) => {
            if (editingType) {
              updateRequestTypeConfig(editingType.id, data);
            } else {
              const maxSortOrder = Math.max(...requestTypeConfigs.map((t) => t.sortOrder), 0);
              addRequestTypeConfig({
                ...data as Omit<RequestTypeConfig, 'id'>,
                sortOrder: maxSortOrder + 1,
                isActive: true,
              });
            }
            setEditingType(null);
            setShowAddModal(false);
          }}
          onClose={() => {
            setEditingType(null);
            setShowAddModal(false);
          }}
        />
      )}
    </PageLayout>
  );
};

// Edit Modal Component
interface RequestTypeEditModalProps {
  type: RequestTypeConfig | null;
  onSave: (data: Partial<RequestTypeConfig>) => void;
  onClose: () => void;
}

const RequestTypeEditModal: React.FC<RequestTypeEditModalProps> = ({ type, onSave, onClose }) => {
  const isNew = !type;
  const [formData, setFormData] = useState({
    name: type?.name || '',
    value: type?.value || 'build' as RequestType,
    description: type?.description || '',
    bgColor: type?.bgColor || defaultColors[type?.value || 'build'].bg,
    textColor: type?.textColor || defaultColors[type?.value || 'build'].text,
  });

  const handleValueChange = (value: RequestType) => {
    setFormData(prev => ({
      ...prev,
      value,
      bgColor: defaultColors[value].bg,
      textColor: defaultColors[value].text,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isNew ? 'Add Job Type' : 'Edit Job Type'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., New Build"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of this job type..."
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.bgColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, bgColor: e.target.value }))}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.bgColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, bgColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
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
                  onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
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
                {formData.name || 'Job Type Name'}
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
