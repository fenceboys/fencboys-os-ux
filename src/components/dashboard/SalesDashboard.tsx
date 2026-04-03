import React, { useState } from 'react';
import { StatCard, TabBar, StatusDropdown, Button, Modal, Dropdown, ContactActions } from '../ui';
import { PillDropdown, buildTypeOptions, customerStatusOptions } from '../ui/PillDropdown';
import { Table } from '../ui/Table';
import { CustomerProjectModal } from './CustomerProjectModal';
import { CustomerForm } from '../customers/CustomerForm';
import { useData } from '../../context/DataContext';
import { getStatusInfo, projectStatuses } from '../../constants/statuses';
import { Project, ProjectStatus, RequestType, BuildType, CustomerStatus } from '../../types';

const tabs = [
  { id: 'my_projects', label: 'My Leads' },
  { id: 'quote_appointments', label: 'Quote Appointments' },
  { id: 'new_requests', label: 'Lead Verification' },
  { id: 'building_proposal', label: 'Building Proposal' },
  { id: 'pending_proposals', label: 'Pending Proposals' },
  { id: 'expired_quotes', label: 'Expired Quotes' },
];

type CalendarView = 'table' | 'week' | 'month';

export const SalesDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('my_projects');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [notesModal, setNotesModal] = useState<{ customerId: string; customerName: string; notes: string } | null>(null);
  const [calendarView, setCalendarView] = useState<CalendarView>('table');
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const { projects, getCustomerById, updateCustomer, updateProject, getActivitiesByProjectId, requestTypeConfigs } = useData();

  // Helper to get request type label from config
  const getRequestTypeLabel = (requestType: string) => {
    const config = requestTypeConfigs.find(t => t.value === requestType && t.isActive);
    return config?.name || requestType;
  };

  // Request type options for dropdown
  const requestTypeOptions = requestTypeConfigs
    .filter(t => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(t => ({ value: t.value, label: t.name }));

  // Salespeople only see projects where customer status is 'lead' (pre-sale)
  const leadProjects = projects.filter(p => {
    const customer = getCustomerById(p.customerId);
    return customer?.status === 'lead';
  });

  // Status options limited to pre-sale statuses for salespeople
  const preSaleStatusOptions = projectStatuses
    .filter(s => s.phase === 'pre_sale')
    .map(s => ({
      value: s.id,
      label: s.label,
    }));

  const preSaleProjects = leadProjects.filter(p => {
    const status = getStatusInfo(p.status);
    return status?.phase === 'pre_sale';
  });

  const quoteScheduledCount = leadProjects.filter(p => p.status === 'quote_scheduled').length;

  const pendingProposals = leadProjects.filter(p => p.status === 'proposal_sent' || p.status === 'awaiting_deposit');

  const pipelineValue = leadProjects.reduce((sum, p) => {
    const status = getStatusInfo(p.status);
    if (status?.phase === 'pre_sale') return sum + 5000; // Mock value
    return sum;
  }, 0);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'my_projects':
        return (
          <Table<Project>
            columns={[
              {
                key: 'name',
                header: 'Customer',
                render: (project) => {
                  const customer = getCustomerById(project.customerId);
                  return (
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {customer?.name}
                    </div>
                  );
                },
              },
              { key: 'address', header: 'Address' },
              {
                key: 'buildType',
                header: 'Build Type',
                render: (project) => {
                  return (
                    <div onClick={(e) => e.stopPropagation()}>
                      <PillDropdown
                        options={buildTypeOptions}
                        value={project.buildType || 'new_build'}
                        onChange={(value) => updateProject(project.id, { buildType: value as BuildType })}
                      />
                    </div>
                  );
                },
              },
              {
                key: 'customerStatus',
                header: 'Customer Status',
                render: (project) => {
                  const customer = getCustomerById(project.customerId);
                  return (
                    <div onClick={(e) => e.stopPropagation()}>
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
                render: (project) => (
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown
                      value={project.status}
                      options={preSaleStatusOptions}
                      onChange={(value) => updateProject(project.id, { status: value as ProjectStatus })}
                    />
                  </div>
                ),
              },
              {
                key: 'daysInStatus',
                header: 'Days in Status',
                render: (project) => {
                  const days = Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div className="text-center">
                      <span className={days > 7 ? 'text-orange-600 font-medium' : 'text-gray-600'}>
                        {days}
                      </span>
                    </div>
                  );
                },
              },
              {
                key: 'appointment',
                header: 'Quote Appointment',
                render: (project) => {
                  if (!project.salesAppointment) {
                    return <span className="text-gray-400">Not scheduled</span>;
                  }
                  const date = new Date(project.salesAppointment);
                  return (
                    <div>
                      <div className="text-gray-900">{date.toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  );
                },
              },
              {
                key: 'lastContacted',
                header: 'Last Contacted',
                render: (project) => {
                  const activities = getActivitiesByProjectId(project.id);
                  const lastContact = activities
                    .filter(a => ['message_outbound', 'message_inbound'].includes(a.type))
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

                  if (!lastContact) {
                    return <span className="text-gray-400">No contact</span>;
                  }

                  const days = Math.floor((Date.now() - new Date(lastContact.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <span className={days > 3 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`}
                    </span>
                  );
                },
              },
              {
                key: 'contact',
                header: 'Contact',
                render: (project) => {
                  const customer = getCustomerById(project.customerId);
                  return (
                    <div onClick={(e) => e.stopPropagation()}>
                      <ContactActions
                        phone={customer?.phone || ''}
                        email={customer?.email || ''}
                        customerName={customer?.name}
                      />
                    </div>
                  );
                },
              },
            ]}
            data={leadProjects}
            onRowClick={(project) => setSelectedCustomerId(project.customerId)}
            emptyMessage="No leads found"
          />
        );

      case 'quote_appointments':
        const quoteScheduledProjects = leadProjects
          .filter(p => p.status === 'quote_scheduled' && p.salesAppointment)
          .sort((a, b) => new Date(a.salesAppointment!).getTime() - new Date(b.salesAppointment!).getTime());

        const renderCalendarContent = () => {
          if (calendarView === 'table') {
            return (
              <Table<Project>
                columns={[
                  {
                    key: 'appointment',
                    header: 'Date & Time',
                    render: (project) => {
                      const date = new Date(project.salesAppointment!);
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();
                      return (
                        <div>
                          <div className={`font-medium ${isToday ? 'text-blue-600' : isTomorrow ? 'text-green-600' : 'text-gray-900'}`}>
                            {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-sm text-gray-500">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      );
                    },
                  },
                  {
                    key: 'customer',
                    header: 'Customer',
                    render: (project) => {
                      const customer = getCustomerById(project.customerId);
                      return (
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{customer?.name}</div>
                          <div className="text-sm text-gray-500">{customer?.phone}</div>
                        </div>
                      );
                    },
                  },
                  { key: 'address', header: 'Address' },
                  {
                    key: 'buildType',
                    header: 'Build Type',
                    render: (project) => {
                      return (
                        <div onClick={(e) => e.stopPropagation()}>
                          <PillDropdown
                            options={buildTypeOptions}
                            value={project.buildType || 'new_build'}
                            onChange={(value) => updateProject(project.id, { buildType: value as BuildType })}
                          />
                        </div>
                      );
                    },
                  },
                  {
                    key: 'status',
                    header: 'Project Status',
                    render: (project) => (
                      <div onClick={(e) => e.stopPropagation()}>
                        <StatusDropdown
                          value={project.status}
                          options={preSaleStatusOptions}
                          onChange={(newStatus) => updateProject(project.id, { status: newStatus as ProjectStatus })}
                        />
                      </div>
                    ),
                  },
                  {
                    key: 'contact',
                    header: 'Contact',
                    render: (project) => {
                      const customer = getCustomerById(project.customerId);
                      return (
                        <div onClick={(e) => e.stopPropagation()}>
                          <ContactActions
                            phone={customer?.phone || ''}
                            email={customer?.email || ''}
                            customerName={customer?.name}
                          />
                        </div>
                      );
                    },
                  },
                ]}
                data={quoteScheduledProjects}
                onRowClick={(project) => setSelectedCustomerId(project.customerId)}
                emptyMessage="No quote appointments scheduled"
              />
            );
          }

          if (calendarView === 'week') {
            // Week view - show 7 days starting from today
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

            const weekDays = Array.from({ length: 7 }, (_, i) => {
              const date = new Date(startOfWeek);
              date.setDate(startOfWeek.getDate() + i);
              return date;
            });

            return (
              <div className="p-4">
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => {
                    const dayAppointments = quoteScheduledProjects.filter(p => {
                      const apptDate = new Date(p.salesAppointment!);
                      return apptDate.toDateString() === day.toDateString();
                    });
                    const isToday = day.toDateString() === today.toDateString();

                    return (
                      <div key={index} className={`border rounded-lg min-h-[200px] ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <div className={`p-2 text-center border-b ${isToday ? 'border-blue-200 bg-blue-100' : 'border-gray-200 bg-gray-50'}`}>
                          <div className="text-xs text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                          <div className={`text-lg font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>{day.getDate()}</div>
                        </div>
                        <div className="p-2 space-y-2">
                          {dayAppointments.map(project => {
                            const customer = getCustomerById(project.customerId);
                            const time = new Date(project.salesAppointment!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                              <div
                                key={project.id}
                                onClick={() => setSelectedCustomerId(project.customerId)}
                                className="p-2 bg-white border border-gray-200 rounded text-xs cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                              >
                                <div className="font-medium text-gray-900 truncate">{customer?.name}</div>
                                <div className="text-gray-500">{time}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // Month view
          const today = new Date();
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          const startDay = firstDayOfMonth.getDay();
          const daysInMonth = lastDayOfMonth.getDate();

          const calendarDays: (Date | null)[] = [];
          // Add empty cells for days before the first day
          for (let i = 0; i < startDay; i++) {
            calendarDays.push(null);
          }
          // Add all days of the month
          for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push(new Date(today.getFullYear(), today.getMonth(), i));
          }

          return (
            <div className="p-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="p-2 min-h-[100px]" />;
                  }

                  const dayAppointments = quoteScheduledProjects.filter(p => {
                    const apptDate = new Date(p.salesAppointment!);
                    return apptDate.toDateString() === day.toDateString();
                  });
                  const isToday = day.toDateString() === today.toDateString();

                  return (
                    <div
                      key={index}
                      className={`border rounded min-h-[100px] ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className={`p-1 text-right ${isToday ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                        <span className="text-sm">{day.getDate()}</span>
                      </div>
                      <div className="px-1 pb-1 space-y-1">
                        {dayAppointments.slice(0, 2).map(project => {
                          const customer = getCustomerById(project.customerId);
                          const time = new Date(project.salesAppointment!).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                          return (
                            <div
                              key={project.id}
                              onClick={() => setSelectedCustomerId(project.customerId)}
                              className="p-1 bg-blue-100 text-blue-800 rounded text-xs cursor-pointer hover:bg-blue-200 truncate"
                            >
                              {time} {customer?.name}
                            </div>
                          );
                        })}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">+{dayAppointments.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        };

        return (
          <div>
            <div className="flex items-center justify-end px-4 py-3 border-b border-gray-200">
              <div className="flex space-x-1">
                <button
                  onClick={() => setCalendarView('table')}
                  className={`px-3 py-1.5 text-sm rounded ${calendarView === 'table' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Table
                </button>
                <button
                  onClick={() => setCalendarView('week')}
                  className={`px-3 py-1.5 text-sm rounded ${calendarView === 'week' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setCalendarView('month')}
                  className={`px-3 py-1.5 text-sm rounded ${calendarView === 'month' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Month
                </button>
              </div>
            </div>
            {renderCalendarContent()}
          </div>
        );

      case 'new_requests':
        // Filter projects where customer needs qualifying
        const newLeads = projects.filter(p => {
          const customer = getCustomerById(p.customerId);
          return customer?.status === 'needs_qualifying';
        });
        return (
          <Table<Project>
            columns={[
              {
                key: 'customer',
                header: 'Customer',
                render: (project) => {
                  const customer = getCustomerById(project.customerId);
                  return (
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{customer?.name}</div>
                      <div className="text-sm text-gray-500">{customer?.phone}</div>
                    </div>
                  );
                },
              },
              { key: 'address', header: 'Address' },
              {
                key: 'requestType',
                header: 'Request',
                render: (project) => {
                  const customer = getCustomerById(project.customerId);
                  return (
                    <div onClick={(e) => e.stopPropagation()} style={{ minWidth: '140px' }}>
                      <Dropdown
                        options={requestTypeOptions}
                        value={customer?.requestType || ''}
                        onChange={(value) => {
                          if (customer) {
                            updateCustomer(customer.id, { requestType: value as RequestType });
                          }
                        }}
                      />
                    </div>
                  );
                },
              },
              {
                key: 'status',
                header: 'Status',
                render: (project) => (
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown
                      value={project.status}
                      options={preSaleStatusOptions}
                      onChange={(value) => updateProject(project.id, { status: value as ProjectStatus })}
                    />
                  </div>
                ),
              },
              {
                key: 'daysInStatus',
                header: 'Days in Status',
                render: (project) => {
                  const days = Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div className="text-center">
                      <span className={days > 3 ? 'text-orange-600 font-medium' : 'text-gray-600'}>
                        {days}
                      </span>
                    </div>
                  );
                },
              },
              {
                key: 'notes',
                header: 'Notes',
                render: (project) => {
                  const customer = getCustomerById(project.customerId);
                  const hasNotes = customer?.notes && customer.notes.trim().length > 0;
                  return (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hasNotes) {
                          setNotesModal({
                            customerId: project.customerId,
                            customerName: customer?.name || '',
                            notes: customer?.notes || '',
                          });
                        }
                      }}
                      className={`px-3 py-1 border rounded text-sm transition-colors ${
                        hasNotes
                          ? 'border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100'
                          : 'border-gray-300 text-gray-400 cursor-default'
                      }`}
                    >
                      {hasNotes ? 'View Notes' : 'No Notes'}
                    </button>
                  );
                },
              },
              {
                key: 'contact',
                header: 'Contact',
                render: (project) => {
                  const customer = getCustomerById(project.customerId);
                  return (
                    <div onClick={(e) => e.stopPropagation()}>
                      <ContactActions
                        phone={customer?.phone || ''}
                        email={customer?.email || ''}
                        customerName={customer?.name}
                      />
                    </div>
                  );
                },
              },
            ]}
            data={newLeads}
            onRowClick={(project) => setSelectedCustomerId(project.customerId)}
            emptyMessage="No new quote requests"
          />
        );

      case 'building_proposal':
        const buildingProposal = leadProjects.filter(p => p.status === 'building_proposal');
        return buildingProposal.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No proposals currently being built</p>
          </div>
        ) : (
          <div className="p-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {buildingProposal.map((project) => {
              const customer = getCustomerById(project.customerId);
              return (
                <div
                  key={project.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all"
                  onClick={() => setSelectedCustomerId(project.customerId)}
                >
                  <div className="font-medium text-gray-900 text-sm truncate">{customer?.name}</div>
                  <div className="text-xs text-gray-500 truncate mt-1">{project.address}</div>
                  <span className="text-xs text-gray-400 mt-1 block">{getRequestTypeLabel(customer?.requestType || '')}</span>
                </div>
              );
            })}
          </div>
        );

      case 'pending_proposals':
        return (
          <Table<Project>
            columns={[
              {
                key: 'dateUploaded',
                header: 'Date Uploaded',
                render: (project) => {
                  const date = new Date(project.createdAt);
                  return (
                    <div>
                      <div className="font-medium text-gray-900">
                        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  );
                },
              },
              {
                key: 'customer',
                header: 'Customer',
                render: (project) => {
                  const customer = getCustomerById(project.customerId);
                  return (
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{customer?.name}</div>
                      <div className="text-sm text-gray-500">{customer?.phone}</div>
                    </div>
                  );
                },
              },
              { key: 'address', header: 'Address' },
              {
                key: 'status',
                header: 'Status',
                render: (project) => (
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown
                      value={project.status}
                      options={preSaleStatusOptions}
                      onChange={(value) => updateProject(project.id, { status: value as ProjectStatus })}
                    />
                  </div>
                ),
              },
              {
                key: 'daysInStatus',
                header: 'Days in Status',
                render: (project) => {
                  const days = Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div className="text-center">
                      <span className={days > 7 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                        {days}
                      </span>
                    </div>
                  );
                },
              },
              {
                key: 'lastContacted',
                header: 'Last Contacted',
                render: (project) => {
                  const activities = getActivitiesByProjectId(project.id);
                  const lastContact = activities
                    .filter(a => ['message_outbound', 'message_inbound'].includes(a.type))
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

                  if (!lastContact) {
                    return <span className="text-gray-400">No contact</span>;
                  }

                  const days = Math.floor((Date.now() - new Date(lastContact.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <span className={days > 3 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`}
                    </span>
                  );
                },
              },
              {
                key: 'contact',
                header: 'Contact',
                render: (project) => {
                  const customer = getCustomerById(project.customerId);
                  return (
                    <div onClick={(e) => e.stopPropagation()}>
                      <ContactActions
                        phone={customer?.phone || ''}
                        email={customer?.email || ''}
                        customerName={customer?.name}
                      />
                    </div>
                  );
                },
              },
            ]}
            data={pendingProposals}
            onRowClick={(project) => setSelectedCustomerId(project.customerId)}
            emptyMessage="No pending proposals"
          />
        );

      case 'expired_quotes':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const expiredQuotes = leadProjects.filter(p => {
          if (p.status !== 'quote_expired') return false;
          // Only show quotes expired within last 30 days
          const statusDate = p.statusChangedAt ? new Date(p.statusChangedAt) : new Date(p.createdAt);
          return statusDate >= thirtyDaysAgo;
        });
        return (
          <Table<Project>
            columns={[
              {
                key: 'expiredDate',
                header: 'Expired',
                render: (project) => {
                  const date = new Date(project.createdAt);
                  return (
                    <div className="text-gray-900">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  );
                },
              },
              {
                key: 'customer',
                header: 'Customer',
                render: (project) => {
                  const customer = getCustomerById(project.customerId);
                  return (
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{customer?.name}</div>
                      <div className="text-sm text-gray-500">{customer?.phone}</div>
                    </div>
                  );
                },
              },
              { key: 'address', header: 'Address' },
              {
                key: 'status',
                header: 'Status',
                render: (project) => (
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown
                      value={project.status}
                      options={preSaleStatusOptions}
                      onChange={(value) => updateProject(project.id, { status: value as ProjectStatus })}
                    />
                  </div>
                ),
              },
              {
                key: 'daysSinceExpired',
                header: 'Days Since Expired',
                render: (project) => {
                  const days = Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div className="text-center">
                      <span className={days > 14 ? 'text-gray-400' : 'text-gray-600'}>
                        {days}
                      </span>
                    </div>
                  );
                },
              },
              {
                key: 'lastContacted',
                header: 'Last Contacted',
                render: (project) => {
                  const activities = getActivitiesByProjectId(project.id);
                  const lastContact = activities
                    .filter(a => ['message_outbound', 'message_inbound'].includes(a.type))
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

                  if (!lastContact) {
                    return <span className="text-gray-400">No contact</span>;
                  }

                  const days = Math.floor((Date.now() - new Date(lastContact.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <span className={days > 3 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`}
                    </span>
                  );
                },
              },
              {
                key: 'contact',
                header: 'Contact',
                render: (project) => {
                  const customer = getCustomerById(project.customerId);
                  return (
                    <div onClick={(e) => e.stopPropagation()}>
                      <ContactActions
                        phone={customer?.phone || ''}
                        email={customer?.email || ''}
                        customerName={customer?.name}
                      />
                    </div>
                  );
                },
              },
            ]}
            data={expiredQuotes}
            onRowClick={(project) => setSelectedCustomerId(project.customerId)}
            emptyMessage="No expired quotes"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Leads to Schedule"
          value={preSaleProjects.length}
          iconBgColor="bg-purple-100"
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          title="Quote Appointments"
          value={quoteScheduledCount}
          iconBgColor="bg-blue-100"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Proposals Outstanding"
          value={pendingProposals.length}
          iconBgColor="bg-yellow-100"
          icon={
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          title="Pipeline Value"
          value={`$${pipelineValue.toLocaleString()}`}
          iconBgColor="bg-green-100"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Tab Bar */}
      <div className="flex items-center justify-between mb-6">
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <Button onClick={() => setShowNewCustomerModal(true)}>
          + New Customer
        </Button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        {renderTabContent()}
      </div>

      {/* Customer/Project Modal */}
      <CustomerProjectModal
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />

      {/* Notes Modal */}
      {notesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Notes for {notesModal.customerName}</h3>
              <button
                onClick={() => setNotesModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{notesModal.notes}</p>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200">
              <button
                onClick={() => setNotesModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
