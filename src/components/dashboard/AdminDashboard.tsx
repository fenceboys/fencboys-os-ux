import React, { useState } from 'react';
import { StatCard, Dropdown, Button, Modal } from '../ui';
import { Table } from '../ui/Table';
import { KanbanBoard } from './KanbanBoard';
import { ProjectsTable } from './ProjectsTable';
import { CustomerProjectModal } from './CustomerProjectModal';
import { CustomerForm } from '../customers/CustomerForm';
import { useData } from '../../context/DataContext';
import { getStatusInfo } from '../../constants/statuses';
import { Project, BuildType } from '../../types';
import { PillDropdown, buildTypeOptions } from '../ui/PillDropdown';
import { ContactActions } from '../ui/ContactActions';

type ViewMode = 'kanban' | 'table';
type FilterMode = 'all' | 'pre_sale' | 'post_sale';
type StatFilter = 'quote_requests' | 'quote_appts' | 'scheduling' | 'permits' | 'materials' | 'installations' | null;

export const AdminDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedStat, setSelectedStat] = useState<StatFilter>('quote_requests');
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const { projects, salespeople, getCustomerById, updateProject } = useData();

  const handleAssignSalesperson = (projectId: string, salespersonId: string) => {
    updateProject(projectId, { salespersonId });
  };

  const handleOpenPortalForScheduling = (project: Project) => {
    const customer = getCustomerById(project.customerId);
    const portalLink = `https://portal.fenceboys.com/schedule`;
    const message = encodeURIComponent(`Hi ${customer?.name}! Use this link to schedule your free on-site quote appointment: ${portalLink}\n\nJust pick a date and time that works for you!`);
    window.open(`sms:${customer?.phone}?body=${message}`, '_self');
    updateProject(project.id, { status: 'quote_scheduled' });
  };

  const handleScheduleManually = (project: Project) => {
    const customer = getCustomerById(project.customerId);
    const eventTitle = encodeURIComponent(`Quote Appointment - ${customer?.name}`);
    const eventDetails = encodeURIComponent(`Quote appointment for ${project.address}\n\nCustomer: ${customer?.name}\nPhone: ${customer?.phone}\nEmail: ${customer?.email}`);
    const eventLocation = encodeURIComponent(project.address || '');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const startTime = tomorrow.toISOString().replace(/-|:|\.\d{3}/g, '');
    tomorrow.setHours(10, 0, 0, 0);
    const endTime = tomorrow.toISOString().replace(/-|:|\.\d{3}/g, '');

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}&location=${eventLocation}&dates=${startTime}/${endTime}`;
    window.open(googleCalendarUrl, '_blank');
    updateProject(project.id, { status: 'quote_scheduled' });
  };

  // Filter functions for each stat
  const getQuoteRequests = () => projects.filter(p => p.status === 'new_lead');
  const getQuoteApptsToday = () => projects.filter(p => {
    if (!p.salesAppointment) return false;
    const today = new Date().toDateString();
    return new Date(p.salesAppointment).toDateString() === today;
  });
  const getSchedulingProjects = () => projects.filter(p =>
    p.status === 'scheduling_installation' ||
    p.status === 'quote_scheduled' ||
    p.status === 'scheduling_walkthrough'
  );
  const getPermitProjects = () => projects.filter(p =>
    p.status === 'permit_preparation' || p.status === 'permit_submitted' ||
    p.status === 'permit_revision_needed' || p.status === 'permit_resubmitted' ||
    p.status === 'customer_docs_needed'
  );
  const getMaterialsProjects = () => projects.filter(p =>
    p.status === 'ready_to_order_materials' || p.status === 'materials_ordered'
  );
  const getInstallationsToday = () => projects.filter(p => {
    if (!p.installationDate) return false;
    const today = new Date().toDateString();
    return new Date(p.installationDate).toDateString() === today;
  });

  // Calculate stats
  const quoteRequests = getQuoteRequests().length;
  const quoteApptsToday = getQuoteApptsToday().length;
  const schedulingProjectsCount = getSchedulingProjects().length;
  const permitProjects = getPermitProjects();
  const permitReady = permitProjects.filter(p => p.status === 'permit_preparation' || p.status === 'customer_docs_needed').length;
  const permitReview = permitProjects.filter(p => p.status === 'permit_submitted' || p.status === 'permit_revision_needed' || p.status === 'permit_resubmitted').length;
  const materialsProjects = getMaterialsProjects();
  const materialsOrder = materialsProjects.filter(p => p.status === 'ready_to_order_materials').length;
  const materialsInProgress = materialsProjects.filter(p => p.status === 'materials_ordered').length;
  const installationsToday = getInstallationsToday().length;

  // Get filtered projects for the stat-filtered section
  const getStatFilteredProjects = (): Project[] => {
    if (selectedStat === 'quote_requests') return getQuoteRequests();
    if (selectedStat === 'quote_appts') return getQuoteApptsToday();
    if (selectedStat === 'scheduling') return getSchedulingProjects();
    if (selectedStat === 'permits') return getPermitProjects();
    if (selectedStat === 'materials') return getMaterialsProjects();
    if (selectedStat === 'installations') return getInstallationsToday();
    return [];
  };

  const statFilteredProjects = getStatFilteredProjects();

  // Get filtered projects for project tracking section
  const getTrackingFilteredProjects = (): Project[] => {
    return projects.filter(p => {
      if (selectedSalesperson !== 'all' && p.salespersonId !== selectedSalesperson) {
        return false;
      }
      if (filterMode !== 'all') {
        const status = getStatusInfo(p.status);
        if (filterMode === 'pre_sale' && status?.phase !== 'pre_sale') return false;
        if (filterMode === 'post_sale' && status?.phase !== 'post_sale') return false;
      }
      return true;
    });
  };

  const trackingFilteredProjects = getTrackingFilteredProjects();

  const handleStatClick = (stat: StatFilter) => {
    setSelectedStat(selectedStat === stat ? null : stat);
  };

  const getSectionTitle = (): string => {
    switch (selectedStat) {
      case 'quote_requests': return 'New Leads';
      case 'quote_appts': return 'Quotes Today';
      case 'scheduling': return 'Scheduling';
      case 'permits': return 'Permits';
      case 'materials': return 'Materials';
      case 'installations': return 'Installs Today';
      default: return '';
    }
  };

  const salespersonOptions = [
    { value: 'all', label: 'All Salespeople' },
    ...salespeople.map(sp => ({ value: sp.id, label: sp.name })),
  ];

  // Render the scheduling table with all actions (for quote_requests)
  const renderSchedulingTable = () => (
    <Table<Project>
      columns={[
        {
          key: 'assign',
          header: 'Salesperson',
          render: (project) => (
            <div onClick={(e) => e.stopPropagation()}>
              <Dropdown
                options={salespeople.map(sp => ({ value: sp.id, label: sp.name }))}
                value={project.salespersonId || ''}
                onChange={(value) => handleAssignSalesperson(project.id, value)}
                placeholder="Assign..."
              />
            </div>
          ),
        },
        {
          key: 'customer',
          header: 'Customer',
          render: (project) => {
            const customer = getCustomerById(project.customerId);
            return (
              <button
                onClick={() => setSelectedCustomerId(project.customerId)}
                className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-left"
              >
                {customer?.name}
              </button>
            );
          },
        },
        {
          key: 'address',
          header: 'Address',
          render: (project) => (
            <span className="text-gray-600">{project.address?.split(',')[0]}</span>
          ),
        },
        {
          key: 'buildType',
          header: 'Build Type',
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
          key: 'added',
          header: 'Added',
          render: (project) => {
            const daysOld = Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24));
            return (
              <span className={daysOld > 1 ? 'text-orange-600 font-medium' : 'text-gray-600'}>
                {daysOld === 0 ? 'Today' : daysOld === 1 ? '1 day' : `${daysOld} days`}
              </span>
            );
          },
        },
        {
          key: 'contact',
          header: 'Contact',
          render: (project) => {
            const customer = getCustomerById(project.customerId);
            if (!customer) return null;
            return (
              <div onClick={(e) => e.stopPropagation()}>
                <ContactActions
                  phone={customer.phone}
                  email={customer.email}
                  customerName={customer.name}
                  size="sm"
                />
              </div>
            );
          },
        },
        {
          key: 'schedule',
          header: 'Schedule',
          render: (project) => (
            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleOpenPortalForScheduling(project)}
                className="px-3 py-1 border border-blue-200 text-blue-600 rounded hover:bg-blue-50 transition-colors"
              >
                Portal
              </button>
              <button
                onClick={() => handleScheduleManually(project)}
                className="px-3 py-1 border border-green-200 text-green-600 rounded hover:bg-green-50 transition-colors"
              >
                Manual
              </button>
            </div>
          ),
        },
      ]}
      data={statFilteredProjects}
      emptyMessage="No new leads to schedule"
    />
  );

  // Render the stat-filtered content section
  const renderStatContent = () => {
    if (selectedStat === 'quote_requests') {
      return renderSchedulingTable();
    }

    // For other stats, show a simple projects table
    return (
      <ProjectsTable
        projects={statFilteredProjects}
        onCustomerClick={(customerId) => setSelectedCustomerId(customerId)}
      />
    );
  };

  return (
    <div>
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
        <Button onClick={() => setShowNewCustomerModal(true)}>
          + New Customer
        </Button>
      </div>

      {/* Stats Bar - Interactive Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="New Leads"
          value={quoteRequests}
          iconBgColor="bg-blue-100"
          icon={
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          }
          onClick={() => handleStatClick('quote_requests')}
          isActive={selectedStat === 'quote_requests'}
        />
        <StatCard
          title="Quotes Today"
          value={quoteApptsToday}
          iconBgColor="bg-purple-100"
          icon={
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          onClick={() => handleStatClick('quote_appts')}
          isActive={selectedStat === 'quote_appts'}
        />
        <StatCard
          title="Scheduling"
          value={schedulingProjectsCount}
          iconBgColor="bg-indigo-100"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          onClick={() => handleStatClick('scheduling')}
          isActive={selectedStat === 'scheduling'}
        />
        <StatCard
          title="Permits"
          value={permitProjects.length}
          iconBgColor="bg-green-100"
          icon={
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          onClick={() => handleStatClick('permits')}
          isActive={selectedStat === 'permits'}
        />
        <StatCard
          title="Materials"
          value={materialsProjects.length}
          iconBgColor="bg-orange-100"
          icon={
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          onClick={() => handleStatClick('materials')}
          isActive={selectedStat === 'materials'}
        />
        <StatCard
          title="Installs Today"
          value={installationsToday}
          iconBgColor="bg-yellow-100"
          icon={
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          onClick={() => handleStatClick('installations')}
          isActive={selectedStat === 'installations'}
        />
      </div>

      {/* Stat-Filtered Section */}
      {selectedStat && (
        <div className="bg-white border border-gray-200 rounded-lg mb-8">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {getSectionTitle()} ({statFilteredProjects.length})
            </h3>
            <button
              onClick={() => setSelectedStat(null)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {renderStatContent()}
        </div>
      )}

      {/* Project Tracking Section - Always Visible */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Project Tracking</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded text-sm ${
                  filterMode === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode('pre_sale')}
                className={`px-3 py-1.5 rounded text-sm ${
                  filterMode === 'pre_sale'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Pre-Sale
              </button>
              <button
                onClick={() => setFilterMode('post_sale')}
                className={`px-3 py-1.5 rounded text-sm ${
                  filterMode === 'post_sale'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Post-Sale
              </button>
            </div>

            <Dropdown
              options={salespersonOptions}
              value={selectedSalesperson}
              onChange={setSelectedSalesperson}
              className="w-48"
            />

            <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded text-sm ${
                  viewMode === 'table'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded text-sm ${
                  viewMode === 'kanban'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Kanban
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          {viewMode === 'kanban' ? (
            <KanbanBoard
              projects={trackingFilteredProjects}
              filterMode={filterMode}
              onCustomerClick={(customerId) => setSelectedCustomerId(customerId)}
            />
          ) : (
            <ProjectsTable
              projects={trackingFilteredProjects}
              onCustomerClick={(customerId) => setSelectedCustomerId(customerId)}
            />
          )}
        </div>
      </div>

      {/* Customer/Project Modal */}
      <CustomerProjectModal
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />

      {/* New Customer Modal */}
      <Modal
        isOpen={showNewCustomerModal}
        onClose={() => setShowNewCustomerModal(false)}
        title="New Customer"
      >
        <CustomerForm onClose={() => setShowNewCustomerModal(false)} />
      </Modal>
    </div>
  );
};
