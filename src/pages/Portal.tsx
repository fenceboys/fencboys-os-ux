import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { CompactProgressTracker } from '../components/portal/CompactProgressTracker';
import { PortalTabs, PortalTabType } from '../components/portal/PortalTabs';
import { StatusContent } from '../components/portal/StatusContent';
import { ProposalReview } from '../components/portal/ProposalReview';
import { DepositPayment } from '../components/portal/DepositPayment';
import { FinalPayment } from '../components/portal/FinalPayment';
import { DocumentUpload } from '../components/portal/DocumentUpload';
import { DocumentsList } from '../components/portal/DocumentsList';
import { CommunicationLog } from '../components/portal/CommunicationLog';
import { Card } from '../components/ui/Card';
import { ProjectStatus, CustomerStatus } from '../types';
import { projectStatuses, customerStatuses, isPreSale } from '../constants/statuses';

export const Portal: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    getProjectById,
    getCustomerById,
    getSalespersonById,
    getProposalsByProjectId,
    getDrawingsByProjectId,
    getPricingsByProjectId,
    getPhotosByProjectId,
    getActivitiesByProjectId,
    updateProject,
    updateCustomer,
    updateProposal,
    addActivity,
    customerStatusConfigs,
  } = useData();
  const [activeTab, setActiveTab] = useState<PortalTabType>('status');

  // Modal states for interactive components
  const [showProposalReview, setShowProposalReview] = useState(false);
  const [showDepositPayment, setShowDepositPayment] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showFinalPayment, setShowFinalPayment] = useState(false);
  const [showTestingPanel, setShowTestingPanel] = useState(false);

  const project = projectId ? getProjectById(projectId) : undefined;
  const customer = project ? getCustomerById(project.customerId) : undefined;
  const salesperson = project ? getSalespersonById(project.salespersonId) : undefined;
  const proposals = projectId ? getProposalsByProjectId(projectId) : [];
  const drawings = projectId ? getDrawingsByProjectId(projectId) : [];
  const pricings = projectId ? getPricingsByProjectId(projectId) : [];
  const photos = projectId ? getPhotosByProjectId(projectId) : [];
  const activities = projectId ? getActivitiesByProjectId(projectId) : [];
  const latestProposal = proposals.length > 0 ? proposals[proposals.length - 1] : undefined;

  // Handler functions for interactive components
  const handleSignProposal = (signature: string, proposalId: string) => {
    if (!project) return;

    // Find the proposal that was signed
    const signedProposal = proposals.find(p => p.id === proposalId);

    // Update the specific proposal status
    updateProposal(proposalId, {
      status: 'signed',
    });

    // Update project with signature info (uses the latest signed proposal)
    updateProject(project.id, {
      customerSignature: signature,
      signatureDate: new Date().toISOString(),
      status: 'awaiting_deposit',
    });

    addActivity({
      projectId: project.id,
      type: 'proposal_signed',
      content: `Proposal "${signedProposal?.name || 'Proposal'}" signed by ${customer?.name || 'customer'}`,
    });
    // Don't close modal here - ProposalReview handles moving to next unsigned or closing
  };

  const handleDepositPayment = () => {
    if (!project) return;
    updateProject(project.id, {
      depositPaid: true,
      status: 'permit_preparation',
    });
    addActivity({
      projectId: project.id,
      type: 'payment_received',
      content: `Deposit payment received`,
    });
    setShowDepositPayment(false);
  };

  const handleFinalPayment = () => {
    if (!project) return;
    updateProject(project.id, {
      finalPaymentPaid: true,
      status: 'requesting_review',
    });
    addActivity({
      projectId: project.id,
      type: 'payment_received',
      content: `Final payment received`,
    });
    setShowFinalPayment(false);
  };

  const handleDocumentUpload = (files: File[]) => {
    if (!project) return;
    // In a real app, you would upload these files and store references
    addActivity({
      projectId: project.id,
      type: 'note_added',
      content: `Customer uploaded ${files.length} document(s)`,
    });
    setShowDocumentUpload(false);
  };

  // Project not found
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md text-center">
          <div className="py-8 px-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Project Not Found</h1>
            <p className="text-gray-600">
              The project you're looking for doesn't exist or the link may be incorrect.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Portal not live
  if (!project.portalLive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md text-center">
          <div className="py-8 px-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Portal Not Available Yet</h1>
            <p className="text-gray-600">
              Your customer portal is being set up. Please check back soon or contact your sales representative.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const customerName = customer?.name || 'Customer';

  // Determine contact info based on project phase
  const getContactInfo = () => {
    const projectStatus = project?.status;
    const customerStatus = customer?.status;

    // Check if customer is in pre-sale (use customer.status for pre-sale phases)
    const preSaleCustomerStatuses = ['new_lead', 'contact_attempted', 'contacted', 'needs_qualifying', 'quote_scheduled', 'building_proposal', 'proposal_sent', 'awaiting_deposit', 'quote_expired', 'lost'];
    const isInPreSale = customerStatus && preSaleCustomerStatuses.includes(customerStatus);

    // Phase 5 & 6 (Installation) + Fixes: Show Colt Stonerook
    const schedulingAndInstallationStatuses = ['installation_scheduled', 'installation_delayed', 'installation_in_progress', 'scheduling_walkthrough', 'walkthrough_scheduled', 'fixes_needed'];

    // Phase 7 (Close Out - after fixes): Show Fence Boys Team
    const closeOutStatuses = ['final_payment_due', 'requesting_review', 'complete'];

    // Pre-sale: Always show assigned salesperson
    if (isInPreSale) {
      return {
        type: 'salesperson' as const,
        name: salesperson?.name || 'Your Sales Rep',
        phone: salesperson?.phone || '(512) 883-3623',
        email: salesperson?.email || 'sales@fenceboys.com',
        avatar: salesperson?.avatar,
        initials: salesperson?.name?.split(' ').map(n => n[0]).join('') || 'FB',
      };
    } else if (projectStatus && schedulingAndInstallationStatuses.includes(projectStatus)) {
      return {
        type: 'colt' as const,
        name: 'Colt Stonerook',
        phone: '(512) 883-3623',
        email: 'colt@fenceboys.com',
        avatar: undefined,
        initials: 'CS',
      };
    } else {
      // Permits, Materials, or Close Out - Fence Boys Team
      return {
        type: 'team' as const,
        name: 'Fence Boys Team',
        phone: '(512) 883-3623',
        email: 'support@fenceboys.com',
        avatar: undefined,
        initials: 'FB',
      };
    }
  };

  const contactInfo = getContactInfo();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#2563EB] text-white">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 bg-white rounded flex items-center justify-center flex-shrink-0">
              <span className="text-[#2563EB] font-bold text-xs">FB</span>
            </div>
            <span className="font-bold">Fence Boys</span>
          </div>
        </div>
      </header>

      {/* Compact Progress Tracker */}
      <div className="mt-6">
        <CompactProgressTracker status={project.status} />
      </div>

      {/* Main Content - Centered Tabs */}
      <main className="flex-1 flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-2xl">
          {/* Customer Header & Info Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
            {/* Customer Name - Prominent Header */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{customerName}</h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-gray-100">
              {/* Project Info */}
              {customer && (
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{project.address}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <a href={`tel:${customer.phone}`} className="text-blue-600 hover:underline">{customer.phone}</a>
                    <span className="mx-2">•</span>
                    <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">{customer.email}</a>
                  </p>
                </div>
              )}

              {/* Point of Contact - changes based on project phase */}
              <div className="flex items-center gap-3">
                {contactInfo.avatar ? (
                  <img
                    src={contactInfo.avatar}
                    alt={contactInfo.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    contactInfo.type === 'team' ? 'bg-green-100' :
                    contactInfo.type === 'colt' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    <span className={`font-semibold text-xs ${
                      contactInfo.type === 'team' ? 'text-green-600' :
                      contactInfo.type === 'colt' ? 'text-purple-600' : 'text-blue-600'
                    }`}>
                      {contactInfo.initials}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-900 font-medium">{contactInfo.name}</p>
                  <a href={`tel:${contactInfo.phone}`} className="block text-xs text-blue-600 hover:underline">
                    {contactInfo.phone}
                  </a>
                  <a href={`mailto:${contactInfo.email}`} className="block text-xs text-blue-600 hover:underline">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Tab System */}
          <Card padding="none" className="shadow-lg">
            <div className="px-6 pt-4">
              <PortalTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'status' && (
                <StatusContent
                  project={project}
                  salesperson={salesperson}
                  customer={customer}
                  onSignProposal={() => setShowProposalReview(true)}
                  onPayDeposit={() => setShowDepositPayment(true)}
                  onUploadDocument={() => setShowDocumentUpload(true)}
                  onPayFinal={() => setShowFinalPayment(true)}
                  onLeaveReview={() => window.open('https://g.page/r/review', '_blank')}
                  onBookAppointment={(date, time) => {
                    // Update project with appointment and change status
                    updateProject(project.id, {
                      salesAppointment: date.toISOString(),
                      status: 'quote_scheduled',
                    });
                    addActivity({
                      projectId: project.id,
                      type: 'status_change',
                      content: `Appointment scheduled for ${date.toLocaleDateString()} at ${time}`,
                    });
                  }}
                />
              )}

              {activeTab === 'documents' && (
                <DocumentsList
                  proposals={proposals}
                  drawings={drawings}
                  pricings={pricings}
                  photos={photos}
                  signedProposal={
                    project.customerSignature
                      ? { signature: project.customerSignature, signatureDate: project.signatureDate || '' }
                      : null
                  }
                  onUploadClick={() => setShowDocumentUpload(true)}
                />
              )}

              {activeTab === 'communication' && (
                <CommunicationLog activities={activities} />
              )}
            </div>
          </Card>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Fence Boys. All rights reserved.</p>
        </div>
      </footer>

      {/* Testing Panel */}
      <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowTestingPanel(!showTestingPanel)}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-gray-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Test Mode
          </button>

          {showTestingPanel && (
            <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Portal Status Testing</h3>
                <button
                  onClick={() => setShowTestingPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Info banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-4">
                <p className="text-xs text-blue-800">
                  <strong>Backend Note:</strong> Pre-sale statuses use <code className="bg-blue-100 px-1 rounded">customer.status</code>, post-sale uses <code className="bg-blue-100 px-1 rounded">project.status</code>
                </p>
              </div>

              {/* Unified Status Dropdown */}
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-700 mb-2 block">Portal Status</label>
                <select
                  value={
                    // Pre-sale OR terminal states (quote_expired, lost) use customer status
                    customer && (isPreSale(customer.status) || customer.status === 'quote_expired' || customer.status === 'lost')
                      ? `customer:${customer.status}`
                      : `project:${project.status}`
                  }
                  onChange={(e) => {
                    const [type, status] = e.target.value.split(':');
                    if (type === 'customer' && customer) {
                      // Pre-sale/terminal: update customer status AND reset project to not_started
                      updateCustomer(customer.id, { status: status as CustomerStatus });
                      updateProject(project.id, { status: 'not_started' as ProjectStatus });
                    } else if (type === 'project' && customer) {
                      // Post-sale: set customer to active_project and update project status
                      updateCustomer(customer.id, { status: 'active_project' });
                      updateProject(project.id, { status: status as ProjectStatus });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {/* Pre-Sale Group (Customer Status) */}
                  <optgroup label="── PRE-SALE (customer.status) ──">
                    {customerStatuses
                      .filter(s => {
                        const config = customerStatusConfigs.find(c => c.name === s.label);
                        return config?.hasPortalPage === true;
                      })
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((s) => (
                        <option key={`customer:${s.id}`} value={`customer:${s.id}`}>
                          {s.label}
                        </option>
                      ))}
                  </optgroup>

                  {/* Post-Sale Group (Project Status) */}
                  <optgroup label="── POST-SALE (project.status) ──">
                    {projectStatuses
                      .filter(s => s.id !== 'not_started') // Skip placeholder status
                      .map((s) => (
                        <option key={`project:${s.id}`} value={`project:${s.id}`}>
                          {s.label}
                        </option>
                      ))}
                  </optgroup>
                </select>

                {/* Prev/Next Buttons */}
                {(() => {
                  // Build combined list of all testable statuses
                  const preSaleStatuses = customerStatuses
                    .filter(s => {
                      const config = customerStatusConfigs.find(c => c.name === s.label);
                      return config?.hasPortalPage === true;
                    })
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map(s => ({ type: 'customer', id: s.id, label: s.label }));

                  const postSaleStatuses = projectStatuses
                    .filter(s => s.id !== 'not_started')
                    .map(s => ({ type: 'project', id: s.id, label: s.label }));

                  const allStatuses = [...preSaleStatuses, ...postSaleStatuses];

                  // Find current index
                  const currentValue = customer && (isPreSale(customer.status) || customer.status === 'quote_expired' || customer.status === 'lost')
                    ? `customer:${customer.status}`
                    : `project:${project.status}`;
                  const [currentType, currentId] = currentValue.split(':');
                  const currentIndex = allStatuses.findIndex(s => s.type === currentType && s.id === currentId);

                  const goToStatus = (index: number) => {
                    const status = allStatuses[index];
                    if (!status || !customer) return;

                    if (status.type === 'customer') {
                      updateCustomer(customer.id, { status: status.id as CustomerStatus });
                      updateProject(project.id, { status: 'not_started' as ProjectStatus });
                    } else {
                      updateCustomer(customer.id, { status: 'active_project' });
                      updateProject(project.id, { status: status.id as ProjectStatus });
                    }
                  };

                  return (
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => goToStatus(currentIndex - 1)}
                        disabled={currentIndex <= 0}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Prev
                      </button>
                      <span className="text-xs text-gray-500">
                        {currentIndex + 1} / {allStatuses.length}
                      </span>
                      <button
                        onClick={() => goToStatus(currentIndex + 1)}
                        disabled={currentIndex >= allStatuses.length - 1}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Current state indicator */}
              <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                <p className="text-xs text-gray-600">
                  <strong>Phase:</strong>{' '}
                  {customer && (isPreSale(customer.status) || customer.status === 'quote_expired' || customer.status === 'lost') ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">Pre-Sale</span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Post-Sale</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  customer.status: <code className="bg-gray-100 px-1 rounded">{customer?.status}</code>
                </p>
                <p className="text-xs text-gray-500">
                  project.status: <code className="bg-gray-100 px-1 rounded">{project.status}</code>
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Interactive Modals */}
      <ProposalReview
        isOpen={showProposalReview}
        onClose={() => setShowProposalReview(false)}
        proposals={proposals}
        customerName={customerName}
        onSign={handleSignProposal}
      />

      <DepositPayment
        isOpen={showDepositPayment}
        onClose={() => setShowDepositPayment(false)}
        depositAmount={project.depositAmount || (latestProposal?.depositAmount) || (latestProposal ? latestProposal.total * 0.5 : 1000)}
        onPaymentComplete={handleDepositPayment}
      />

      <FinalPayment
        isOpen={showFinalPayment}
        onClose={() => setShowFinalPayment(false)}
        finalAmount={project.finalPaymentAmount || (latestProposal ? latestProposal.total - (latestProposal.depositAmount || latestProposal.total * 0.5) : 1000)}
        onPaymentComplete={handleFinalPayment}
      />

      <DocumentUpload
        isOpen={showDocumentUpload}
        onClose={() => setShowDocumentUpload(false)}
        description={project.documentationNeededDescription}
        onUpload={handleDocumentUpload}
      />
    </div>
  );
};
