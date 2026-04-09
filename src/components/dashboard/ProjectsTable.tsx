import React from 'react';
import { Project, ProjectStatus, BuildType, CustomerStatus } from '../../types';
import { Table, StatusDropdown, Dropdown } from '../ui';
import { PillDropdown, buildTypeOptions, customerStatusOptions, projectStatusOptions, portalStatusOptions } from '../ui/PillDropdown';
import { ContactActions } from '../ui/ContactActions';
import { useData } from '../../context/DataContext';

interface ProjectsTableProps {
  projects: Project[];
  onCustomerClick: (customerId: string) => void;
  showSalesperson?: boolean;
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  onCustomerClick,
  showSalesperson = true,
}) => {
  const { getCustomerById, getSalespersonById, updateProject, updateCustomer, salespeople, getActivitiesByProjectId } = useData();

  const statusOptions = projectStatusOptions.map(s => ({
    value: s.value,
    label: s.label,
  }));

  const salespersonOptions = salespeople.map(sp => ({
    value: sp.id,
    label: sp.name,
  }));

  // Calculate days in status
  const getDaysInStatus = (project: Project): number => {
    const statusDate = project.statusChangedAt ? new Date(project.statusChangedAt) : new Date(project.createdAt);
    return Math.floor((Date.now() - statusDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Get last contacted info
  const getLastContacted = (project: Project): { text: string; days: number } => {
    // First check the project's lastContacted field
    if (project.lastContacted) {
      const days = Math.floor((Date.now() - new Date(project.lastContacted).getTime()) / (1000 * 60 * 60 * 24));
      return {
        text: days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`,
        days,
      };
    }

    // Fall back to activity log
    const activities = getActivitiesByProjectId(project.id);
    const lastContact = activities
      .filter(a => ['message_outbound', 'message_inbound'].includes(a.type))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (!lastContact) {
      return { text: 'No contact', days: -1 };
    }

    const days = Math.floor((Date.now() - new Date(lastContact.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    return {
      text: days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`,
      days,
    };
  };

  const allColumns = [
    {
      key: 'name',
      header: 'Customer',
      render: (project: Project) => {
        const customer = getCustomerById(project.customerId);
        return (
          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {customer?.name}
          </div>
        );
      },
    },
    ...(showSalesperson ? [{
      key: 'salesperson',
      header: 'Salesperson',
      render: (project: Project) => (
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()} style={{ minWidth: '140px' }}>
          <Dropdown
            options={salespersonOptions}
            value={project.salespersonId || ''}
            onChange={(value) => updateProject(project.id, { salespersonId: value })}
            placeholder="Assign..."
          />
        </div>
      ),
    }] : []),
    { key: 'address', header: 'Address' },
    {
      key: 'buildType',
      header: 'Job Type',
      render: (project: Project) => (
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <PillDropdown
            options={buildTypeOptions}
            value={project.buildType || 'new_build'}
            onChange={(value) => updateProject(project.id, { buildType: value as BuildType })}
          />
        </div>
      ),
    },
    {
      key: 'customerStatus',
      header: 'Customer Status',
      render: (project: Project) => {
        const customer = getCustomerById(project.customerId);
        return (
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <PillDropdown
              options={customerStatusOptions}
              value={customer?.status || 'lead'}
              onChange={(value) => {
                if (customer) {
                  updateCustomer(customer.id, { status: value as CustomerStatus });
                }
              }}
            />
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Project Status',
      render: (project: Project) => (
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <StatusDropdown
            value={project.status}
            options={statusOptions}
            onChange={(value) => updateProject(project.id, { status: value as ProjectStatus })}
          />
        </div>
      ),
    },
    {
      key: 'portal',
      header: 'Portal',
      render: (project: Project) => (
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <PillDropdown
            options={portalStatusOptions}
            value={project.portalLive ? 'open' : 'closed'}
            onChange={(value) => updateProject(project.id, { portalLive: value === 'open' })}
          />
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (project: Project) => {
        const customer = getCustomerById(project.customerId);
        if (!customer) return null;
        return (
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <ContactActions
              phone={customer.phone}
              email={customer.email}
              customerName={customer.name}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table<Project>
        columns={allColumns}
        data={projects}
        onRowClick={(project) => onCustomerClick(project.customerId)}
        emptyMessage="No projects found"
      />
    </div>
  );
};
