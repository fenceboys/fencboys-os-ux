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
  const [customerNotes, setCustomerNotes] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const customer = getCustomerById(id || '');
  const projects = getProjectsByCustomerId(id || '');
  // Get activities from all customer's projects
  const activities = projects.flatMap(p => getActivitiesByProjectId(p.id));
  const salesperson = customer ? getSalespersonById(customer.salespersonId) : null;

  // Initialize notes from customer data
  React.useEffect(() => {
    if (customer?.notes) {
      setCustomerNotes(customer.notes);
    }
  }, [customer?.notes]);

  const statusOptions = projectStatusOptions.map(s => ({
    value: s.value,
    label: s.label,
  }));

  // Get recent activities (last 10)
  const recentActivities = activities
    .sort((a: Activity, b: Activity) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

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

  const handleSaveNotes = () => {
    if (customer) {
      updateCustomer(customer.id, { notes: customerNotes });
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message_outbound':
        return (
          <div className="p-2 bg-blue-100 rounded-full">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        );
      case 'message_inbound':
        return (
          <div className="p-2 bg-green-100 rounded-full">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
      case 'status_change':
        return (
          <div className="p-2 bg-purple-100 rounded-full">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-100 rounded-full">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
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
      <div className="flex items-center justify-between mb-6">
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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{activity.content}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString()} at{' '}
                      {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No recent activity</p>
            )}
          </div>
        </Card>

        {/* Customer Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Notes</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {/* Editor with Toolbar */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsBold(!isBold)}
                  className={`p-1.5 rounded hover:bg-gray-200 ${isBold ? 'bg-gray-200' : ''}`}
                  title="Bold"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setIsItalic(!isItalic)}
                  className={`p-1.5 rounded hover:bg-gray-200 ${isItalic ? 'bg-gray-200' : ''}`}
                  title="Italic"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m-2 0h4" transform="skewX(-10)" />
                  </svg>
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200"
                  title="Bullet List"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200"
                  title="Numbered List"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h13M7 12h13M7 18h13M4 6h.01M4 12h.01M4 18h.01" />
                  </svg>
                </button>
              </div>

              {/* Text Area */}
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Add notes about this customer..."
                className={`w-full p-4 min-h-[120px] resize-none focus:outline-none ${
                  isBold ? 'font-bold' : ''
                } ${isItalic ? 'italic' : ''}`}
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveNotes}
              className="w-full"
            >
              Save Notes
            </Button>
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
              render: (project) => (
                <div onClick={(e) => e.stopPropagation()}>
                  <StatusDropdown
                    value={project.status}
                    options={statusOptions}
                    onChange={(value) => updateProject(project.id, { status: value as ProjectStatus })}
                  />
                </div>
              ),
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
