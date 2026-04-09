import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ProposalModal } from './ProposalModal';

interface ToolCardsProps {
  projectId: string;
}

// Row 1: Creation tools
// Row 2: Project assets
// Row 3: Actions/Admin
const tools = [
  // Top Row: Drawings, Proposals, Pricing
  {
    id: 'drawing',
    name: 'Drawings',
    description: 'Create fence layouts',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    color: 'bg-blue-100 text-blue-600',
    path: '/tools/drawings',
  },
  {
    id: 'proposal',
    name: 'Proposals',
    description: 'Create customer proposals',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'bg-purple-100 text-purple-600',
    path: null,
  },
  {
    id: 'pricing',
    name: 'Pricing',
    description: 'Calculate project costs',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-green-100 text-green-600',
    path: '/tools/pricing',
    comingSoon: true,
  },
  // Middle Row: Notes, Documents, Photos
  {
    id: 'notes',
    name: 'Notes',
    description: 'Project notes & memos',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    color: 'bg-gray-100 text-gray-600',
    path: null,
  },
  {
    id: 'documents',
    name: 'Documents',
    description: 'Contracts & permits',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-indigo-100 text-indigo-600',
    path: null,
  },
  {
    id: 'photos',
    name: 'Photos',
    description: 'Project photos',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-pink-100 text-pink-600',
    path: null,
  },
  // Bottom Row: Schedule, Communications, Payments
  {
    id: 'schedule',
    name: 'Schedule',
    description: 'Book appointments',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-blue-100 text-blue-600',
    path: null,
    isSchedule: true,
  },
  {
    id: 'communications',
    name: 'Communications',
    description: 'Messages & emails',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    color: 'bg-orange-100 text-orange-600',
    path: null,
  },
  {
    id: 'payments',
    name: 'Payments',
    description: 'Invoices & payments',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    color: 'bg-yellow-100 text-yellow-600',
    path: null,
  },
];

export const ToolCards: React.FC<ToolCardsProps> = ({ projectId }) => {
  const navigate = useNavigate();
  const { getProjectById, getCustomerById, getDrawingsByProjectId, getPricingsByProjectId, getProposalsByProjectId, getPhotosByProjectId, getDocumentsByProjectId, getCommunicationsByProjectId, getPaymentsByProjectId, updateProject, documentCategories, photoCategories, getNotesByProjectId, addNote } = useData();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [drawingsModalOpen, setDrawingsModalOpen] = useState(false);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [photosModalOpen, setPhotosModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [communicationsModalOpen, setCommunicationsModalOpen] = useState(false);
  const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [documentCategoryFilter, setDocumentCategoryFilter] = useState('all');
  const [photoCategoryFilter, setPhotoCategoryFilter] = useState('all');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [installationDate, setInstallationDate] = useState('');
  const [walkthroughDate, setWalkthroughDate] = useState('');
  const [quoteAppointmentDate, setQuoteAppointmentDate] = useState('');

  const project = getProjectById(projectId);
  const drawings = getDrawingsByProjectId(projectId);
  const pricings = getPricingsByProjectId(projectId);
  const proposals = getProposalsByProjectId(projectId);
  const photos = getPhotosByProjectId(projectId);
  const documents = getDocumentsByProjectId(projectId);
  const communications = getCommunicationsByProjectId(projectId);
  const payments = getPaymentsByProjectId(projectId);

  const customer = project ? getCustomerById(project.customerId) : null;
  const notes = getNotesByProjectId ? getNotesByProjectId(projectId) : [];

  const activeDocumentCategories = documentCategories?.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder) || [];
  const activePhotoCategories = photoCategories?.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder) || [];

  const filteredDocuments = documentCategoryFilter === 'all'
    ? documents
    : documents.filter(d => d.category === documentCategoryFilter);

  const filteredPhotos = photoCategoryFilter === 'all'
    ? photos
    : photos.filter(p => p.tags?.includes(photoCategoryFilter));

  const getCount = (toolId: string): number => {
    switch (toolId) {
      case 'drawing':
        return drawings.length;
      case 'pricing':
        return pricings.length;
      case 'proposal':
        return proposals.length;
      case 'photos':
        return photos.length;
      case 'documents':
        return documents.length;
      case 'communications':
        return communications.length;
      case 'payments':
        return payments.length;
      default:
        return 0;
    }
  };

  // Convert ISO date string to datetime-local format in EST
  const isoToDatetimeLocal = (isoString: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Format for datetime-local input (YYYY-MM-DDTHH:mm)
    const estDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const year = estDate.getFullYear();
    const month = String(estDate.getMonth() + 1).padStart(2, '0');
    const day = String(estDate.getDate()).padStart(2, '0');
    const hours = String(estDate.getHours()).padStart(2, '0');
    const minutes = String(estDate.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Convert datetime-local value to ISO string (treating input as EST)
  const datetimeLocalToISO = (datetimeLocal: string): string => {
    if (!datetimeLocal) return '';
    // Parse the datetime-local value and treat it as EST
    const [datePart, timePart] = datetimeLocal.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    // Create date in EST timezone
    const estDateStr = `${month}/${day}/${year} ${hours}:${minutes}:00`;
    const date = new Date(new Date(estDateStr).toLocaleString('en-US', { timeZone: 'America/New_York' }));
    // Adjust for EST offset
    const utcDate = new Date(Date.UTC(year, month - 1, day, hours + 5, minutes)); // EST is UTC-5 (or UTC-4 for EDT)
    return utcDate.toISOString();
  };

  // Format date for display in EST
  const formatDateTimeEST = (isoString: string): string => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString('en-US', {
      timeZone: 'America/New_York',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) + ' EST';
  };

  const handleScheduleClick = () => {
    // Initialize with existing dates if available (convert to datetime-local format)
    setInstallationDate(project?.installationDate ? isoToDatetimeLocal(project.installationDate) : '');
    setWalkthroughDate(project?.walkthroughDate ? isoToDatetimeLocal(project.walkthroughDate) : '');
    setQuoteAppointmentDate(project?.salesAppointment ? isoToDatetimeLocal(project.salesAppointment) : '');
    setScheduleModalOpen(true);
  };

  const handleSaveInstallationDate = () => {
    if (installationDate) {
      updateProject(projectId, { installationDate: datetimeLocalToISO(installationDate) });
    }
  };

  const handleSaveWalkthroughDate = () => {
    if (walkthroughDate) {
      updateProject(projectId, { walkthroughDate: datetimeLocalToISO(walkthroughDate) });
    }
  };

  const handleSaveQuoteAppointmentDate = () => {
    if (quoteAppointmentDate) {
      updateProject(projectId, { salesAppointment: datetimeLocalToISO(quoteAppointmentDate) });
    }
  };

  const handleOpenPortalForScheduling = () => {
    // Open SMS with portal link and scheduling instructions
    const portalLink = `https://portal.fenceboys.com/schedule`;
    const message = encodeURIComponent(`Hi ${customer?.name}! Use this link to schedule your free on-site quote appointment: ${portalLink}\n\nJust pick a date and time that works for you!`);
    window.open(`sms:${customer?.phone}?body=${message}`, '_self');
    setScheduleModalOpen(false);
  };

  const handleGoogleCalendarClick = () => {
    // Create Google Calendar event URL with pre-filled details
    const eventTitle = encodeURIComponent(`Quote Appointment - ${customer?.name || 'Customer'}`);
    const eventDetails = encodeURIComponent(`Quote appointment for ${project?.address || 'Address TBD'}\n\nCustomer: ${customer?.name}\nPhone: ${customer?.phone}\nEmail: ${customer?.email}`);
    const eventLocation = encodeURIComponent(project?.address || '');

    // Default to tomorrow at 9am, 1 hour duration
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const startTime = tomorrow.toISOString().replace(/-|:|\.\d{3}/g, '');
    tomorrow.setHours(10, 0, 0, 0);
    const endTime = tomorrow.toISOString().replace(/-|:|\.\d{3}/g, '');

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}&location=${eventLocation}&dates=${startTime}/${endTime}`;

    window.open(googleCalendarUrl, '_blank');
    setScheduleModalOpen(false);
  };

  const formatAppointment = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleToolClick = (tool: typeof tools[0]) => {
    if (tool.isSchedule) {
      handleScheduleClick();
    } else if (tool.id === 'drawing') {
      navigate(`/projects/${projectId}/drawings`);
    } else if (tool.id === 'proposal') {
      navigate(`/projects/${projectId}/proposals`);
    } else if (tool.id === 'notes') {
      navigate(`/projects/${projectId}/notes`);
    } else if (tool.id === 'photos') {
      navigate(`/projects/${projectId}/photos`);
    } else if (tool.id === 'documents') {
      navigate(`/projects/${projectId}/documents`);
    } else if (tool.id === 'communications') {
      navigate(`/projects/${projectId}/communications`);
    } else if (tool.id === 'payments') {
      navigate(`/projects/${projectId}/payments`);
    } else if (tool.path) {
      navigate(tool.path);
    }
  };

  const handleAddNote = () => {
    if (newNoteContent.trim() && addNote) {
      addNote({
        projectId,
        content: newNoteContent.trim(),
        authorId: 'current-user',
      });
      setNewNoteContent('');
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {tools.map((tool) => {
          const count = getCount(tool.id);
          const isScheduleTool = tool.isSchedule;
          const hasAppointment = isScheduleTool && project?.salesAppointment;
          const isComingSoon = (tool as any).comingSoon;

          return (
            <button
              key={tool.id}
              onClick={() => !isComingSoon && handleToolClick(tool)}
              className={`
                relative flex flex-col items-center p-4 rounded-lg border border-gray-200
                ${isComingSoon ? 'cursor-not-allowed' : 'hover:shadow-md hover:border-gray-300 cursor-pointer'}
                transition-all text-center
              `}
            >
              {isComingSoon && (
                <div className="absolute inset-0 bg-white/60 rounded-lg z-10 flex items-center justify-center">
                  <span className="bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                    Coming Soon
                  </span>
                </div>
              )}
              <div className={`p-3 rounded-lg ${tool.color} mb-3`}>
                {tool.icon}
              </div>
              <span className="font-medium text-gray-900 text-sm">{tool.name}</span>
              <span className="text-xs text-gray-500 mt-1">{tool.description}</span>
              {count > 0 && (
                <span className="mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              )}
              {hasAppointment && (
                <span className="mt-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {formatAppointment(project.salesAppointment!)}
                </span>
              )}
              {isScheduleTool && !hasAppointment && (
                <span className="mt-2 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                  Not scheduled
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Proposal Modal */}
      <ProposalModal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        projectId={projectId}
      />

      {/* Drawings Modal */}
      {drawingsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">Drawings</h3>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {customer?.name}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Fence layouts for {project?.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.open('/drawing-tool/index.html', '_blank')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Drawing
                </button>
                <button
                  onClick={() => setDrawingsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {drawings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No drawings yet</h4>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Create your first fence layout drawing to help visualize the project for your customer.
                  </p>
                  <button
                    onClick={() => window.open('/drawing-tool/index.html', '_blank')}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Create First Drawing
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {drawings.map((drawing) => (
                    <div
                      key={drawing.id}
                      className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                      onClick={() => setSelectedDrawing(drawing)}
                    >
                      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{drawing.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {new Date(drawing.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-blue-600 font-medium truncate">{customer?.name}</span>
                        </div>
                      </div>
                      <div className="px-3 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open('/drawing-tool/index.html', '_blank');
                            }}
                            className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDrawing(drawing);
                            }}
                            className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Drawing Detail Modal */}
      {selectedDrawing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedDrawing.name}</h3>
                <p className="text-sm text-gray-500">Drawing for {customer?.name}</p>
              </div>
              <button
                onClick={() => setSelectedDrawing(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <span>Created: {new Date(selectedDrawing.createdAt).toLocaleDateString()}</span>
                <span>Last modified: {new Date(selectedDrawing.updatedAt || selectedDrawing.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('/drawing-tool/index.html', '_blank')}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Drawing
                </button>
                <button
                  onClick={() => setSelectedDrawing(null)}
                  className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleOpenPortalForScheduling}
                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">Open Portal for Scheduling</div>
                  <div className="text-sm text-gray-500">Text & email portal link</div>
                </div>
                <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>

              <button
                onClick={handleGoogleCalendarClick}
                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
              >
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 group-hover:text-green-600">Schedule Manually</div>
                  <div className="text-sm text-gray-500">Add directly to Google Calendar</div>
                </div>
                <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-gray-500 uppercase tracking-wide">Project Dates</span>
                </div>
              </div>

              {/* Quote Appointment Date */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Quote Appointment</div>
                      <div className="text-xs text-gray-500">On-site quote visit (EST)</div>
                    </div>
                  </div>
                  {project?.salesAppointment && (
                    <button
                      onClick={() => updateProject(projectId, { salesAppointment: undefined })}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove date"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    value={quoteAppointmentDate}
                    onChange={(e) => setQuoteAppointmentDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleSaveQuoteAppointmentDate}
                    disabled={!quoteAppointmentDate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Save
                  </button>
                </div>
                {project?.salesAppointment && (
                  <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Currently set: {formatDateTimeEST(project.salesAppointment)}
                  </div>
                )}
              </div>

              {/* Installation Date */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Installation Date</div>
                      <div className="text-xs text-gray-500">Shows in customer portal (EST)</div>
                    </div>
                  </div>
                  {project?.installationDate && (
                    <button
                      onClick={() => updateProject(projectId, { installationDate: undefined })}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove date"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    value={installationDate}
                    onChange={(e) => setInstallationDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    onClick={handleSaveInstallationDate}
                    disabled={!installationDate}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Save
                  </button>
                </div>
                {project?.installationDate && (
                  <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Currently set: {formatDateTimeEST(project.installationDate)}
                  </div>
                )}
              </div>

              {/* Walkthrough Date */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Walkthrough Date</div>
                      <div className="text-xs text-gray-500">Shows in customer portal (EST)</div>
                    </div>
                  </div>
                  {project?.walkthroughDate && (
                    <button
                      onClick={() => updateProject(projectId, { walkthroughDate: undefined })}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove date"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    value={walkthroughDate}
                    onChange={(e) => setWalkthroughDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    onClick={handleSaveWalkthroughDate}
                    disabled={!walkthroughDate}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Save
                  </button>
                </div>
                {project?.walkthroughDate && (
                  <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Currently set: {formatDateTimeEST(project.walkthroughDate)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {documentsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                    {customer?.name}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Contracts, permits, and files for {project?.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={documentCategoryFilter}
                  onChange={(e) => setDocumentCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {activeDocumentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload
                </button>
                <button
                  onClick={() => setDocumentsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h4>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Upload contracts, permits, and other project documents to keep everything organized.
                  </p>
                  <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Upload First Document
                  </button>
                </div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="font-medium text-gray-900">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-indigo-600 font-medium">{customer?.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
                            {doc.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                              View
                            </button>
                            <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photos Modal */}
      {photosModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
                  <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                    {customer?.name}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Before, during, and after photos for {project?.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={photoCategoryFilter}
                  onChange={(e) => setPhotoCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {activePhotoCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload
                </button>
                <button
                  onClick={() => setPhotosModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filteredPhotos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h4>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Capture before, during, and after photos to document the project progress.
                  </p>
                  <button className="px-6 py-2.5 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors">
                    Upload First Photo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white text-sm font-medium truncate">{photo.name}</p>
                          <p className="text-white/70 text-xs">
                            {customer?.name} • {photo.tags?.length > 0 ? photo.tags[0] : 'Uncategorized'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedPhoto.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="text-pink-600 font-medium">{customer?.name}</span>
                      {' • '}
                      {new Date(selectedPhoto.createdAt).toLocaleDateString()}
                      {selectedPhoto.tags?.length > 0 && ` • ${selectedPhoto.tags[0]}`}
                    </p>
                  </div>
                  <button className="px-4 py-2 text-red-600 bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {notesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                    {customer?.name}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Internal notes for {project?.address}</p>
              </div>
              <button
                onClick={() => setNotesModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Add Note Input */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Write a note..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  rows={2}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNoteContent.trim()}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors self-end"
                >
                  Add Note
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {notes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h4>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Add notes to track important information about this project.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note: any) => (
                    <div key={note.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 text-sm whitespace-pre-wrap">{note.content}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-500">
                          {new Date(note.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                        <button className="text-xs text-red-600 hover:text-red-800 font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Communications Modal */}
      {communicationsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">Communications</h3>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                    {customer?.name}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Messages and emails for {project?.address}</p>
              </div>
              <button
                onClick={() => setCommunicationsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {communications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No communications yet</h4>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Messages and emails with the customer will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {communications.map((comm: any) => (
                    <div key={comm.id} className={`flex ${comm.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-4 ${
                        comm.direction === 'outbound'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {comm.type === 'email' ? (
                            <svg className={`w-4 h-4 ${comm.direction === 'outbound' ? 'text-blue-200' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className={`w-4 h-4 ${comm.direction === 'outbound' ? 'text-blue-200' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          )}
                          <span className={`text-xs font-medium ${comm.direction === 'outbound' ? 'text-blue-200' : 'text-gray-500'}`}>
                            {comm.type === 'email' ? 'Email' : 'Text'}
                          </span>
                        </div>
                        <p className="text-sm">{comm.content || comm.message}</p>
                        <p className={`text-xs mt-2 ${comm.direction === 'outbound' ? 'text-blue-200' : 'text-gray-500'}`}>
                          {new Date(comm.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Send Text
                </button>
                <button className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payments Modal */}
      {paymentsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    {customer?.name}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Payment history for {project?.address}</p>
              </div>
              <button
                onClick={() => setPaymentsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Payment Summary */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Total Due</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ${payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Received</p>
                  <p className="text-xl font-semibold text-green-600">
                    ${payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Outstanding</p>
                  <p className="text-xl font-semibold text-orange-600">
                    ${payments.filter(p => p.status === 'awaiting').reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {payments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h4>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Payment records from Stripe will appear here once invoices are created.
                  </p>
                </div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-yellow-600 font-medium">{customer?.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {payment.type ? `${payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} Payment` : 'Payment'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                          ${(payment.amount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                            payment.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : payment.status === 'awaiting'
                              ? 'bg-orange-100 text-orange-700'
                              : payment.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {payment.status === 'paid' ? 'Paid' : payment.status === 'awaiting' ? 'Awaiting' : payment.status === 'failed' ? 'Failed' : 'Refunded'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button className="w-full px-4 py-2.5 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
