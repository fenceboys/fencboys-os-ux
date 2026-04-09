import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../layout';
import { Card, Button, Modal } from '../ui';
import { customerStatuses, projectStatuses } from '../../constants/statuses';
import { ViewConfig, ViewColumnConfig, ViewFilterConfig } from '../../types';

// Available columns that can be shown in dashboard views
const availableColumns = [
  { id: 'name', label: 'Customer', field: 'name' },
  { id: 'phone', label: 'Phone', field: 'phone' },
  { id: 'email', label: 'Email', field: 'email' },
  { id: 'address', label: 'Address', field: 'address' },
  { id: 'customerStatus', label: 'Customer Status', field: 'customerStatus' },
  { id: 'projectStatus', label: 'Project Status', field: 'status' },
  { id: 'buildType', label: 'Job Type', field: 'buildType' },
  { id: 'salesperson', label: 'Salesperson', field: 'salespersonId' },
  { id: 'daysInStatus', label: 'Days in Status', field: 'daysInStatus' },
  { id: 'lastContacted', label: 'Last Contacted', field: 'lastContacted' },
  { id: 'createdAt', label: 'Created Date', field: 'createdAt' },
  { id: 'appointmentDate', label: 'Quote Appointment', field: 'salesAppointment' },
  { id: 'installationDate', label: 'Installation Date', field: 'installationDate' },
  { id: 'requestType', label: 'Request Type', field: 'requestType' },
  { id: 'notes', label: 'Notes', field: 'notes' },
  { id: 'contact', label: 'Contact Actions', field: 'contact' },
  { id: 'portal', label: 'Portal', field: 'portalLive' },
];

// Build types
const buildTypes = [
  { id: 'new_build', label: 'New Build' },
  { id: 'replacement', label: 'Replacement' },
  { id: 'repair', label: 'Repair' },
];

// Dashboard types
const dashboardTypes = [
  { id: 'sales_dashboard', label: 'Sales Dashboard' },
  { id: 'admin_dashboard', label: 'Admin Dashboard' },
  { id: 'project_tracking_presale', label: 'Project Tracking (Pre-Sale)' },
  { id: 'project_tracking_postsale', label: 'Project Tracking (Post-Sale)' },
];

// Default views matching actual dashboard tabs
const defaultViews: ViewConfig[] = [
  // Sales Dashboard Tabs
  {
    id: 'my-leads',
    name: 'My Leads',
    viewType: 'sales_dashboard',
    tabId: 'my_projects',
    columns: [
      { id: '1', field: 'name', label: 'Customer', visible: true, sortOrder: 1 },
      { id: '2', field: 'address', label: 'Address', visible: true, sortOrder: 2 },
      { id: '3', field: 'buildType', label: 'Job Type', visible: true, sortOrder: 3 },
      { id: '4', field: 'customerStatus', label: 'Customer Status', visible: true, sortOrder: 4 },
      { id: '5', field: 'status', label: 'Project Status', visible: true, sortOrder: 5 },
      { id: '6', field: 'daysInStatus', label: 'Days in Status', visible: true, sortOrder: 6 },
      { id: '7', field: 'salesAppointment', label: 'Quote Appointment', visible: true, sortOrder: 7 },
      { id: '8', field: 'lastContacted', label: 'Last Contacted', visible: true, sortOrder: 8 },
      { id: '9', field: 'contact', label: 'Contact', visible: true, sortOrder: 9 },
    ],
    filters: [],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'quote-appointments',
    name: 'Quote Appointments',
    viewType: 'sales_dashboard',
    tabId: 'quote_appointments',
    columns: [
      { id: '1', field: 'salesAppointment', label: 'Date & Time', visible: true, sortOrder: 1 },
      { id: '2', field: 'name', label: 'Customer', visible: true, sortOrder: 2 },
      { id: '3', field: 'address', label: 'Address', visible: true, sortOrder: 3 },
      { id: '4', field: 'buildType', label: 'Job Type', visible: true, sortOrder: 4 },
      { id: '5', field: 'status', label: 'Project Status', visible: true, sortOrder: 5 },
      { id: '6', field: 'contact', label: 'Contact', visible: true, sortOrder: 6 },
    ],
    filters: [
      { field: 'status', operator: 'equals', value: 'quote_scheduled' },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-verification',
    name: 'Lead Verification',
    viewType: 'sales_dashboard',
    tabId: 'new_requests',
    columns: [
      { id: '1', field: 'name', label: 'Customer', visible: true, sortOrder: 1 },
      { id: '2', field: 'address', label: 'Address', visible: true, sortOrder: 2 },
      { id: '3', field: 'requestType', label: 'Request', visible: true, sortOrder: 3 },
      { id: '4', field: 'status', label: 'Status', visible: true, sortOrder: 4 },
      { id: '5', field: 'daysInStatus', label: 'Days in Status', visible: true, sortOrder: 5 },
      { id: '6', field: 'notes', label: 'Notes', visible: true, sortOrder: 6 },
      { id: '7', field: 'contact', label: 'Contact', visible: true, sortOrder: 7 },
    ],
    filters: [
      { field: 'customerStatus', operator: 'equals', value: 'needs_qualifying' },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'building-proposal',
    name: 'Building Proposal',
    viewType: 'sales_dashboard',
    tabId: 'building_proposal',
    columns: [
      { id: '1', field: 'name', label: 'Customer', visible: true, sortOrder: 1 },
      { id: '2', field: 'address', label: 'Address', visible: true, sortOrder: 2 },
      { id: '3', field: 'requestType', label: 'Request Type', visible: true, sortOrder: 3 },
    ],
    filters: [
      { field: 'status', operator: 'equals', value: 'building_proposal' },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pending-proposals',
    name: 'Pending Proposals',
    viewType: 'sales_dashboard',
    tabId: 'pending_proposals',
    columns: [
      { id: '1', field: 'createdAt', label: 'Date Uploaded', visible: true, sortOrder: 1 },
      { id: '2', field: 'name', label: 'Customer', visible: true, sortOrder: 2 },
      { id: '3', field: 'address', label: 'Address', visible: true, sortOrder: 3 },
      { id: '4', field: 'status', label: 'Status', visible: true, sortOrder: 4 },
      { id: '5', field: 'daysInStatus', label: 'Days in Status', visible: true, sortOrder: 5 },
      { id: '6', field: 'lastContacted', label: 'Last Contacted', visible: true, sortOrder: 6 },
      { id: '7', field: 'contact', label: 'Contact', visible: true, sortOrder: 7 },
    ],
    filters: [
      { field: 'status', operator: 'in', value: ['proposal_sent', 'awaiting_deposit'] },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'expired-quotes',
    name: 'Expired Quotes',
    viewType: 'sales_dashboard',
    tabId: 'expired_quotes',
    columns: [
      { id: '1', field: 'createdAt', label: 'Expired', visible: true, sortOrder: 1 },
      { id: '2', field: 'name', label: 'Customer', visible: true, sortOrder: 2 },
      { id: '3', field: 'address', label: 'Address', visible: true, sortOrder: 3 },
      { id: '4', field: 'status', label: 'Status', visible: true, sortOrder: 4 },
      { id: '5', field: 'daysInStatus', label: 'Days Since Expired', visible: true, sortOrder: 5 },
      { id: '6', field: 'lastContacted', label: 'Last Contacted', visible: true, sortOrder: 6 },
      { id: '7', field: 'contact', label: 'Contact', visible: true, sortOrder: 7 },
    ],
    filters: [
      { field: 'status', operator: 'equals', value: 'quote_expired' },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Admin Dashboard Views
  {
    id: 'admin-quote-requests',
    name: 'Quote Requests',
    viewType: 'admin_dashboard',
    tabId: 'quote_requests',
    columns: [
      { id: '1', field: 'name', label: 'Customer', visible: true, sortOrder: 1 },
      { id: '2', field: 'address', label: 'Address', visible: true, sortOrder: 2 },
      { id: '3', field: 'buildType', label: 'Job Type', visible: true, sortOrder: 3 },
      { id: '4', field: 'salespersonId', label: 'Salesperson', visible: true, sortOrder: 4 },
      { id: '5', field: 'createdAt', label: 'Received', visible: true, sortOrder: 5 },
      { id: '6', field: 'contact', label: 'Contact', visible: true, sortOrder: 6 },
    ],
    filters: [
      { field: 'status', operator: 'equals', value: 'new_lead' },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin-permits',
    name: 'Permits',
    viewType: 'admin_dashboard',
    tabId: 'permits',
    columns: [
      { id: '1', field: 'name', label: 'Customer', visible: true, sortOrder: 1 },
      { id: '2', field: 'address', label: 'Address', visible: true, sortOrder: 2 },
      { id: '3', field: 'status', label: 'Status', visible: true, sortOrder: 3 },
      { id: '4', field: 'daysInStatus', label: 'Days', visible: true, sortOrder: 4 },
      { id: '5', field: 'salespersonId', label: 'Salesperson', visible: true, sortOrder: 5 },
    ],
    filters: [
      { field: 'status', operator: 'in', value: ['permit_preparation', 'permit_submitted', 'permit_revision_needed', 'permit_resubmitted', 'customer_docs_needed'] },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin-materials',
    name: 'Materials',
    viewType: 'admin_dashboard',
    tabId: 'materials',
    columns: [
      { id: '1', field: 'name', label: 'Customer', visible: true, sortOrder: 1 },
      { id: '2', field: 'address', label: 'Address', visible: true, sortOrder: 2 },
      { id: '3', field: 'status', label: 'Status', visible: true, sortOrder: 3 },
      { id: '4', field: 'daysInStatus', label: 'Days', visible: true, sortOrder: 4 },
    ],
    filters: [
      { field: 'status', operator: 'in', value: ['ready_to_order_materials', 'materials_ordered'] },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin-scheduling',
    name: 'Scheduling',
    viewType: 'admin_dashboard',
    tabId: 'scheduling',
    columns: [
      { id: '1', field: 'name', label: 'Customer', visible: true, sortOrder: 1 },
      { id: '2', field: 'address', label: 'Address', visible: true, sortOrder: 2 },
      { id: '3', field: 'status', label: 'Status', visible: true, sortOrder: 3 },
      { id: '4', field: 'installationDate', label: 'Installation Date', visible: true, sortOrder: 4 },
      { id: '5', field: 'salespersonId', label: 'Salesperson', visible: true, sortOrder: 5 },
    ],
    filters: [
      { field: 'status', operator: 'in', value: ['scheduling_installation', 'installation_scheduled', 'scheduling_walkthrough'] },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin-installations',
    name: 'Installations',
    viewType: 'admin_dashboard',
    tabId: 'installations',
    columns: [
      { id: '1', field: 'name', label: 'Customer', visible: true, sortOrder: 1 },
      { id: '2', field: 'address', label: 'Address', visible: true, sortOrder: 2 },
      { id: '3', field: 'installationDate', label: 'Installation Date', visible: true, sortOrder: 3 },
      { id: '4', field: 'status', label: 'Status', visible: true, sortOrder: 4 },
      { id: '5', field: 'salespersonId', label: 'Salesperson', visible: true, sortOrder: 5 },
    ],
    filters: [
      { field: 'status', operator: 'in', value: ['installation_scheduled', 'installation_in_progress', 'installation_delayed'] },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Project Tracking - Pre-Sale View
  {
    id: 'project-tracking-presale',
    name: 'Project Tracking (Pre-Sale)',
    viewType: 'project_tracking_presale',
    tabId: 'project_tracking_presale',
    columns: [
      { id: '1', field: 'name', label: 'Customer', visible: true, sortOrder: 1 },
      { id: '2', field: 'salespersonId', label: 'Salesperson', visible: true, sortOrder: 2 },
      { id: '3', field: 'address', label: 'Address', visible: true, sortOrder: 3 },
      { id: '4', field: 'buildType', label: 'Job Type', visible: true, sortOrder: 4 },
      { id: '5', field: 'customerStatus', label: 'Customer Status', visible: true, sortOrder: 5 },
      { id: '6', field: 'status', label: 'Project Status', visible: true, sortOrder: 6 },
      { id: '7', field: 'portalLive', label: 'Portal', visible: true, sortOrder: 7 },
      { id: '8', field: 'contact', label: 'Contact', visible: true, sortOrder: 8 },
    ],
    filters: [],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Project Tracking - Post-Sale View
  {
    id: 'project-tracking-postsale',
    name: 'Project Tracking (Post-Sale)',
    viewType: 'project_tracking_postsale',
    tabId: 'project_tracking_postsale',
    columns: [
      { id: '1', field: 'name', label: 'Customer', visible: true, sortOrder: 1 },
      { id: '2', field: 'address', label: 'Address', visible: true, sortOrder: 2 },
      { id: '3', field: 'buildType', label: 'Job Type', visible: true, sortOrder: 3 },
      { id: '4', field: 'customerStatus', label: 'Customer Status', visible: true, sortOrder: 4 },
      { id: '5', field: 'status', label: 'Project Status', visible: true, sortOrder: 5 },
      { id: '6', field: 'portalLive', label: 'Portal', visible: true, sortOrder: 6 },
      { id: '7', field: 'contact', label: 'Contact', visible: true, sortOrder: 7 },
    ],
    filters: [],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DashboardViewsPage: React.FC = () => {
  const [views, setViews] = useState<ViewConfig[]>(defaultViews);
  const [editingView, setEditingView] = useState<ViewConfig | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterDashboard, setFilterDashboard] = useState<string>('all');

  const handleSaveView = (view: ViewConfig) => {
    if (editingView) {
      setViews(prev => prev.map(v => v.id === view.id ? view : v));
    } else {
      setViews(prev => [...prev, { ...view, id: `view-${Date.now()}` }]);
    }
    setEditingView(null);
    setShowAddModal(false);
  };

  const handleDeleteView = (viewId: string) => {
    const view = views.find(v => v.id === viewId);
    if (view?.isDefault) {
      alert('Cannot delete default views. You can only edit them.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this view?')) {
      setViews(prev => prev.filter(v => v.id !== viewId));
    }
  };

  const handleDuplicateView = (view: ViewConfig) => {
    const newView: ViewConfig = {
      ...view,
      id: `view-${Date.now()}`,
      name: `${view.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setViews(prev => [...prev, newView]);
  };

  const filteredViews = filterDashboard === 'all'
    ? views
    : views.filter(v => v.viewType === filterDashboard);

  const salesViews = views.filter(v => v.viewType === 'sales_dashboard');
  const adminViews = views.filter(v => v.viewType === 'admin_dashboard');
  const preSaleTrackingViews = views.filter(v => v.viewType === 'project_tracking_presale');
  const postSaleTrackingViews = views.filter(v => v.viewType === 'project_tracking_postsale');

  return (
    <PageLayout>
      <PageHeader
        title="Dashboard Views"
        subtitle="Configure dashboard tabs, columns, and filters"
        icon={
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        }
        actions={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add Custom View
          </Button>
        }
      />

      {/* Filter by Dashboard */}
      <div className="mb-6 flex items-center gap-4">
        <span className="text-sm text-gray-500">Filter by:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterDashboard('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filterDashboard === 'all'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterDashboard('sales_dashboard')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filterDashboard === 'sales_dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sales Dashboard ({salesViews.length})
          </button>
          <button
            onClick={() => setFilterDashboard('admin_dashboard')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filterDashboard === 'admin_dashboard'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Admin Dashboard ({adminViews.length})
          </button>
          <button
            onClick={() => setFilterDashboard('project_tracking_presale')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filterDashboard === 'project_tracking_presale'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pre-Sale ({preSaleTrackingViews.length})
          </button>
          <button
            onClick={() => setFilterDashboard('project_tracking_postsale')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filterDashboard === 'project_tracking_postsale'
                ? 'bg-teal-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Post-Sale ({postSaleTrackingViews.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredViews.map(view => (
          <Card key={view.id}>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{view.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      view.viewType === 'sales_dashboard'
                        ? 'bg-blue-100 text-blue-700'
                        : view.viewType === 'admin_dashboard'
                        ? 'bg-purple-100 text-purple-700'
                        : view.viewType === 'project_tracking_presale'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}>
                      {view.viewType === 'sales_dashboard' ? 'Sales'
                        : view.viewType === 'admin_dashboard' ? 'Admin'
                        : view.viewType === 'project_tracking_presale' ? 'Pre-Sale'
                        : 'Post-Sale'}
                    </span>
                    {view.isDefault && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                        Default
                      </span>
                    )}
                  </div>

                  {/* Columns Preview */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Columns:</p>
                    <div className="flex flex-wrap gap-1">
                      {view.columns.filter(c => c.visible).sort((a, b) => a.sortOrder - b.sortOrder).map(col => (
                        <span key={col.id} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {col.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Filters Preview */}
                  {view.filters.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Filters:</p>
                      <div className="flex flex-wrap gap-1">
                        {view.filters.map((filter, idx) => {
                          let label = filter.field;
                          if (filter.field === 'status') label = 'Project Status';
                          if (filter.field === 'customerStatus') label = 'Customer Status';
                          if (filter.field === 'buildType') label = 'Job Type';

                          return (
                            <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">
                              {label}: {Array.isArray(filter.value) ? `${filter.value.length} selected` : String(filter.value)}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingView(view)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDuplicateView(view)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    Duplicate
                  </button>
                  {!view.isDefault && (
                    <button
                      onClick={() => handleDeleteView(view.id)}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {(editingView || showAddModal) && (
        <ViewEditModal
          view={editingView}
          onSave={handleSaveView}
          onClose={() => {
            setEditingView(null);
            setShowAddModal(false);
          }}
        />
      )}
    </PageLayout>
  );
};

// View Edit Modal
interface ViewEditModalProps {
  view: ViewConfig | null;
  onSave: (view: ViewConfig) => void;
  onClose: () => void;
}

const ViewEditModal: React.FC<ViewEditModalProps> = ({ view, onSave, onClose }) => {
  const [name, setName] = useState(view?.name || '');
  const [viewType, setViewType] = useState<'sales_dashboard' | 'admin_dashboard' | 'project_tracking_presale' | 'project_tracking_postsale'>(
    (view?.viewType as 'sales_dashboard' | 'admin_dashboard' | 'project_tracking_presale' | 'project_tracking_postsale') || 'sales_dashboard'
  );
  const [columns, setColumns] = useState<ViewColumnConfig[]>(
    view?.columns || availableColumns.map((c, i) => ({
      id: c.id,
      field: c.field,
      label: c.label,
      visible: i < 5,
      sortOrder: i,
    }))
  );
  const [customerStatusFilter, setCustomerStatusFilter] = useState<string[]>(
    (view?.filters.find(f => f.field === 'customerStatus')?.value as string[]) || []
  );
  const [projectStatusFilter, setProjectStatusFilter] = useState<string[]>(
    (view?.filters.find(f => f.field === 'status')?.value as string[]) || []
  );
  const [buildTypeFilter, setBuildTypeFilter] = useState<string[]>(
    (view?.filters.find(f => f.field === 'buildType')?.value as string[]) || []
  );
  const [daysInStatusMin, setDaysInStatusMin] = useState<string>(
    (view?.filters.find(f => f.field === 'daysInStatus' && f.operator === 'greater_than')?.value as string) || ''
  );
  const [daysInStatusMax, setDaysInStatusMax] = useState<string>(
    (view?.filters.find(f => f.field === 'daysInStatus' && f.operator === 'less_than')?.value as string) || ''
  );

  const toggleColumn = (columnId: string) => {
    setColumns(prev => prev.map(c =>
      c.id === columnId ? { ...c, visible: !c.visible } : c
    ));
  };

  const updateColumnLabel = (columnId: string, newLabel: string) => {
    setColumns(prev => prev.map(c =>
      c.id === columnId ? { ...c, label: newLabel } : c
    ));
  };

  const moveColumn = (columnId: string, direction: 'up' | 'down') => {
    const idx = columns.findIndex(c => c.id === columnId);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === columns.length - 1)) return;

    const newColumns = [...columns];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newColumns[idx], newColumns[swapIdx]] = [newColumns[swapIdx], newColumns[idx]];
    newColumns.forEach((c, i) => c.sortOrder = i);
    setColumns(newColumns);
  };

  const toggleStatusFilter = (statusId: string, type: 'customer' | 'project') => {
    if (type === 'customer') {
      setCustomerStatusFilter(prev =>
        prev.includes(statusId) ? prev.filter(s => s !== statusId) : [...prev, statusId]
      );
    } else {
      setProjectStatusFilter(prev =>
        prev.includes(statusId) ? prev.filter(s => s !== statusId) : [...prev, statusId]
      );
    }
  };

  const toggleBuildTypeFilter = (typeId: string) => {
    setBuildTypeFilter(prev =>
      prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filters: ViewFilterConfig[] = [];
    if (customerStatusFilter.length > 0) {
      filters.push({ field: 'customerStatus', operator: 'in', value: customerStatusFilter });
    }
    if (projectStatusFilter.length > 0) {
      filters.push({ field: 'status', operator: 'in', value: projectStatusFilter });
    }
    if (buildTypeFilter.length > 0) {
      filters.push({ field: 'buildType', operator: 'in', value: buildTypeFilter });
    }
    if (daysInStatusMin) {
      filters.push({ field: 'daysInStatus', operator: 'greater_than', value: parseInt(daysInStatusMin) });
    }
    if (daysInStatusMax) {
      filters.push({ field: 'daysInStatus', operator: 'less_than', value: parseInt(daysInStatusMax) });
    }

    onSave({
      id: view?.id || '',
      name,
      viewType,
      tabId: view?.tabId || name.toLowerCase().replace(/\s+/g, '-'),
      columns,
      filters,
      isDefault: view?.isDefault || false,
      createdAt: view?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  // Get pre-sale and post-sale statuses for display
  const preSaleStatuses = customerStatuses.filter(s =>
    ['new_lead', 'contact_attempted', 'contacted', 'needs_qualifying', 'quote_scheduled',
     'building_proposal', 'proposal_sent', 'awaiting_deposit', 'active_project', 'complete',
     'quote_expired', 'lost'].includes(s.id)
  );

  const postSaleStatuses = projectStatuses.filter(s => s.phase === 'post_sale');

  return (
    <Modal isOpen onClose={onClose} title={view ? `Edit: ${view.name}` : 'Create Custom View'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* View Name & Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">View Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Hot Leads"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dashboard</label>
            <select
              value={viewType}
              onChange={e => setViewType(e.target.value as 'sales_dashboard' | 'admin_dashboard' | 'project_tracking_presale' | 'project_tracking_postsale')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={view?.isDefault}
            >
              {dashboardTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Columns */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
          <p className="text-xs text-gray-500 mb-3">Toggle visibility, reorder, and rename columns</p>
          <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
            {columns.sort((a, b) => a.sortOrder - b.sortOrder).map(col => (
              <div key={col.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={col.visible}
                    onChange={() => toggleColumn(col.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <input
                  type="text"
                  value={col.label}
                  onChange={e => updateColumnLabel(col.id, e.target.value)}
                  className={`flex-1 mx-2 px-2 py-1 text-sm border border-transparent rounded hover:border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 ${
                    col.visible ? 'text-gray-900' : 'text-gray-400'
                  }`}
                />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveColumn(col.id, 'up')}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveColumn(col.id, 'down')}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Filters</label>

          {/* Customer Status Filter */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Customer Status (Pre-Sale)</p>
            <div className="flex flex-wrap gap-2">
              {preSaleStatuses.map(status => (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => toggleStatusFilter(status.id, 'customer')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    customerStatusFilter.includes(status.id)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Status Filter */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Project Status (Post-Sale)</p>
            <div className="flex flex-wrap gap-2">
              {postSaleStatuses.map(status => (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => toggleStatusFilter(status.id, 'project')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    projectStatusFilter.includes(status.id)
                      ? 'bg-green-100 border-green-300 text-green-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job Type Filter */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Job Type</p>
            <div className="flex flex-wrap gap-2">
              {buildTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleBuildTypeFilter(type.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    buildTypeFilter.includes(type.id)
                      ? 'bg-orange-100 border-orange-300 text-orange-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Days in Status Filter */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Days in Status</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Min:</span>
                <input
                  type="number"
                  value={daysInStatusMin}
                  onChange={e => setDaysInStatusMin(e.target.value)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Max:</span>
                <input
                  type="number"
                  value={daysInStatusMax}
                  onChange={e => setDaysInStatusMax(e.target.value)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="∞"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {view ? 'Save Changes' : 'Create View'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
