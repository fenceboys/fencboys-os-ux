import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, Button, Toggle, Dropdown, Modal } from '../ui';
import { PageLayout } from '../layout';
import { ToolCards } from './ToolCards';
import { ActivityFeed } from './ActivityFeed';
import { useData } from '../../context/DataContext';
import { statuses, getStatusInfo } from '../../constants/statuses';
import { ProjectStatus } from '../../types';

const statusColorClasses: Record<string, string> = {
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-200',
};

// Status Pill Dropdown Component
const StatusPillDropdown: React.FC<{
  status: ProjectStatus;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}> = ({ status, options, onChange }) => {
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

  const statusInfo = getStatusInfo(status);
  const colorClass = statusInfo ? statusColorClasses[statusInfo.color] : statusColorClasses.gray;
  const selectedOption = options.find(o => o.value === status);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${colorClass} hover:opacity-80`}
      >
        {selectedOption?.label || status}
        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
          {options.map((option) => {
            const optionStatusInfo = getStatusInfo(option.value as ProjectStatus);
            const optionColorClass = optionStatusInfo ? statusColorClasses[optionStatusInfo.color] : statusColorClasses.gray;
            return (
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
                <span className={`inline-block w-3 h-3 rounded-full ${optionColorClass.split(' ')[0]}`} />
                {option.label}
              </button>
            );
          })}
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
  const [phoneModalOpen, setPhoneModalOpen] = React.useState(false);
  const [mapsModalOpen, setMapsModalOpen] = React.useState(false);
  const {
    getProjectById,
    getCustomerById,
    updateProject,
    salespeople,
    getSalespersonById,
  } = useData();

  const project = getProjectById(id || '');
  const customer = project ? getCustomerById(project.customerId) : null;
  const salesperson = project ? getSalespersonById(project.salespersonId) : null;

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

  const statusOptions = statuses.map(s => ({
    value: s.id,
    label: s.label,
  }));

  const salespersonOptions = salespeople.map(sp => ({
    value: sp.id,
    label: sp.name,
  }));

  const handleStatusChange = (newStatus: string) => {
    updateProject(project.id, { status: newStatus as ProjectStatus });
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
          <StatusPillDropdown
            status={project.status}
            options={statusOptions}
            onChange={handleStatusChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
            Delete
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
              <button
                onClick={() => setPhoneModalOpen(true)}
                className="block text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                {customer.phone}
              </button>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <button
                onClick={handleEmailClick}
                className="block text-blue-600 hover:text-blue-800 hover:underline"
              >
                {customer.email}
              </button>
            </div>
            <div>
              <label className="text-sm text-gray-500">Address</label>
              <button
                onClick={() => setMapsModalOpen(true)}
                className="block text-blue-600 hover:text-blue-800 hover:underline text-left"
              >
                {project.address}
              </button>
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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <ActivityFeed projectId={project.id} />
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
