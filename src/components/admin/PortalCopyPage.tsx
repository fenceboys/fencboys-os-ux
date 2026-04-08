import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../layout';
import { Card, Button, Modal } from '../ui';
import { customerStatuses, projectStatuses, CustomerStatusInfo, ProjectStatusInfo } from '../../constants/statuses';

type InteractiveType = 'none' | 'calendly_booking' | 'proposal_review' | 'deposit_payment' | 'document_upload' | 'final_payment' | 'review_request';

interface PortalCopyConfig {
  statusId: string;
  statusType: 'customer' | 'project';
  title: string;
  description: string;
  interactiveType: InteractiveType;
}

// Default portal copy for each status (would come from DataContext in production)
const defaultPortalCopy: PortalCopyConfig[] = [
  // Customer statuses (pre-sale)
  { statusId: 'new_lead', statusType: 'customer', title: 'Schedule Your Free Consultation', description: 'Book your on-site fence consultation below.', interactiveType: 'calendly_booking' },
  { statusId: 'contact_attempted', statusType: 'customer', title: "We're Trying to Reach You", description: "We've tried to contact you about your fence project. Please call us back or schedule a time below.", interactiveType: 'calendly_booking' },
  { statusId: 'contacted', statusType: 'customer', title: 'Schedule Your Free Consultation', description: 'Great chatting with you! Book your on-site fence consultation below.', interactiveType: 'calendly_booking' },
  { statusId: 'repair_scheduled', statusType: 'customer', title: 'Repair Visit Scheduled', description: 'Your repair visit is scheduled. Our team will assess the repair and discuss your options.', interactiveType: 'none' },
  { statusId: 'quote_scheduled', statusType: 'customer', title: 'Quote Visit Scheduled', description: 'Your quote visit is scheduled. Your sales representative will visit your property to assess the project.', interactiveType: 'none' },
  { statusId: 'building_proposal', statusType: 'customer', title: 'Building Your Proposal', description: "We're putting together your custom fence quote based on our site visit. You'll receive it soon!", interactiveType: 'none' },
  { statusId: 'proposal_sent', statusType: 'customer', title: 'Your Proposal is Ready!', description: "Review your custom fence proposal below. Once you're happy with everything, sign to get your project started.", interactiveType: 'proposal_review' },
  { statusId: 'awaiting_deposit', statusType: 'customer', title: 'Contract Signed!', description: 'Great news! Your contract has been signed. Pay your deposit to officially start your project.', interactiveType: 'deposit_payment' },
  { statusId: 'won', statusType: 'customer', title: 'Welcome to the Fence Boys Family!', description: 'Your project is officially underway. Check back here for updates on permits, materials, and installation.', interactiveType: 'none' },
  { statusId: 'lost', statusType: 'customer', title: 'Project Closed', description: "This project has been closed. If you'd like to restart your fence project, please contact us.", interactiveType: 'none' },

  // Project statuses (post-sale)
  { statusId: 'not_started', statusType: 'project', title: 'Getting Started', description: "Your project is being set up. We'll update you when we begin the permit process.", interactiveType: 'none' },
  { statusId: 'permit_preparation', statusType: 'project', title: 'Preparing Your Permit', description: "We're preparing all the necessary documents to submit your permit application to the city.", interactiveType: 'none' },
  { statusId: 'permit_submitted', statusType: 'project', title: 'Permit Submitted', description: 'Your permit has been submitted to the city for approval. This typically takes 1-3 weeks.', interactiveType: 'none' },
  { statusId: 'permit_revision_needed', statusType: 'project', title: 'Permit Revision Required', description: 'The city has requested some revisions to your permit application. Our team is working on the updates.', interactiveType: 'none' },
  { statusId: 'permit_resubmitted', statusType: 'project', title: 'Permit Resubmitted', description: "We've made the requested changes and resubmitted your permit. Waiting for final approval.", interactiveType: 'none' },
  { statusId: 'ready_to_order_materials', statusType: 'project', title: 'Permit Approved!', description: "Great news! Your permit has been approved. We're preparing to order your fence materials.", interactiveType: 'none' },
  { statusId: 'materials_ordered', statusType: 'project', title: 'Materials Ordered', description: "Your fence materials have been ordered and are on the way. We'll be in touch once they arrive.", interactiveType: 'none' },
  { statusId: 'installation_scheduled', statusType: 'project', title: 'Installation Scheduled!', description: 'Your fence installation is scheduled. Our crew will arrive in the morning to get started.', interactiveType: 'none' },
  { statusId: 'installation_delayed', statusType: 'project', title: 'Installation Delayed', description: "Unfortunately, your installation has been delayed. We'll contact you to reschedule.", interactiveType: 'none' },
  { statusId: 'installation_in_progress', statusType: 'project', title: 'Installation in Progress', description: 'Your fence is being built! Our crew is working hard to complete your installation.', interactiveType: 'none' },
  { statusId: 'walkthrough_scheduled', statusType: 'project', title: 'Walkthrough Scheduled', description: "Your final walkthrough has been scheduled. We'll review the installation together.", interactiveType: 'none' },
  { statusId: 'fixes_needed', statusType: 'project', title: 'Addressing Concerns', description: "We're working on the items identified during your walkthrough.", interactiveType: 'none' },
  { statusId: 'final_payment_due', statusType: 'project', title: 'Final Payment Due', description: 'Your fence project is complete! Please submit your final payment to close out the project.', interactiveType: 'final_payment' },
  { statusId: 'complete', statusType: 'project', title: 'Project Complete!', description: 'Thank you for choosing Fence Boys! Your fence project is complete. Enjoy your new fence!', interactiveType: 'none' },
];

const interactiveTypeLabels: Record<InteractiveType, string> = {
  none: 'None (Info Only)',
  calendly_booking: 'Calendly Booking',
  proposal_review: 'Proposal Review & Sign',
  deposit_payment: 'Deposit Payment',
  document_upload: 'Document Upload',
  final_payment: 'Final Payment',
  review_request: 'Review Request',
};

const getStatusColor = (color: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    green: { bg: 'bg-green-100', text: 'text-green-800' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-800' },
    red: { bg: 'bg-red-100', text: 'text-red-800' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-800' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-800' },
  };
  return colors[color] || colors.gray;
};

export const PortalCopyPage: React.FC = () => {
  const [portalCopyConfigs, setPortalCopyConfigs] = useState<PortalCopyConfig[]>(defaultPortalCopy);
  const [editingConfig, setEditingConfig] = useState<PortalCopyConfig | null>(null);
  const [previewConfig, setPreviewConfig] = useState<PortalCopyConfig | null>(null);

  const handleSave = (updated: PortalCopyConfig) => {
    setPortalCopyConfigs(prev =>
      prev.map(config =>
        config.statusId === updated.statusId && config.statusType === updated.statusType
          ? updated
          : config
      )
    );
    setEditingConfig(null);
  };

  const getConfigForStatus = (statusId: string, statusType: 'customer' | 'project') => {
    return portalCopyConfigs.find(c => c.statusId === statusId && c.statusType === statusType);
  };

  const renderStatusRow = (
    status: CustomerStatusInfo | ProjectStatusInfo,
    statusType: 'customer' | 'project'
  ) => {
    const config = getConfigForStatus(status.id, statusType);
    const colors = getStatusColor(status.color);

    return (
      <div
        key={`${statusType}-${status.id}`}
        className="px-4 py-4 flex items-start justify-between hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
              {status.label}
            </span>
            {config?.interactiveType !== 'none' && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                {interactiveTypeLabels[config?.interactiveType || 'none']}
              </span>
            )}
          </div>
          <div className="ml-1">
            <p className="text-sm font-medium text-gray-900">{config?.title || 'No title set'}</p>
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{config?.description || 'No description set'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setPreviewConfig(config || null)}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            Preview
          </button>
          <button
            onClick={() => setEditingConfig(config || null)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
          >
            Edit
          </button>
        </div>
      </div>
    );
  };

  return (
    <PageLayout>
      <PageHeader
        title="Portal Copy"
        subtitle="Configure what customers see in their portal for each status"
        icon={
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        }
      />

      <div className="space-y-6">
        {/* Customer Statuses (Pre-Sale) */}
        <Card>
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">
                Lead Status (Pre-Sale)
              </h3>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              These statuses control the portal before a project is won
            </p>
          </div>
          <div>
            {customerStatuses.map(status => renderStatusRow(status, 'customer'))}
          </div>
        </Card>

        {/* Project Statuses (Post-Sale) */}
        <Card>
          <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide">
                Project Status (Post-Sale)
              </h3>
            </div>
            <p className="text-xs text-green-600 mt-1">
              These statuses control the portal after a customer is won
            </p>
          </div>
          <div>
            {projectStatuses.map(status => renderStatusRow(status, 'project'))}
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      {editingConfig && (
        <EditPortalCopyModal
          config={editingConfig}
          onSave={handleSave}
          onClose={() => setEditingConfig(null)}
        />
      )}

      {/* Preview Modal */}
      {previewConfig && (
        <PreviewModal
          config={previewConfig}
          onClose={() => setPreviewConfig(null)}
        />
      )}
    </PageLayout>
  );
};

// Edit Modal Component
interface EditModalProps {
  config: PortalCopyConfig;
  onSave: (config: PortalCopyConfig) => void;
  onClose: () => void;
}

const EditPortalCopyModal: React.FC<EditModalProps> = ({ config, onSave, onClose }) => {
  const [title, setTitle] = useState(config.title);
  const [description, setDescription] = useState(config.description);
  const [interactiveType, setInteractiveType] = useState<InteractiveType>(config.interactiveType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...config,
      title,
      description,
      interactiveType,
    });
  };

  const statusInfo = config.statusType === 'customer'
    ? customerStatuses.find(s => s.id === config.statusId)
    : projectStatuses.find(s => s.id === config.statusId);

  return (
    <Modal isOpen onClose={onClose} title="Edit Portal Copy" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Status Badge */}
        <div className="flex items-center gap-2 pb-4 border-b">
          <span className="text-sm text-gray-500">Editing copy for:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusInfo?.color || 'gray').bg} ${getStatusColor(statusInfo?.color || 'gray').text}`}>
            {statusInfo?.label}
          </span>
          <span className="text-xs text-gray-400">
            ({config.statusType === 'customer' ? 'Lead Status' : 'Project Status'})
          </span>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Your Proposal is Ready!"
          />
          <p className="text-xs text-gray-400 mt-1">This is the headline customers see</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Review your custom fence proposal below..."
          />
          <p className="text-xs text-gray-400 mt-1">Supporting text that explains what's happening</p>
        </div>

        {/* Interactive Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interactive Element
          </label>
          <select
            value={interactiveType}
            onChange={e => setInteractiveType(e.target.value as InteractiveType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(interactiveTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">What action can customers take from this status?</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Preview Modal Component
interface PreviewModalProps {
  config: PortalCopyConfig;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ config, onClose }) => {
  const statusInfo = config.statusType === 'customer'
    ? customerStatuses.find(s => s.id === config.statusId)
    : projectStatuses.find(s => s.id === config.statusId);

  return (
    <Modal isOpen onClose={onClose} title="Portal Preview" size="md">
      <div className="bg-gray-100 rounded-xl p-6">
        {/* Simulated Portal Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-md mx-auto">
          {/* Status indicator */}
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(statusInfo?.color || 'gray').bg} ${getStatusColor(statusInfo?.color || 'gray').text}`}>
              {statusInfo?.label}
            </span>
          </div>

          {/* Icon placeholder */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {config.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            {config.description}
          </p>

          {/* Interactive element preview */}
          {config.interactiveType !== 'none' && (
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              {config.interactiveType === 'calendly_booking' && 'Book Appointment'}
              {config.interactiveType === 'proposal_review' && 'Review & Sign Proposal'}
              {config.interactiveType === 'deposit_payment' && 'Pay Deposit'}
              {config.interactiveType === 'document_upload' && 'Upload Documents'}
              {config.interactiveType === 'final_payment' && 'Pay Final Balance'}
              {config.interactiveType === 'review_request' && 'Leave a Review'}
            </button>
          )}

          {/* Contact buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">Questions?</p>
            <div className="flex justify-center gap-3">
              <span className="px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">Call</span>
              <span className="px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">Text</span>
              <span className="px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">Email</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};
