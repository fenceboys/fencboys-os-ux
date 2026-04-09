import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../layout';
import { Card, Button } from '../ui';
import { useData } from '../../context/DataContext';
import { CustomerStatusConfig } from '../../types';
import { CustomerStatusEditModal } from './CustomerStatusEditModal';
import { CustomerNotificationConfigModal } from './CustomerNotificationConfigModal';

export const CustomerStatusPage: React.FC = () => {
  const { customerStatusConfigs, updateCustomerStatusConfig, deleteCustomerStatusConfig, addCustomerStatusConfig } = useData();
  const [editingStatus, setEditingStatus] = useState<CustomerStatusConfig | null>(null);
  const [configuringNotifications, setConfiguringNotifications] = useState<CustomerStatusConfig | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Get active statuses sorted by order
  const activeStatuses = customerStatusConfigs
    .filter((s) => s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

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

  const handleDelete = (status: CustomerStatusConfig) => {
    if (window.confirm(`Are you sure you want to delete "${status.name}"?`)) {
      deleteCustomerStatusConfig(status.id);
    }
  };

  const handleSaveStatus = (updatedStatus: Partial<CustomerStatusConfig>) => {
    if (editingStatus) {
      updateCustomerStatusConfig(editingStatus.id, updatedStatus);
      setEditingStatus(null);
    } else if (showAddModal) {
      const maxSortOrder = Math.max(
        ...customerStatusConfigs.map((s) => s.sortOrder),
        0
      );
      addCustomerStatusConfig({
        ...updatedStatus as Omit<CustomerStatusConfig, 'id'>,
        sortOrder: maxSortOrder + 1,
      });
      setShowAddModal(false);
    }
  };

  const handleSaveNotifications = (notifications: CustomerStatusConfig['notifications']) => {
    if (configuringNotifications) {
      updateCustomerStatusConfig(configuringNotifications.id, { notifications });
      setConfiguringNotifications(null);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Customer Status"
        subtitle="Configure pre-sale customer journey statuses"
        icon={
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
        actions={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add Status
          </Button>
        }
      />

      <Card>
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Pre-Sale Journey
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {activeStatuses.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No statuses configured
            </div>
          ) : (
            activeStatuses.map((status, index) => (
              <div
                key={status.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  {/* Status Badge */}
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: status.bgColor,
                      color: status.textColor,
                    }}
                  >
                    {status.name}
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">{status.triggerNote}</p>
                  </div>
                </div>

                {/* Actions */}
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
                    onClick={() => setEditingStatus(status)}
                    className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  >
                    Edit
                  </button>
                  {/* Notifications */}
                  <button
                    onClick={() => setConfiguringNotifications(status)}
                    className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  >
                    Notifications
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(status)}
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

      {/* Edit Modal */}
      {(editingStatus || showAddModal) && (
        <CustomerStatusEditModal
          status={editingStatus}
          onSave={handleSaveStatus}
          onClose={() => {
            setEditingStatus(null);
            setShowAddModal(false);
          }}
        />
      )}

      {/* Notification Config Modal */}
      {configuringNotifications && (
        <CustomerNotificationConfigModal
          status={configuringNotifications}
          onSave={handleSaveNotifications}
          onClose={() => setConfiguringNotifications(null)}
        />
      )}
    </PageLayout>
  );
};
