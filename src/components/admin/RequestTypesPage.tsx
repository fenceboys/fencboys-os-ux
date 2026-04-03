import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../layout';
import { Card, Button } from '../ui';
import { useData } from '../../context/DataContext';
import { RequestTypeConfig, RequestType } from '../../types';

export const RequestTypesPage: React.FC = () => {
  const { requestTypeConfigs, addRequestTypeConfig, updateRequestTypeConfig, deleteRequestTypeConfig } = useData();
  const [editingType, setEditingType] = useState<RequestTypeConfig | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState<RequestType>('build');

  const activeTypes = requestTypeConfigs
    .filter((t) => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const handleAdd = () => {
    if (!newName.trim()) return;

    const maxSortOrder = Math.max(...requestTypeConfigs.map((t) => t.sortOrder), 0);

    addRequestTypeConfig({
      name: newName.trim(),
      value: newValue,
      sortOrder: maxSortOrder + 1,
      isActive: true,
    });

    setNewName('');
    setNewValue('build');
    setIsAdding(false);
  };

  const handleUpdate = () => {
    if (!editingType || !newName.trim()) return;
    updateRequestTypeConfig(editingType.id, { name: newName.trim(), value: newValue });
    setEditingType(null);
    setNewName('');
    setNewValue('build');
  };

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
        title="Request Types"
        subtitle="Manage fence project request types"
        icon={
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        }
        actions={
          <Button variant="primary" onClick={() => setIsAdding(true)}>
            + Add Request Type
          </Button>
        }
      />

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Request Type Usage</p>
            <p className="text-blue-700">
              Request types categorize the type of fence work a customer needs. Common types include New Build (brand new fence),
              Replace Existing (tear out and replace), and Repair (fix existing fence). These appear in Lead Verification
              and customer details.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <div className="divide-y divide-gray-100">
          {/* Add new type inline */}
          {isAdding && (
            <div className="px-4 py-3 flex items-center space-x-3 bg-blue-50">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd();
                  if (e.key === 'Escape') setIsAdding(false);
                }}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                placeholder="Display name (e.g., New Build)..."
                autoFocus
              />
              <select
                value={newValue}
                onChange={(e) => setNewValue(e.target.value as RequestType)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              >
                <option value="build">build</option>
                <option value="replace">replace</option>
                <option value="repair">repair</option>
              </select>
              <Button variant="primary" size="sm" onClick={handleAdd}>
                Add
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          )}

          {activeTypes.length === 0 && !isAdding ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No request types yet
            </div>
          ) : (
            activeTypes.map((type, index) => (
              <div
                key={type.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                {editingType?.id === type.id ? (
                  <div className="flex items-center space-x-3 flex-1">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdate();
                        if (e.key === 'Escape') {
                          setEditingType(null);
                          setNewName('');
                          setNewValue('build');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                      autoFocus
                    />
                    <select
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value as RequestType)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    >
                      <option value="build">build</option>
                      <option value="replace">replace</option>
                      <option value="repair">repair</option>
                    </select>
                    <Button variant="primary" size="sm" onClick={handleUpdate}>
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingType(null);
                        setNewName('');
                        setNewValue('build');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">{type.name}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {type.value}
                      </span>
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
                        onClick={() => {
                          setEditingType(type);
                          setNewName(type.name);
                          setNewValue(type.value);
                        }}
                        className="p-1.5 rounded hover:bg-gray-200"
                        title="Edit"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      {/* Deactivate */}
                      <button
                        onClick={() => handleDeactivate(type)}
                        className="p-1.5 rounded hover:bg-red-100"
                        title="Deactivate"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </PageLayout>
  );
};
