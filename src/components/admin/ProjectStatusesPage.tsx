import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../layout';
import { Card, Button } from '../ui';
import { useData } from '../../context/DataContext';
import { ProjectStatusConfig, ProjectPhase } from '../../types';
import { StatusEditModal } from './StatusEditModal';
import { NotificationConfigModal } from './NotificationConfigModal';

const phaseLabels: Record<ProjectPhase, string> = {
  permits: 'Permits',
  materials: 'Materials',
  scheduling: 'Scheduling',
  installation: 'Installation',
  close_out: 'Close Out',
};

const phaseOrder: ProjectPhase[] = [
  'permits',
  'materials',
  'scheduling',
  'installation',
  'close_out',
];

export const ProjectStatusesPage: React.FC = () => {
  const { projectStatusConfigs, updateProjectStatusConfig, deleteProjectStatusConfig, addProjectStatusConfig } = useData();
  const [editingStatus, setEditingStatus] = useState<ProjectStatusConfig | null>(null);
  const [configuringNotifications, setConfiguringNotifications] = useState<ProjectStatusConfig | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Group statuses by phase
  const statusesByPhase = phaseOrder.reduce((acc, phase) => {
    acc[phase] = projectStatusConfigs
      .filter((s) => s.phase === phase && s.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return acc;
  }, {} as Record<ProjectPhase, ProjectStatusConfig[]>);

  const handleMoveUp = (status: ProjectStatusConfig) => {
    const phaseStatuses = statusesByPhase[status.phase];
    const currentIndex = phaseStatuses.findIndex((s) => s.id === status.id);
    if (currentIndex > 0) {
      const prevStatus = phaseStatuses[currentIndex - 1];
      updateProjectStatusConfig(status.id, { sortOrder: prevStatus.sortOrder });
      updateProjectStatusConfig(prevStatus.id, { sortOrder: status.sortOrder });
    }
  };

  const handleMoveDown = (status: ProjectStatusConfig) => {
    const phaseStatuses = statusesByPhase[status.phase];
    const currentIndex = phaseStatuses.findIndex((s) => s.id === status.id);
    if (currentIndex < phaseStatuses.length - 1) {
      const nextStatus = phaseStatuses[currentIndex + 1];
      updateProjectStatusConfig(status.id, { sortOrder: nextStatus.sortOrder });
      updateProjectStatusConfig(nextStatus.id, { sortOrder: status.sortOrder });
    }
  };

  const handleDelete = (status: ProjectStatusConfig) => {
    if (window.confirm(`Are you sure you want to delete "${status.name}"?`)) {
      deleteProjectStatusConfig(status.id);
    }
  };

  const handleSaveStatus = (updatedStatus: Partial<ProjectStatusConfig>) => {
    if (editingStatus) {
      updateProjectStatusConfig(editingStatus.id, updatedStatus);
      setEditingStatus(null);
    } else if (showAddModal) {
      const maxSortOrder = Math.max(
        ...projectStatusConfigs
          .filter((s) => s.phase === updatedStatus.phase)
          .map((s) => s.sortOrder),
        0
      );
      addProjectStatusConfig({
        ...updatedStatus as Omit<ProjectStatusConfig, 'id'>,
        sortOrder: maxSortOrder + 1,
      });
      setShowAddModal(false);
    }
  };

  const handleSaveNotifications = (notifications: ProjectStatusConfig['notifications']) => {
    if (configuringNotifications) {
      updateProjectStatusConfig(configuringNotifications.id, { notifications });
      setConfiguringNotifications(null);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Project Statuses"
        subtitle="Configure project statuses and notifications"
        icon={
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
        actions={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add Status
          </Button>
        }
      />

      <div className="space-y-6">
        {phaseOrder.map((phase) => (
          <Card key={phase}>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {phaseLabels[phase]}
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {statusesByPhase[phase].length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                  No statuses in this phase
                </div>
              ) : (
                statusesByPhase[phase].map((status, index) => (
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
                        disabled={index === statusesByPhase[phase].length - 1}
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
        ))}
      </div>

      {/* Edit Modal */}
      {(editingStatus || showAddModal) && (
        <StatusEditModal
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
        <NotificationConfigModal
          status={configuringNotifications}
          onSave={handleSaveNotifications}
          onClose={() => setConfiguringNotifications(null)}
        />
      )}
    </PageLayout>
  );
};
