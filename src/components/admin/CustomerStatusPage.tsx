import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../layout';
import { Card, Button } from '../ui';
import { useData } from '../../context/DataContext';
import { CustomerStatusConfig } from '../../types';

export const CustomerStatusPage: React.FC = () => {
  const { customerStatusConfigs, addCustomerStatusConfig, updateCustomerStatusConfig, deleteCustomerStatusConfig } = useData();
  const [editingStatus, setEditingStatus] = useState<CustomerStatusConfig | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const activeStatuses = customerStatusConfigs
    .filter((s) => s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const handleAdd = () => {
    if (!newName.trim()) return;

    const maxSortOrder = Math.max(...customerStatusConfigs.map((s) => s.sortOrder), 0);

    addCustomerStatusConfig({
      name: newName.trim(),
      sortOrder: maxSortOrder + 1,
      isActive: true,
    });

    setNewName('');
    setIsAdding(false);
  };

  const handleUpdate = () => {
    if (!editingStatus || !newName.trim()) return;
    updateCustomerStatusConfig(editingStatus.id, { name: newName.trim() });
    setEditingStatus(null);
    setNewName('');
  };

  const handleDeactivate = (status: CustomerStatusConfig) => {
    if (window.confirm(`Deactivate "${status.name}"? This will hide it from customer status options.`)) {
      updateCustomerStatusConfig(status.id, { isActive: false });
    }
  };

  const handleMoveUp = (status: CustomerStatusConfig) => {
    const currentIndex = activeStatuses.findIndex((s) => s.id === status.id);
    if (currentIndex > 0) {
      const prevStatus = activeStatuses[currentIndex - 1];
      updateCustomerStatusConfig(status.id, { sortOrder: prevStatus.sortOrder });
      updateCustomerStatusConfig(prevStatus.id, { sortOrder: status.sortOrder });
    }
  };

  const handleMoveDown = (status: CustomerStatusConfig) => {
    const currentIndex = activeStatuses.findIndex((s) => s.id === status.id);
    if (currentIndex < activeStatuses.length - 1) {
      const nextStatus = activeStatuses[currentIndex + 1];
      updateCustomerStatusConfig(status.id, { sortOrder: nextStatus.sortOrder });
      updateCustomerStatusConfig(nextStatus.id, { sortOrder: status.sortOrder });
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Customer Status"
        subtitle="Manage customer lifecycle statuses"
        icon={
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
        actions={
          <Button variant="primary" onClick={() => setIsAdding(true)}>
            + Add Status
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
            <p className="font-medium mb-1">Customer Status Usage</p>
            <p className="text-blue-700">
              Customer statuses help organize your customer pipeline. Salespeople can filter their customer list by status
              to focus on specific lifecycle stages. Common statuses include Lead (new inquiries), Active Customer (projects in progress),
              and Completed (finished projects).
            </p>
          </div>
        </div>
      </div>

      <Card>
        <div className="divide-y divide-gray-100">
          {/* Add new status inline */}
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
                placeholder="Enter status name..."
                autoFocus
              />
              <Button variant="primary" size="sm" onClick={handleAdd}>
                Add
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          )}

          {activeStatuses.length === 0 && !isAdding ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No statuses yet
            </div>
          ) : (
            activeStatuses.map((status, index) => (
              <div
                key={status.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                {editingStatus?.id === status.id ? (
                  <div className="flex items-center space-x-3 flex-1">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdate();
                        if (e.key === 'Escape') {
                          setEditingStatus(null);
                          setNewName('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                      autoFocus
                    />
                    <Button variant="primary" size="sm" onClick={handleUpdate}>
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingStatus(null);
                        setNewName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-gray-900">{status.name}</span>
                    <div className="flex items-center space-x-1">
                      {/* Move Up */}
                      <button
                        onClick={() => handleMoveUp(status)}
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
                        onClick={() => handleMoveDown(status)}
                        disabled={index === activeStatuses.length - 1}
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
                          setEditingStatus(status);
                          setNewName(status.name);
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
                        onClick={() => handleDeactivate(status)}
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
