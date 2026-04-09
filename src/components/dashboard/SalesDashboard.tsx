import React, { useState } from 'react';
import { StatCard, Button, Modal, ContactActions } from '../ui';
import { PillDropdown, buildTypeOptions, customerStatusOptions, portalStatusOptions } from '../ui/PillDropdown';
import { Table } from '../ui/Table';
import { CustomerProjectModal } from './CustomerProjectModal';
import { CustomerForm } from '../customers/CustomerForm';
import { useData } from '../../context/DataContext';
import { Project, BuildType, CustomerStatus } from '../../types';

type StatFilter = 'my_leads' | 'quote_appointments' | 'lead_verification' | 'building_proposal' | 'pending_proposals' | 'expired_quotes' | null;
type CalendarView = 'table' | 'week' | 'month';

export const SalesDashboard: React.FC = () => {
  const [selectedStat, setSelectedStat] = useState<StatFilter>('my_leads');
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

  // Pre-sale customer statuses (everything before won/lost)
  const preSaleStatuses = [
    'new_lead',
    'contact_attempted',
    'contacted',
    'needs_qualifying',
    'quote_scheduled',
    'building_proposal',
    'proposal_sent',
    'awaiting_deposit',
    'quote_expired',
  ];

  // Filter functions for each stat - ALL based on Customer Status
  const getMyLeads = () => projects.filter(p => {
    const customer = getCustomerById(p.customerId);
    return customer && preSaleStatuses.includes(customer.status);
  });

  const getQuoteAppointments = () => {
    return projects.filter(p => {
      const customer = getCustomerById(p.customerId);
      return customer?.status === 'quote_scheduled' && p.salesAppointment;
    }).sort((a, b) => new Date(a.salesAppointment!).getTime() - new Date(b.salesAppointment!).getTime());
  };

  const getLeadVerification = () => projects.filter(p => {
    const customer = getCustomerById(p.customerId);
    return customer?.status === 'needs_qualifying';
  });

  const getBuildingProposal = () => projects.filter(p => {
    const customer = getCustomerById(p.customerId);
    return customer?.status === 'building_proposal';
  });

  const getPendingProposals = () => projects.filter(p => {
    const customer = getCustomerById(p.customerId);
    return customer?.status === 'proposal_sent' || customer?.status === 'awaiting_deposit';
  });

  const getExpiredQuotes = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return projects.filter(p => {
      const customer = getCustomerById(p.customerId);
      if (customer?.status !== 'quote_expired') return false;
      const statusDate = p.statusChangedAt ? new Date(p.statusChangedAt) : new Date(p.createdAt);
      return statusDate >= thirtyDaysAgo;
    });
  };

  // Calculate counts
  const myLeadsCount = getMyLeads().length;
  const quoteAppointmentsCount = getQuoteAppointments().length;
  const leadVerificationCount = getLeadVerification().length;
  const buildingProposalCount = getBuildingProposal().length;
  const pendingProposalsCount = getPendingProposals().length;
  const expiredQuotesCount = getExpiredQuotes().length;

  const handleStatClick = (stat: StatFilter) => {
    setSelectedStat(selectedStat === stat ? null : stat);
  };

  const getSectionTitle = (): string => {
    switch (selectedStat) {
      case 'my_leads': return 'My Leads';
      case 'quote_appointments': return 'Quote Appointments';
      case 'lead_verification': return 'Lead Verification';
      case 'building_proposal': return 'Building Proposal';
      case 'pending_proposals': return 'Pending Proposals';
      case 'expired_quotes': return 'Expired Quotes';
      default: return '';
    }
  };

  const getStatFilteredProjects = (): Project[] => {
    switch (selectedStat) {
      case 'my_leads': return getMyLeads();
      case 'quote_appointments': return getQuoteAppointments();
      case 'lead_verification': return getLeadVerification();
      case 'building_proposal': return getBuildingProposal();
      case 'pending_proposals': return getPendingProposals();
      case 'expired_quotes': return getExpiredQuotes();
      default: return [];
    }
  };

  const renderStatContent = () => {
    const statFilteredProjects = getStatFilteredProjects();

    switch (selectedStat) {
      case 'my_leads':
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
                key: 'portal',
                header: 'Portal',
                render: (project) => (
                  <div onClick={(e) => e.stopPropagation()}>
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
            data={statFilteredProjects}
            onRowClick={(project) => setSelectedCustomerId(project.customerId)}
            emptyMessage="No leads found"
          />
        );

      case 'quote_appointments':
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
                    key: 'portal',
                    header: 'Portal',
                    render: (project) => (
                      <div onClick={(e) => e.stopPropagation()}>
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
                data={statFilteredProjects}
                onRowClick={(project) => setSelectedCustomerId(project.customerId)}
                emptyMessage="No quote appointments scheduled"
              />
            );
          }

          if (calendarView === 'week') {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());

            const weekDays = Array.from({ length: 7 }, (_, i) => {
              const date = new Date(startOfWeek);
              date.setDate(startOfWeek.getDate() + i);
              return date;
            });

            return (
              <div className="p-4">
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => {
                    const dayAppointments = statFilteredProjects.filter(p => {
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
          for (let i = 0; i < startDay; i++) {
            calendarDays.push(null);
          }
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

                  const dayAppointments = statFilteredProjects.filter(p => {
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
            <div className="flex items-center justify-start px-4 py-3 border-b border-gray-200">
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

      case 'lead_verification':
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
                key: 'portal',
                header: 'Portal',
                render: (project) => (
                  <div onClick={(e) => e.stopPropagation()}>
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
            data={statFilteredProjects}
            onRowClick={(project) => setSelectedCustomerId(project.customerId)}
            emptyMessage="No leads to verify"
          />
        );

      case 'building_proposal':
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
                key: 'portal',
                header: 'Portal',
                render: (project) => (
                  <div onClick={(e) => e.stopPropagation()}>
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
            data={statFilteredProjects}
            onRowClick={(project) => setSelectedCustomerId(project.customerId)}
            emptyMessage="No proposals currently being built"
          />
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
                key: 'portal',
                header: 'Portal',
                render: (project) => (
                  <div onClick={(e) => e.stopPropagation()}>
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
            data={statFilteredProjects}
            onRowClick={(project) => setSelectedCustomerId(project.customerId)}
            emptyMessage="No pending proposals"
          />
        );

      case 'expired_quotes':
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
                key: 'portal',
                header: 'Portal',
                render: (project) => (
                  <div onClick={(e) => e.stopPropagation()}>
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
            data={statFilteredProjects}
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
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Sales Dashboard</h2>
        <Button onClick={() => setShowNewCustomerModal(true)}>
          + New Customer
        </Button>
      </div>

      {/* Stats Cards - 3x2 Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="My Leads"
          value={myLeadsCount}
          iconBgColor="bg-purple-100"
          icon={
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          onClick={() => handleStatClick('my_leads')}
          isActive={selectedStat === 'my_leads'}
        />
        <StatCard
          title="Quote Appointments"
          value={quoteAppointmentsCount}
          iconBgColor="bg-blue-100"
          icon={
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          onClick={() => handleStatClick('quote_appointments')}
          isActive={selectedStat === 'quote_appointments'}
        />
        <StatCard
          title="Lead Verification"
          value={leadVerificationCount}
          iconBgColor="bg-orange-100"
          icon={
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          onClick={() => handleStatClick('lead_verification')}
          isActive={selectedStat === 'lead_verification'}
        />
        <StatCard
          title="Building Proposal"
          value={buildingProposalCount}
          iconBgColor="bg-indigo-100"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          onClick={() => handleStatClick('building_proposal')}
          isActive={selectedStat === 'building_proposal'}
        />
        <StatCard
          title="Pending Proposals"
          value={pendingProposalsCount}
          iconBgColor="bg-yellow-100"
          icon={
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          onClick={() => handleStatClick('pending_proposals')}
          isActive={selectedStat === 'pending_proposals'}
        />
        <StatCard
          title="Expired Quotes"
          value={expiredQuotesCount}
          iconBgColor="bg-red-100"
          icon={
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          onClick={() => handleStatClick('expired_quotes')}
          isActive={selectedStat === 'expired_quotes'}
        />
      </div>

      {/* Stat-Filtered Section */}
      {selectedStat && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {getSectionTitle()} ({getStatFilteredProjects().length})
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
