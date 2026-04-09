import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, Button, Toggle, Dropdown, Modal } from '../ui';
import { PageLayout } from '../layout';
import { ToolCards } from './ToolCards';
import { useData } from '../../context/DataContext';
import { ProjectStatus, Activity } from '../../types';

// Status Pill Dropdown Component
const StatusPillDropdown: React.FC<{
  status: ProjectStatus;
  options: { value: string; label: string; bgColor?: string; textColor?: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  disabledReason?: string;
}> = ({ status, options, onChange, disabled = false, disabledReason }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === status);
  const bgColor = selectedOption?.bgColor || '#f3f4f6';
  const textColor = selectedOption?.textColor || '#374151';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        title={disabled ? disabledReason : undefined}
        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
          disabled ? 'cursor-not-allowed opacity-60' : 'hover:opacity-80'
        }`}
        style={{ backgroundColor: bgColor, color: textColor, borderColor: bgColor }}
      >
        {selectedOption?.label || status}
        {!disabled && (
          <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-20 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                option.value === status ? 'bg-gray-50' : ''
              }`}
            >
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: option.bgColor || '#f3f4f6' }}
              />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Company main line
const MAIN_LINE = '(555) 123-4567';

export const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [mapsModalOpen, setMapsModalOpen] = useState(false);
  const [activityTab, setActivityTab] = useState<'status_changes' | 'calls' | 'voicemails' | 'texts' | 'emails'>('status_changes');
  const {
    getProjectById,
    getCustomerById,
    updateProject,
    salespeople,
    getSalespersonById,
    projectStatusConfigs,
    getActivitiesByProjectId,
  } = useData();

  const project = getProjectById(id || '');
  const customer = project ? getCustomerById(project.customerId) : null;
  const salesperson = project ? getSalespersonById(project.salespersonId) : null;
  const activities = project ? getActivitiesByProjectId(project.id) : [];

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

  if (!project || !customer) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Project not found</p>
          <Button className="mt-4" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Convert name to snake_case to match project status values
  const toSnakeCase = (str: string) => str.toLowerCase().replace(/\s+/g, '_');

  const statusOptions = projectStatusConfigs
    .filter(s => s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(s => ({
      value: toSnakeCase(s.name),
      label: s.name,
      bgColor: s.bgColor,
      textColor: s.textColor,
    }));

  const salespersonOptions = salespeople.map(sp => ({
    value: sp.id,
    label: sp.name,
  }));

  const handleStatusChange = (newStatus: string) => {
    updateProject(project.id, { status: newStatus as ProjectStatus, statusChangedAt: new Date().toISOString() });
  };

  const handleSalespersonChange = (newSalespersonId: string) => {
    updateProject(project.id, { salespersonId: newSalespersonId });
  };

  const handlePortalToggle = (enabled: boolean) => {
    updateProject(project.id, { portalLive: enabled });
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    updateProject(project.id, { autoNotifications: enabled });
  };

  const copyPortalLink = () => {
    const link = `${window.location.origin}/portal/${project.id}`;
    navigator.clipboard.writeText(link);
    alert('Portal link copied to clipboard!');
  };

  const openPortal = () => {
    window.open(`/portal/${project.id}`, '_blank');
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent(`Re: ${project.name} - Fence Boys`);
    const body = encodeURIComponent(`Hi ${customer.name.split(' ')[0]},\n\n`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${customer.email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  const handleCall = (fromLine: 'main' | 'salesperson') => {
    const phoneNumber = customer.phone.replace(/\D/g, '');
    window.location.href = `tel:${phoneNumber}`;
    setPhoneModalOpen(false);
  };

  const handleText = (fromLine: 'main' | 'salesperson') => {
    const phoneNumber = customer.phone.replace(/\D/g, '');
    window.location.href = `sms:${phoneNumber}`;
    setPhoneModalOpen(false);
  };

  const openGoogleMaps = () => {
    const address = encodeURIComponent(project.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
    setMapsModalOpen(false);
  };

  const openAppleMaps = () => {
    const address = encodeURIComponent(project.address);
    window.open(`https://maps.apple.com/?q=${address}`, '_blank');
    setMapsModalOpen(false);
  };

  return (
    <PageLayout>
      {/* Back Link */}
      <Link
        to={`/customers/${customer.id}`}
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to {customer.name}
      </Link>

      {/* Project Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
          <div className="flex items-center space-x-2">
            <StatusPillDropdown
              status={project.status}
              options={statusOptions}
              onChange={handleStatusChange}
              disabled={customer?.status !== 'active_project'}
              disabledReason="Customer status must be 'Active Project' to change project status"
            />
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {(() => {
                  const statusDate = project.statusChangedAt
                    ? new Date(project.statusChangedAt)
                    : new Date(project.createdAt);
                  const days = Math.floor((Date.now() - statusDate.getTime()) / (1000 * 60 * 60 * 24));
                  return `${days}d in status`;
                })()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPhoneModalOpen(true)}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPhoneModalOpen(true)}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            SMS
          </Button>
          <Button variant="outline" size="sm" onClick={handleEmailClick}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </Button>
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Customer Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Info</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="text-gray-900 font-medium">{customer.name}</p>
            </div>
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
              <p className="text-gray-900">{project.address}</p>
            </div>
          </div>
        </Card>

        {/* Project Controls - Compact */}
        <Card>
          <CardHeader>
            <CardTitle>Project Settings</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <label className="text-sm font-medium text-gray-700">Salesperson</label>
              <Dropdown
                options={salespersonOptions}
                value={project.salespersonId}
                onChange={handleSalespersonChange}
                buttonClassName="min-w-[160px]"
              />
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <label className="text-sm font-medium text-gray-700">Auto-notifications</label>
              <Toggle
                enabled={project.autoNotifications}
                onChange={handleNotificationsToggle}
              />
            </div>
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <label className="text-sm font-medium text-gray-700">Customer Portal</label>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${project.portalLive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {project.portalLive ? 'Live' : 'Hidden'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={project.portalLive ? 'outline' : 'primary'}
                  size="sm"
                  className="flex-1"
                  onClick={() => handlePortalToggle(!project.portalLive)}
                >
                  {project.portalLive ? 'Hide Portal' : 'Go Live'}
                </Button>
                {project.portalLive && (
                  <>
                    <Button variant="outline" size="sm" onClick={copyPortalLink}>
                      Copy Link
                    </Button>
                    <Button variant="outline" size="sm" onClick={openPortal}>
                      View
                    </Button>
                  </>
                )}
              </div>
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
      </div>

      {/* Tool Cards */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Tools</CardTitle>
        </CardHeader>
        <ToolCards projectId={project.id} />
      </Card>

      {/* Phone Contact Modal */}
      <Modal
        isOpen={phoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        title="Contact Customer"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center pb-2">
            <p className="text-lg font-medium text-gray-900">{customer.name}</p>
            <p className="text-gray-600">{customer.phone}</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Select outgoing line:</p>

            {/* Main Line Option */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">Main Line</p>
                  <p className="text-sm text-gray-500">{MAIN_LINE}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleCall('main')}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleText('main')}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Text
                </Button>
              </div>
            </div>

            {/* Salesperson Line Option */}
            {salesperson && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{salesperson.name}'s Line</p>
                    <p className="text-sm text-gray-500">Salesperson direct</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCall('salesperson')}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleText('salesperson')}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Text
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Maps Modal */}
      <Modal
        isOpen={mapsModalOpen}
        onClose={() => setMapsModalOpen(false)}
        title="Open in Maps"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center pb-2">
            <p className="text-gray-600">{project.address}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={openGoogleMaps}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle fill="#fff" cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Google Maps</p>
                <p className="text-sm text-gray-500">Open in browser</p>
              </div>
            </button>

            <button
              onClick={openAppleMaps}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#000" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Apple Maps</p>
                <p className="text-sm text-gray-500">Open in browser or app</p>
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};
