import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, Button, Modal, Input } from '../ui';
import { StatusDropdown } from '../ui/StatusDropdown';
import { Table } from '../ui/Table';
import { PageLayout } from '../layout';
import { CustomerForm } from './CustomerForm';
import { useData } from '../../context/DataContext';
import { PillDropdown, buildTypeOptions, projectStatusOptions, customerStatusOptions } from '../ui/PillDropdown';
import { Project, ProjectStatus, BuildType, Activity, CustomerStatus } from '../../types';

export const CustomerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getCustomerById,
    getProjectsByCustomerId,
    getSalespersonById,
    getActivitiesByProjectId,
    addProject,
    updateProject,
    updateCustomer,
    requestTypeConfigs,
  } = useData();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectAddress, setNewProjectAddress] = useState('');
  const [newNote, setNewNote] = useState('');
  const [activityTab, setActivityTab] = useState<'status_changes' | 'calls' | 'voicemails' | 'texts' | 'emails'>('status_changes');

  const customer = getCustomerById(id || '');
  const projects = getProjectsByCustomerId(id || '');
  // Get activities from all customer's projects
  const activities = projects.flatMap(p => getActivitiesByProjectId(p.id));
  const salesperson = customer ? getSalespersonById(customer.salespersonId) : null;

  // Parse notes from customer data (stored as JSON array)
  interface CustomerNote {
    id: string;
    content: string;
    createdAt: string;
  }

  const parseNotes = (notesStr: string): CustomerNote[] => {
    if (!notesStr) return [];
    try {
      const parsed = JSON.parse(notesStr);
      if (Array.isArray(parsed)) return parsed;
      // Legacy: if it's a plain string, convert to single note
      return [{ id: '1', content: notesStr, createdAt: new Date().toISOString() }];
    } catch {
      // Legacy plain text note
      if (notesStr.trim()) {
        return [{ id: '1', content: notesStr, createdAt: new Date().toISOString() }];
      }
      return [];
    }
  };

  const customerNotes = customer ? parseNotes(customer.notes) : [];

  const statusOptions = projectStatusOptions.map(s => ({
    value: s.value,
    label: s.label,
  }));

  const handleCreateProject = () => {
    if (!customer || !newProjectName.trim()) return;

    const address = newProjectAddress.trim() || `${customer.address}, ${customer.city}, ${customer.state} ${customer.zip}`;

    addProject({
      customerId: customer.id,
      name: newProjectName.trim(),
      address,
      status: 'new_lead',
      customerStatus: 'Processing',
      salespersonId: customer.salespersonId,
      portalLive: false,
      autoNotifications: true,
      statusChangedAt: new Date().toISOString(),
    });

    setNewProjectName('');
    setNewProjectAddress('');
    setShowNewProjectModal(false);
  };

  const handleAddNote = () => {
    if (!customer || !newNote.trim()) return;

    const newNoteObj: CustomerNote = {
      id: Date.now().toString(),
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [newNoteObj, ...customerNotes];
    updateCustomer(customer.id, { notes: JSON.stringify(updatedNotes) });
    setNewNote('');
  };

  // Activity type labels
  const activityTypeLabels: Record<string, string> = {
    status_change: 'Status Change',
    note_added: 'Note Added',
    call_recording: 'Call',
    voicemail: 'Voicemail',
    text_inbound: 'Text Received',
    text_outbound: 'Text Sent',
    message_inbound: 'Text Received',
    message_outbound: 'Text Sent',
    email_inbound: 'Email Received',
    email_outbound: 'Email Sent',
    proposal_sent: 'Proposal Sent',
    proposal_signed: 'Proposal Signed',
    payment_received: 'Payment Received',
  };

  // Get activity color classes
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call_recording':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'voicemail':
        return { bg: 'bg-orange-100', text: 'text-orange-600' };
      case 'text_inbound':
      case 'message_inbound':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'text_outbound':
      case 'message_outbound':
        return { bg: 'bg-cyan-100', text: 'text-cyan-600' };
      case 'email_inbound':
        return { bg: 'bg-indigo-100', text: 'text-indigo-600' };
      case 'email_outbound':
        return { bg: 'bg-violet-100', text: 'text-violet-600' };
      case 'status_change':
        return { bg: 'bg-purple-100', text: 'text-purple-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call_recording':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'voicemail':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'text_inbound':
      case 'text_outbound':
      case 'message_inbound':
      case 'message_outbound':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'email_inbound':
      case 'email_outbound':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'status_change':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Filter activities by tab
  const getFilteredActivities = () => {
    const sorted = [...activities].sort((a: Activity, b: Activity) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    switch (activityTab) {
      case 'status_changes':
        return sorted.filter(a => ['status_change', 'note_added', 'proposal_sent', 'proposal_signed', 'payment_received'].includes(a.type));
      case 'calls':
        return sorted.filter(a => a.type === 'call_recording');
      case 'voicemails':
        return sorted.filter(a => a.type === 'voicemail');
      case 'texts':
        return sorted.filter(a => ['text_inbound', 'text_outbound', 'message_inbound', 'message_outbound'].includes(a.type));
      case 'emails':
        return sorted.filter(a => ['email_inbound', 'email_outbound'].includes(a.type));
      default:
        return sorted;
    }
  };

  const filteredActivities = getFilteredActivities();

  // Tab counts
  const statusChangeCount = activities.filter(a => ['status_change', 'note_added', 'proposal_sent', 'proposal_signed', 'payment_received'].includes(a.type)).length;
  const callCount = activities.filter(a => a.type === 'call_recording').length;
  const voicemailCount = activities.filter(a => a.type === 'voicemail').length;
  const textCount = activities.filter(a => ['text_inbound', 'text_outbound', 'message_inbound', 'message_outbound'].includes(a.type)).length;
  const emailCount = activities.filter(a => ['email_inbound', 'email_outbound'].includes(a.type)).length;

  const activityTabs = [
    { id: 'status_changes' as const, label: 'Status Changes', count: statusChangeCount },
    { id: 'calls' as const, label: 'Calls', count: callCount },
    { id: 'voicemails' as const, label: 'Voicemails', count: voicemailCount },
    { id: 'texts' as const, label: 'Texts', count: textCount },
    { id: 'emails' as const, label: 'Emails', count: emailCount },
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!customer) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Customer not found</p>
          <Button className="mt-4" onClick={() => navigate('/customers')}>
            Back to Customers
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-50 -mx-6 px-6 pt-4 pb-4 mb-2">
        {/* Back Link */}
        <Link
          to="/customers"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Customers
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
            <div className="flex items-center space-x-2">
              <StatusDropdown
                value={customer.status}
                options={customerStatusOptions.map(s => ({ value: s.value, label: s.label }))}
                onChange={(value) => updateCustomer(customer.id, { status: value as CustomerStatus, statusChangedAt: new Date().toISOString() })}
                statusType="customer"
              />
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {(() => {
                    const statusDate = customer.statusChangedAt
                      ? new Date(customer.statusChangedAt)
                      : new Date(customer.createdAt);
                    const days = Math.floor((Date.now() - statusDate.getTime()) / (1000 * 60 * 60 * 24));
                    return `${days}d in status`;
                  })()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setShowEditModal(true)}>
              Edit
            </Button>
            <Button variant="outline">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </Button>
            <Button variant="outline">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              SMS
            </Button>
            <Button variant="outline">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </Button>
          </div>
        </div>
      </div>

      {/* Info Cards - Three Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="text-gray-900">{customer.phone}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-gray-900">{customer.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Address</label>
              <p className="text-gray-900">
                {customer.address}<br />
                {customer.city}, {customer.state} {customer.zip}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Salesperson</label>
              <p className="text-gray-900">{salesperson?.name || 'Unassigned'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Added</label>
              <p className="text-gray-900">
                {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Communications */}
        <Card padding="none">
          <div className="p-4 border-b border-gray-200">
            <CardTitle>Communications</CardTitle>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-2 overflow-x-auto">
            {activityTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivityTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activityTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    activityTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Activity List */}
          <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
            {filteredActivities.length > 0 ? (
              filteredActivities.slice(0, 15).map((activity) => {
                const colors = getActivityColor(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0 ${colors.text}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-gray-700">
                          {activityTypeLabels[activity.type] || activity.type}
                        </span>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{activity.content}</p>
                      {activity.duration && (
                        <p className="text-xs text-gray-400">
                          {formatDuration(activity.duration)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400">
                  {activityTab === 'status_changes' && 'No status changes'}
                  {activityTab === 'calls' && 'No call recordings'}
                  {activityTab === 'voicemails' && 'No voicemails'}
                  {activityTab === 'texts' && 'No text messages'}
                  {activityTab === 'emails' && 'No emails'}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Customer Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Notes</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {/* Add Note Input */}
            <div className="flex gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="self-end"
              >
                Add
              </Button>
            </div>

            {/* Notes Log */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {customerNotes.length > 0 ? (
                customerNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(note.createdAt).toLocaleDateString()} at{' '}
                      {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No notes yet</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Projects */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button size="sm" onClick={() => setShowNewProjectModal(true)}>+ New Project</Button>
        </div>
        <Table<Project>
          columns={[
            {
              key: 'name',
              header: 'Project',
              render: (project) => (
                <span className="font-medium text-gray-900">{project.name}</span>
              ),
            },
            { key: 'address', header: 'Address' },
            {
              key: 'buildType',
              header: 'Job Type',
              render: (project) => (
                <div onClick={(e) => e.stopPropagation()}>
                  <PillDropdown
                    options={buildTypeOptions}
                    value={project.buildType || 'new_build'}
                    onChange={(value) => updateProject(project.id, { buildType: value as BuildType })}
                  />
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Project Status',
              render: (project) => {
                const isDisabled = customer.status !== 'active_project';
                return (
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown
                      value={project.status}
                      options={statusOptions}
                      onChange={(value) => updateProject(project.id, { status: value as ProjectStatus })}
                      disabled={isDisabled}
                      disabledReason="Customer status must be 'Active Project' to change project status"
                    />
                  </div>
                );
              },
            },
            {
              key: 'createdAt',
              header: 'Created',
              render: (project) => new Date(project.createdAt).toLocaleDateString(),
            },
          ]}
          data={projects}
          onRowClick={(project) => navigate(`/projects/${project.id}`)}
          emptyMessage="No projects yet"
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Customer"
        size="lg"
      >
        <CustomerForm
          customer={customer}
          onClose={() => setShowEditModal(false)}
        />
      </Modal>

      {/* New Project Modal */}
      <Modal
        isOpen={showNewProjectModal}
        onClose={() => {
          setShowNewProjectModal(false);
          setNewProjectName('');
          setNewProjectAddress('');
        }}
        title="New Project"
      >
        <div className="space-y-4">
          <Input
            label="Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="e.g., Backyard Fence Installation"
            required
          />
          <Input
            label="Project Address"
            value={newProjectAddress}
            onChange={(e) => setNewProjectAddress(e.target.value)}
            placeholder={`${customer.address}, ${customer.city}, ${customer.state} ${customer.zip}`}
          />
          <p className="text-xs text-gray-500">
            Leave address blank to use customer's default address.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowNewProjectModal(false);
                setNewProjectName('');
                setNewProjectAddress('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim()}
            >
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};
