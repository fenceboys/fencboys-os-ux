import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, Modal, StatusDropdown, Dropdown } from '../ui';
import { PillDropdown, buildTypeOptions, customerStatusOptions, projectStatusOptions } from '../ui/PillDropdown';
import { Table } from '../ui/Table';
import { Sidebar, SidebarSection, CheckboxFilter } from '../layout/Sidebar';
import { CustomerForm } from './CustomerForm';
import { useData } from '../../context/DataContext';
import { Customer, CustomerStatus, ProjectStatus, BuildType, LeadSource } from '../../types';

// Post-sale project statuses for sidebar filter
const postSaleStatuses = [
  { id: 'not_started', label: 'Not Started', phase: 'permits' },
  { id: 'permit_preparation', label: 'Permit Preparation', phase: 'permits' },
  { id: 'customer_docs_needed', label: 'Customer Docs Needed', phase: 'permits' },
  { id: 'permit_submitted', label: 'Permit Submitted', phase: 'permits' },
  { id: 'permit_revision_needed', label: 'Permit Revision Needed', phase: 'permits' },
  { id: 'permit_resubmitted', label: 'Permit Resubmitted', phase: 'permits' },
  { id: 'ready_to_order_materials', label: 'Ready to Order Materials', phase: 'materials' },
  { id: 'materials_ordered', label: 'Materials Ordered', phase: 'materials' },
  { id: 'scheduling_installation', label: 'Scheduling Installation', phase: 'scheduling' },
  { id: 'installation_scheduled', label: 'Installation Scheduled', phase: 'scheduling' },
  { id: 'installation_delayed', label: 'Installation Delayed', phase: 'scheduling' },
  { id: 'installation_in_progress', label: 'Installation In Progress', phase: 'installation' },
  { id: 'scheduling_walkthrough', label: 'Scheduling Walkthrough', phase: 'closeout' },
  { id: 'walkthrough_scheduled', label: 'Walkthrough Scheduled', phase: 'closeout' },
  { id: 'fixes_needed', label: 'Fixes Needed', phase: 'closeout' },
  { id: 'final_payment_due', label: 'Final Payment Due', phase: 'closeout' },
  { id: 'requesting_review', label: 'Requesting Review', phase: 'closeout' },
  { id: 'complete', label: 'Complete', phase: 'closeout' },
];

// Lead source options
const leadSourceOptions = [
  { value: 'unknown', label: 'Unknown' },
  { value: 'webflow_form', label: 'WebFlow Form' },
  { value: 'meta_ads', label: 'Meta Ads' },
  { value: 'google_lsa', label: 'Google LSA' },
  { value: 'referral', label: 'Referral' },
  { value: 'out_of_home', label: 'Out of Home' },
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'text', label: 'Text' },
  { value: 'organic_search', label: 'Organic Search' },
];

export const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { customers, projects, salespeople, updateCustomer, updateProject, deleteCustomer, deleteProject, getSalespersonById, requestTypeConfigs } = useData();

  // Helper to get request type info from config
  const getRequestTypeInfo = (requestType: string) => {
    const config = requestTypeConfigs.find(t => t.value === requestType && t.isActive);
    const colorMap: Record<string, string> = {
      build: 'bg-green-100 text-green-800',
      replace: 'bg-blue-100 text-blue-800',
      repair: 'bg-orange-100 text-orange-800',
    };
    return {
      label: config?.name || requestType,
      color: colorMap[requestType] || 'bg-gray-100 text-gray-800',
    };
  };

  // Request type options for dropdown
  const requestTypeOptions = requestTypeConfigs
    .filter(t => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(t => ({ value: t.value, label: t.name }));

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSalespeople, setSelectedSalespeople] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<CustomerStatus[]>([]);
  const [selectedProjectStatuses, setSelectedProjectStatuses] = useState<ProjectStatus[]>([]);
  const [selectedBuildTypes, setSelectedBuildTypes] = useState<BuildType[]>([]);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(searchParams.get('new') === 'true');
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    permits: true,
    materials: false,
    scheduling: false,
    installation: false,
    closeout: false,
  });

  const togglePhase = (phase: string) => {
    setExpandedPhases(prev => ({ ...prev, [phase]: !prev[phase] }));
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !customer.name.toLowerCase().includes(query) &&
        !customer.email.toLowerCase().includes(query) &&
        !customer.phone.includes(query) &&
        !customer.address.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Salesperson filter
    if (selectedSalespeople.length > 0 && !selectedSalespeople.includes(customer.salespersonId)) {
      return false;
    }

    // Customer status filter
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(customer.status)) {
      return false;
    }

    // Project status filter - show customer if any of their projects match
    if (selectedProjectStatuses.length > 0) {
      const customerProjects = projects.filter(p => p.customerId === customer.id);
      const hasMatchingProject = customerProjects.some(p => selectedProjectStatuses.includes(p.status));
      if (!hasMatchingProject) {
        return false;
      }
    }

    // Build type filter - show customer if any of their projects match
    if (selectedBuildTypes.length > 0) {
      const customerProjects = projects.filter(p => p.customerId === customer.id);
      const hasMatchingBuildType = customerProjects.some(p => p.buildType && selectedBuildTypes.includes(p.buildType));
      if (!hasMatchingBuildType) {
        return false;
      }
    }

    return true;
  });

  const handleSalespersonToggle = (id: string, checked: boolean) => {
    setSelectedSalespeople(prev =>
      checked ? [...prev, id] : prev.filter(sp => sp !== id)
    );
  };

  const handleStatusToggle = (status: CustomerStatus, checked: boolean) => {
    setSelectedStatuses(prev =>
      checked ? [...prev, status] : prev.filter(s => s !== status)
    );
  };

  const handleProjectStatusToggle = (status: ProjectStatus, checked: boolean) => {
    setSelectedProjectStatuses(prev =>
      checked ? [...prev, status] : prev.filter(s => s !== status)
    );
  };

  const handleBuildTypeToggle = (buildType: BuildType, checked: boolean) => {
    setSelectedBuildTypes(prev =>
      checked ? [...prev, buildType] : prev.filter(bt => bt !== buildType)
    );
  };

  const handleStatusChange = (customerId: string, newStatus: CustomerStatus) => {
    updateCustomer(customerId, { status: newStatus });
  };

  const handleDeleteCustomer = (customer: Customer) => {
    // Delete all associated projects first
    const customerProjects = projects.filter(p => p.customerId === customer.id);
    customerProjects.forEach(project => {
      deleteProject(project.id);
    });
    // Then delete the customer
    deleteCustomer(customer.id);
    setCustomerToDelete(null);
  };

  const closeNewCustomerModal = () => {
    setShowNewCustomerModal(false);
    setSearchParams({});
  };

  // Use customerStatusOptions for the table dropdown
  const statusOptions = customerStatusOptions.map(s => ({
    value: s.value,
    label: s.label,
  }));

  // Use projectStatusOptions (post-sale only) for project status dropdown
  const projectStatusDropdownOptions = projectStatusOptions.map(s => ({
    value: s.value,
    label: s.label,
  }));

  return (
    <div className="flex gap-6 min-w-0">
      {/* Sidebar Filters */}
      <Sidebar className="flex-shrink-0 sticky top-0 self-start">
        <SidebarSection title="Customer Status">
          {customerStatusOptions.map(status => {
            const count = customers.filter(c => c.status === status.value).length;
            return (
              <CheckboxFilter
                key={status.value}
                label={status.label}
                checked={selectedStatuses.includes(status.value as CustomerStatus)}
                onChange={(checked) => handleStatusToggle(status.value as CustomerStatus, checked)}
                count={count}
              />
            );
          })}
        </SidebarSection>

        <SidebarSection title="Project Status (Post-Sale)">
          {/* Permits */}
          <button
            onClick={() => togglePhase('permits')}
            className={`flex items-center justify-between w-full mb-2 px-2 py-1.5 text-left rounded-md transition-colors ${expandedPhases.permits ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
          >
            <span className="text-xs font-medium text-gray-700">Permits</span>
            <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expandedPhases.permits ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedPhases.permits && postSaleStatuses.filter(s => s.phase === 'permits').map(status => {
            const count = projects.filter(p => p.status === status.id).length;
            return (
              <CheckboxFilter
                key={status.id}
                label={status.label}
                checked={selectedProjectStatuses.includes(status.id as ProjectStatus)}
                onChange={(checked) => handleProjectStatusToggle(status.id as ProjectStatus, checked)}
                count={count}
              />
            );
          })}

          {/* Materials */}
          <button
            onClick={() => togglePhase('materials')}
            className={`flex items-center justify-between w-full mt-2 mb-2 px-2 py-1.5 text-left rounded-md transition-colors ${expandedPhases.materials ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
          >
            <span className="text-xs font-medium text-gray-700">Materials</span>
            <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expandedPhases.materials ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedPhases.materials && postSaleStatuses.filter(s => s.phase === 'materials').map(status => {
            const count = projects.filter(p => p.status === status.id).length;
            return (
              <CheckboxFilter
                key={status.id}
                label={status.label}
                checked={selectedProjectStatuses.includes(status.id as ProjectStatus)}
                onChange={(checked) => handleProjectStatusToggle(status.id as ProjectStatus, checked)}
                count={count}
              />
            );
          })}

          {/* Scheduling */}
          <button
            onClick={() => togglePhase('scheduling')}
            className={`flex items-center justify-between w-full mt-2 mb-2 px-2 py-1.5 text-left rounded-md transition-colors ${expandedPhases.scheduling ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
          >
            <span className="text-xs font-medium text-gray-700">Scheduling</span>
            <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expandedPhases.scheduling ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedPhases.scheduling && postSaleStatuses.filter(s => s.phase === 'scheduling').map(status => {
            const count = projects.filter(p => p.status === status.id).length;
            return (
              <CheckboxFilter
                key={status.id}
                label={status.label}
                checked={selectedProjectStatuses.includes(status.id as ProjectStatus)}
                onChange={(checked) => handleProjectStatusToggle(status.id as ProjectStatus, checked)}
                count={count}
              />
            );
          })}

          {/* Installation */}
          <button
            onClick={() => togglePhase('installation')}
            className={`flex items-center justify-between w-full mt-2 mb-2 px-2 py-1.5 text-left rounded-md transition-colors ${expandedPhases.installation ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
          >
            <span className="text-xs font-medium text-gray-700">Installation</span>
            <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expandedPhases.installation ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedPhases.installation && postSaleStatuses.filter(s => s.phase === 'installation').map(status => {
            const count = projects.filter(p => p.status === status.id).length;
            return (
              <CheckboxFilter
                key={status.id}
                label={status.label}
                checked={selectedProjectStatuses.includes(status.id as ProjectStatus)}
                onChange={(checked) => handleProjectStatusToggle(status.id as ProjectStatus, checked)}
                count={count}
              />
            );
          })}

          {/* Close Out */}
          <button
            onClick={() => togglePhase('closeout')}
            className={`flex items-center justify-between w-full mt-2 mb-2 px-2 py-1.5 text-left rounded-md transition-colors ${expandedPhases.closeout ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
          >
            <span className="text-xs font-medium text-gray-700">Close Out</span>
            <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expandedPhases.closeout ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedPhases.closeout && postSaleStatuses.filter(s => s.phase === 'closeout').map(status => {
            const count = projects.filter(p => p.status === status.id).length;
            return (
              <CheckboxFilter
                key={status.id}
                label={status.label}
                checked={selectedProjectStatuses.includes(status.id as ProjectStatus)}
                onChange={(checked) => handleProjectStatusToggle(status.id as ProjectStatus, checked)}
                count={count}
              />
            );
          })}
        </SidebarSection>

        <SidebarSection title="Salesperson">
          {salespeople.map(sp => {
            const count = customers.filter(c => c.salespersonId === sp.id).length;
            return (
              <CheckboxFilter
                key={sp.id}
                label={sp.name}
                checked={selectedSalespeople.includes(sp.id)}
                onChange={(checked) => handleSalespersonToggle(sp.id, checked)}
                count={count}
              />
            );
          })}
        </SidebarSection>

        <SidebarSection title="Job Type">
          {buildTypeOptions.map(option => {
            const count = projects.filter(p => p.buildType === option.value).length;
            return (
              <CheckboxFilter
                key={option.value}
                label={option.label}
                checked={selectedBuildTypes.includes(option.value as BuildType)}
                onChange={(checked) => handleBuildTypeToggle(option.value as BuildType, checked)}
                count={count}
              />
            );
          })}
        </SidebarSection>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your customer relationships
          </p>
        </div>

        {/* Search and New Customer Button */}
        <div className="flex items-center justify-between mb-4 gap-4 flex-nowrap">
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={() => setShowNewCustomerModal(true)} className="flex-shrink-0 whitespace-nowrap">
            + New Customer
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <Table<Customer>
            columns={[
              {
                key: 'name',
                header: 'Name',
                render: (customer) => (
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{customer.name}</div>
                    <div className="text-sm text-gray-500">
                      {customer.address}, {customer.city}, {customer.state}
                    </div>
                  </div>
                ),
              },
              {
                key: 'contact',
                header: 'Contact',
                render: (customer) => (
                  <div>
                    <div className="text-sm text-gray-900">{customer.phone}</div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Customer Status',
                render: (customer) => {
                  return (
                    <div onClick={(e) => e.stopPropagation()}>
                      <StatusDropdown
                        value={customer.status}
                        options={statusOptions}
                        onChange={(value) => handleStatusChange(customer.id, value as CustomerStatus)}
                        statusType="customer"
                      />
                    </div>
                  );
                },
              },
              {
                key: 'projectStatus',
                header: 'Project Status',
                render: (customer) => {
                  const customerProjects = projects.filter(p => p.customerId === customer.id);
                  if (customerProjects.length === 0) return <span className="text-gray-400 text-sm">No projects</span>;
                  const latestProject = customerProjects[0];
                  const isDisabled = customer.status !== 'active_project';
                  return (
                    <div onClick={(e) => e.stopPropagation()}>
                      <StatusDropdown
                        value={latestProject.status}
                        options={projectStatusDropdownOptions}
                        onChange={(value) => updateProject(latestProject.id, { status: value as ProjectStatus })}
                        disabled={isDisabled}
                        disabledReason="Customer status must be 'Active Project' to change project status"
                      />
                    </div>
                  );
                },
              },
              {
                key: 'portal',
                header: 'Customer Portal',
                render: (customer) => {
                  const customerProjects = projects.filter(p => p.customerId === customer.id);
                  if (customerProjects.length === 0) return <span className="text-gray-400 text-sm">-</span>;
                  const latestProject = customerProjects[0];
                  return (
                    <div onClick={(e) => e.stopPropagation()}>
                      <PillDropdown
                        options={[
                          { value: 'open', label: 'Open', color: 'green' },
                          { value: 'closed', label: 'Closed', color: 'red' },
                        ]}
                        value={latestProject.portalLive ? 'open' : 'closed'}
                        onChange={(value) => updateProject(latestProject.id, { portalLive: value === 'open' })}
                      />
                    </div>
                  );
                },
              },
              {
                key: 'buildType',
                header: 'Job Type',
                render: (customer) => {
                  const customerProjects = projects.filter(p => p.customerId === customer.id);
                  const latestProject = customerProjects[0];
                  if (!latestProject) return <span className="text-gray-400 text-sm">-</span>;
                  return (
                    <div onClick={(e) => e.stopPropagation()}>
                      <PillDropdown
                        options={buildTypeOptions}
                        value={latestProject.buildType || 'new_build'}
                        onChange={(value) => updateProject(latestProject.id, { buildType: value as BuildType })}
                      />
                    </div>
                  );
                },
              },
              {
                key: 'leadSource',
                header: 'Lead Source',
                render: (customer) => {
                  const customerProjects = projects.filter(p => p.customerId === customer.id);
                  const latestProject = customerProjects[0];
                  if (!latestProject) return <span className="text-gray-400 text-sm">-</span>;
                  return (
                    <div onClick={(e) => e.stopPropagation()} style={{ minWidth: '120px' }}>
                      <Dropdown
                        options={leadSourceOptions}
                        value={latestProject.leadSource || 'unknown'}
                        onChange={(value) => updateProject(latestProject.id, { leadSource: value as LeadSource })}
                      />
                    </div>
                  );
                },
              },
              {
                key: 'salesperson',
                header: 'Salesperson',
                render: (customer) => {
                  const salespersonOptions = salespeople.map(sp => ({
                    value: sp.id,
                    label: sp.name,
                  }));
                  return (
                    <div onClick={(e) => e.stopPropagation()} style={{ minWidth: '140px' }}>
                      <Dropdown
                        options={salespersonOptions}
                        value={customer.salespersonId || ''}
                        onChange={(value) => updateCustomer(customer.id, { salespersonId: value })}
                        placeholder="Assign..."
                      />
                    </div>
                  );
                },
              },
              {
                key: 'actions',
                header: '',
                render: (customer) => (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomerToDelete(customer);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete customer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                ),
              },
            ]}
            data={filteredCustomers}
            onRowClick={(customer) => navigate(`/customers/${customer.id}`)}
            emptyMessage="No customers found"
          />
        </div>
      </div>

      {/* New Customer Modal */}
      <Modal
        isOpen={showNewCustomerModal}
        onClose={closeNewCustomerModal}
        title="New Customer"
        size="lg"
      >
        <CustomerForm onClose={closeNewCustomerModal} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        title="Delete Customer"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{customerToDelete?.name}</span>?
          </p>
          <p className="text-sm text-gray-500">
            This will also delete all associated projects. This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setCustomerToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => customerToDelete && handleDeleteCustomer(customerToDelete)}
              className="!bg-red-600 hover:!bg-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
