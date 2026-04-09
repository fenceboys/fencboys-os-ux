import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../layout';
import { Card, Button, Modal } from '../ui';
import { useData } from '../../context/DataContext';
import { CustomerStatusConfig, ProjectStatusConfig } from '../../types';

type InteractiveType = 'none' | 'calendly_booking' | 'proposal_review' | 'deposit_payment' | 'document_upload' | 'final_payment' | 'review_request' | 'request_new_quote' | 'reschedule_quote';

type SubBoxStyle = 'checklist' | 'numbered' | 'info';
type SubBoxColor = 'blue' | 'green' | 'orange' | 'gray' | 'purple';

interface SubBoxItem {
  text: string;
  status?: 'complete' | 'pending' | 'active'; // for checklists: complete=green check, pending=animated, active=blue
}

interface SubBoxConfig {
  title?: string;
  style: SubBoxStyle;
  color: SubBoxColor;
  items?: SubBoxItem[];
  infoText?: string; // for info style boxes
}

interface PortalCopyConfig {
  statusId: string;
  statusType: 'customer' | 'project';
  title: string;
  description: string;
  interactiveType: InteractiveType;
  subBox?: SubBoxConfig;
}

// Default portal copy for each status (would come from DataContext in production)
const getDefaultPortalCopy = (customerConfigs: CustomerStatusConfig[], projectConfigs: ProjectStatusConfig[]): PortalCopyConfig[] => {
  const customerCopy: PortalCopyConfig[] = customerConfigs.map(config => {
    // Map status names to appropriate defaults
    const defaults: Record<string, { title: string; description: string; interactiveType: InteractiveType; subBox?: SubBoxConfig }> = {
      'New Lead': { title: 'Schedule Your Free Consultation', description: 'Book your on-site fence consultation below.', interactiveType: 'calendly_booking' },
      'Contact Attempted': { title: "We're Trying to Reach You", description: "We've tried to contact you about your fence project. Please call us back or schedule a time below.", interactiveType: 'calendly_booking' },
      'Contacted': { title: 'Schedule Your Free Consultation', description: 'Great chatting with you! Book your on-site fence consultation below.', interactiveType: 'calendly_booking' },
      'Quote Scheduled': { title: 'Your Consultation is Booked', description: "We'll visit your property to discuss your project.", interactiveType: 'reschedule_quote' },
      'Building Proposal': {
        title: 'Thanks for Meeting With Us!',
        description: "We're putting together your custom pricing and proposal based on our site visit.",
        interactiveType: 'none',
        subBox: {
          title: 'What happens next:',
          style: 'checklist',
          color: 'gray',
          items: [
            { text: 'Your proposal will appear here when ready', status: 'complete' },
            { text: 'Review, download, and sign online', status: 'complete' },
            { text: "We'll text & email you when it's ready", status: 'complete' },
          ],
        },
      },
      'Proposal Sent': {
        title: 'Your Proposal is Ready!',
        description: "We've put together a custom proposal for your fence project. Review the details and sign to get started.",
        interactiveType: 'proposal_review',
        subBox: {
          title: 'How it works:',
          style: 'numbered',
          color: 'gray',
          items: [
            { text: 'Open your proposal, download it if you want' },
            { text: 'Review the details and sign' },
            { text: "Once signed, you'll be prompted to pay your deposit" },
          ],
        },
      },
      'Awaiting Deposit': {
        title: 'Contract Signed!',
        description: 'Thank you for signing! Please pay your deposit below and we will get to work.',
        interactiveType: 'deposit_payment',
        subBox: {
          title: 'After your deposit:',
          style: 'numbered',
          color: 'gray',
          items: [
            { text: 'We will draft and submit your permit to your local municipality' },
            { text: 'After permits, we order your materials' },
            { text: 'Once materials arrive, we schedule your installation' },
          ],
        },
      },
      'Quote Expired': { title: 'Your Quote Has Expired', description: 'We can only guarantee the pricing on our quotes for two weeks.', interactiveType: 'request_new_quote' },
      'Won': { title: 'Welcome to the Fence Boys Family!', description: 'Your project is officially underway. Check back here for updates on permits, materials, and installation.', interactiveType: 'none' },
      'Lost': { title: 'Project Closed', description: "This project has been closed. If you'd like to restart your fence project, please contact us.", interactiveType: 'none' },
    };
    const d = defaults[config.name] || { title: config.customerLabel, description: '', interactiveType: 'none' as InteractiveType };
    return { statusId: config.id, statusType: 'customer' as const, ...d };
  });

  const projectCopy: PortalCopyConfig[] = projectConfigs.map(config => {
    const defaults: Record<string, { title: string; description: string; interactiveType: InteractiveType; subBox?: SubBoxConfig }> = {
      'Not Started': { title: 'Getting Started', description: "Your project is being set up. We'll update you when we begin the permit process.", interactiveType: 'none' },
      'Permit Preparation': { title: 'Preparing Your Permit', description: "We're putting together all the necessary documents to submit your permit application to the city.", interactiveType: 'none' },
      'Customer Docs Needed': {
        title: 'Documents Needed',
        description: 'We need some additional documents from you to complete your permit application.',
        interactiveType: 'document_upload',
        subBox: {
          style: 'info',
          color: 'orange',
          infoText: 'Someone on the Fence Boys team will reach out to let you know what we need.',
        },
      },
      'Permit Submitted': {
        title: 'Permit Submitted',
        description: "Your permit application has been submitted to the city. We're waiting for their review and approval.",
        interactiveType: 'none',
        subBox: {
          title: 'What to expect:',
          style: 'checklist',
          color: 'gray',
          items: [
            { text: "We'll notify you of any updates", status: 'complete' },
            { text: "Once approved, we'll order materials", status: 'complete' },
          ],
        },
      },
      'Permit Revision Needed': {
        title: 'Making Revisions',
        description: 'The city has requested some changes to your permit application. Our team is working on the updates.',
        interactiveType: 'none',
        subBox: {
          title: "Don't worry, this is normal!",
          style: 'info',
          color: 'orange',
          infoText: "Minor revisions are common. We'll resubmit as soon as the changes are complete.",
        },
      },
      'Permit Resubmitted': {
        title: 'Permit Resubmitted',
        description: "We've made the requested changes and resubmitted your permit. Waiting for final approval from the city.",
        interactiveType: 'none',
        subBox: {
          title: 'Almost there:',
          style: 'checklist',
          color: 'gray',
          items: [
            { text: 'Revisions completed', status: 'complete' },
            { text: 'Application resubmitted', status: 'complete' },
            { text: 'Awaiting final approval', status: 'pending' },
          ],
        },
      },
      'Ready to Order Materials': {
        title: 'Permit Approved!',
        description: 'Great news! Your permit has been approved by the city.',
        interactiveType: 'none',
        subBox: {
          title: 'What happens next:',
          style: 'checklist',
          color: 'green',
          items: [
            { text: "We'll order your materials", status: 'complete' },
            { text: 'Schedule installation when ready', status: 'complete' },
          ],
        },
      },
      'Materials Ordered': { title: 'Materials Ordered', description: "Your fence materials have been ordered. We'll reach out once they arrive to schedule your installation.", interactiveType: 'none' },
      'Scheduling Installation': {
        title: 'Materials Have Arrived!',
        description: 'Your fence materials are in and ready to go.',
        interactiveType: 'none',
        subBox: {
          style: 'info',
          color: 'green',
          infoText: "We'll reach out to schedule your install.",
        },
      },
      'Installation Scheduled': {
        title: 'Installation Scheduled!',
        description: 'Mark your calendar - your new fence is coming.',
        interactiveType: 'none',
        subBox: {
          title: 'Before we arrive:',
          style: 'checklist',
          color: 'blue',
          items: [
            { text: 'Clear the fence line area', status: 'complete' },
            { text: 'Ensure gate access for our crew', status: 'complete' },
            { text: 'Secure pets indoors if possible', status: 'complete' },
          ],
        },
      },
      'Installation Delayed': { title: 'Installation Delayed', description: "We're sorry, but we need to reschedule your installation. We'll reach out shortly to find a new date that works for you.", interactiveType: 'none' },
      'Installation in Progress': {
        title: 'Installation in Progress!',
        description: 'Your fence is being built right now! Our crew is hard at work bringing your project to life.',
        interactiveType: 'none',
        subBox: {
          style: 'info',
          color: 'blue',
          infoText: 'Building your fence',
        },
      },
      'Scheduling Walkthrough': { title: 'Installation Complete!', description: "We'll reach out to schedule a walkthrough to make sure everything is up to our standards and yours. You're welcome to join, but it's not required that you're home.", interactiveType: 'none' },
      'Walkthrough Scheduled': { title: 'Walkthrough Scheduled', description: "We'll inspect the fence to make sure everything is up to our standards and yours. You're welcome to join, but it's not required that you're home.", interactiveType: 'none' },
      'Fixes Needed': { title: 'Addressing Your Concerns', description: "We're working on the items identified during your walkthrough. Your satisfaction is our priority.", interactiveType: 'none' },
      'Final Payment Due': { title: 'Your Fence is Complete!', description: 'Congratulations! Your fence installation is finished. Complete your final payment to close out the project.', interactiveType: 'final_payment' },
      'Requesting Review': { title: 'Thank You!', description: 'Your fence project is complete and paid in full. We hope you had a wonderful experience working with Fence Boys. Please consider leaving us a review!', interactiveType: 'review_request' },
      'Complete': { title: 'Project Complete!', description: 'Thank you for choosing Fence Boys! Enjoy your beautiful new fence.', interactiveType: 'none' },
    };
    const d = defaults[config.name] || { title: config.customerLabel, description: '', interactiveType: 'none' as InteractiveType };
    return { statusId: config.id, statusType: 'project' as const, ...d };
  });

  return [...customerCopy, ...projectCopy];
};

const interactiveTypeLabels: Record<InteractiveType, string> = {
  none: 'None (Info Only)',
  calendly_booking: 'Calendly Booking',
  proposal_review: 'Proposal Review & Sign',
  deposit_payment: 'Deposit Payment',
  document_upload: 'Document Upload',
  final_payment: 'Final Payment',
  review_request: 'Review Request',
  request_new_quote: 'Request New Quote',
  reschedule_quote: 'Reschedule Quote',
};

type TabType = 'pre_sale' | 'post_sale';

// Icon and color mapping to match the actual portal (StatusContent.tsx)
type IconType = 'calendar' | 'check-circle' | 'clock' | 'x' | 'wrench' | 'gear' | 'check' | 'download' | 'document' | 'edit' | 'refresh' | 'warning' | 'star' | 'logo';
type ColorType = 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'purple' | 'gray';

interface StatusVisual {
  icon: IconType;
  bgColor: string;
  iconColor: string;
}

const getStatusVisual = (statusName: string): StatusVisual => {
  const visuals: Record<string, StatusVisual> = {
    // Pre-sale (customer status)
    'New Lead': { icon: 'calendar', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Contact Attempted': { icon: 'calendar', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Contacted': { icon: 'calendar', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Quote Scheduled': { icon: 'calendar', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Building Proposal': { icon: 'logo', bgColor: '', iconColor: '' },
    'Proposal Sent': { icon: 'check-circle', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    'Awaiting Deposit': { icon: 'check-circle', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    'Quote Expired': { icon: 'clock', bgColor: 'bg-red-100', iconColor: 'text-red-600' },
    'Won': { icon: 'check-circle', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    'Lost': { icon: 'x', bgColor: 'bg-gray-100', iconColor: 'text-gray-500' },
    // Post-sale (project status)
    'Not Started': { icon: 'document', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Permit Preparation': { icon: 'document', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Customer Docs Needed': { icon: 'warning', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    'Permit Submitted': { icon: 'clock', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Permit Revision Needed': { icon: 'edit', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
    'Permit Resubmitted': { icon: 'refresh', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Ready to Order Materials': { icon: 'check-circle', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    'Materials Ordered': { icon: 'download', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Scheduling Installation': { icon: 'check', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    'Installation Scheduled': { icon: 'calendar', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Installation Delayed': { icon: 'clock', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
    'Installation in Progress': { icon: 'wrench', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Scheduling Walkthrough': { icon: 'check-circle', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    'Walkthrough Scheduled': { icon: 'calendar', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    'Fixes Needed': { icon: 'gear', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
    'Final Payment Due': { icon: 'check-circle', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    'Requesting Review': { icon: 'star', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    'Complete': { icon: 'logo', bgColor: '', iconColor: '' },
  };
  return visuals[statusName] || { icon: 'document', bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
};

const renderStatusIcon = (iconType: IconType, colorClass: string): React.ReactNode => {
  const icons: Record<IconType, React.ReactNode> = {
    calendar: (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    'check-circle': (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    clock: (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    x: (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    wrench: (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
      </svg>
    ),
    gear: (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    check: (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    download: (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ),
    document: (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    edit: (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    refresh: (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    warning: (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    star: (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    logo: <></>, // Will be handled separately
  };
  return icons[iconType] || icons.document;
};

export const PortalCopyPage: React.FC = () => {
  const { customerStatusConfigs, projectStatusConfigs } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('pre_sale');
  const [portalCopyConfigs, setPortalCopyConfigs] = useState<PortalCopyConfig[]>(() =>
    getDefaultPortalCopy(customerStatusConfigs, projectStatusConfigs)
  );
  const [editingConfig, setEditingConfig] = useState<PortalCopyConfig | null>(null);

  // Only show statuses that have portal pages
  const activeCustomerStatuses = customerStatusConfigs
    .filter(s => s.isActive && s.hasPortalPage)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Exclude statuses where the portal isn't needed
  const excludedProjectStatuses = ['Not Started'];
  const activeProjectStatuses = projectStatusConfigs
    .filter(s => s.isActive && !excludedProjectStatuses.includes(s.name))
    .sort((a, b) => a.sortOrder - b.sortOrder);

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

  const renderStatusCard = (
    statusConfig: CustomerStatusConfig | ProjectStatusConfig,
    statusType: 'customer' | 'project'
  ) => {
    const config = getConfigForStatus(statusConfig.id, statusType);

    return (
      <div
        key={`${statusType}-${statusConfig.id}`}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Header with status badge */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: statusConfig.bgColor,
              color: statusConfig.textColor,
            }}
          >
            {statusConfig.name}
          </span>
          {config?.interactiveType !== 'none' && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded">
              {interactiveTypeLabels[config?.interactiveType || 'none']}
            </span>
          )}
        </div>

        {/* Portal Preview */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            {/* Simulated Portal Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center max-w-sm mx-auto">
              {/* Icon - matches actual portal */}
              {(() => {
                const visual = getStatusVisual(statusConfig.name);
                if (visual.icon === 'logo') {
                  return (
                    <div className="w-16 h-16 mx-auto mb-3">
                      <img src="/fence-boys-logo.jpg" alt="Fence Boys" className="w-full h-full object-contain" />
                    </div>
                  );
                }
                return (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${visual.bgColor}`}>
                    {renderStatusIcon(visual.icon, visual.iconColor)}
                  </div>
                );
              })()}

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {config?.title || 'No title set'}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {config?.description || 'No description set'}
              </p>

              {/* Sub-box preview */}
              {config?.subBox && (
                <div
                  className={`rounded-lg p-3 mb-4 text-left text-xs ${
                    config.subBox.color === 'blue' ? 'bg-blue-50 border border-blue-200' :
                    config.subBox.color === 'green' ? 'bg-green-50 border border-green-200' :
                    config.subBox.color === 'orange' ? 'bg-orange-50 border border-orange-200' :
                    config.subBox.color === 'purple' ? 'bg-purple-50 border border-purple-200' :
                    'bg-gray-50 border border-gray-100'
                  }`}
                >
                  {config.subBox.title && (
                    <p className={`font-medium mb-2 ${
                      config.subBox.color === 'blue' ? 'text-blue-800' :
                      config.subBox.color === 'green' ? 'text-green-800' :
                      config.subBox.color === 'orange' ? 'text-orange-800' :
                      config.subBox.color === 'purple' ? 'text-purple-800' :
                      'text-gray-900'
                    }`}>
                      {config.subBox.title}
                    </p>
                  )}
                  {config.subBox.style === 'info' && config.subBox.infoText && (
                    <p className={`${
                      config.subBox.color === 'blue' ? 'text-blue-700' :
                      config.subBox.color === 'green' ? 'text-green-700' :
                      config.subBox.color === 'orange' ? 'text-orange-700' :
                      config.subBox.color === 'purple' ? 'text-purple-700' :
                      'text-gray-600'
                    }`}>
                      {config.subBox.infoText}
                    </p>
                  )}
                  {(config.subBox.style === 'checklist' || config.subBox.style === 'numbered') && config.subBox.items && (
                    <ul className="space-y-1">
                      {config.subBox.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          {config.subBox?.style === 'numbered' ? (
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-semibold ${
                              config.subBox.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {i + 1}
                            </span>
                          ) : (
                            <span className="flex-shrink-0 mt-0.5">
                              {item.status === 'pending' ? (
                                <svg className="w-4 h-4 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                          )}
                          <span className="text-gray-600">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Date placeholder for quote_scheduled */}
              {statusConfig.name === 'Quote Scheduled' && (
                <div className="bg-gray-50 rounded-lg py-4 px-6 mb-4">
                  <p className="text-lg font-bold text-gray-900">[Appointment Date]</p>
                  <p className="text-sm text-blue-600 font-semibold">[Time]</p>
                </div>
              )}

              {/* Interactive element preview */}
              {config?.interactiveType !== 'none' && (
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    config?.interactiveType === 'reschedule_quote'
                      ? 'bg-gray-100 text-gray-700'
                      : 'text-white'
                  }`}
                  style={config?.interactiveType !== 'reschedule_quote' ? { backgroundColor: statusConfig.textColor } : undefined}
                >
                  {config?.interactiveType === 'calendly_booking' && 'Book Appointment'}
                  {config?.interactiveType === 'proposal_review' && 'Review & Sign'}
                  {config?.interactiveType === 'deposit_payment' && 'Pay Deposit'}
                  {config?.interactiveType === 'document_upload' && 'Upload Documents'}
                  {config?.interactiveType === 'final_payment' && 'Pay Balance'}
                  {config?.interactiveType === 'review_request' && 'Leave a Review'}
                  {config?.interactiveType === 'request_new_quote' && 'Request New Quote'}
                  {config?.interactiveType === 'reschedule_quote' && 'Need to Reschedule?'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer with edit button */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setEditingConfig(config || null)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
          >
            Edit Copy
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

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pre_sale')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pre_sale'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Pre-Sale (Customer Status)
                <span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {activeCustomerStatuses.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('post_sale')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'post_sale'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Post-Sale (Project Status)
                <span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {activeProjectStatuses.length}
                </span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'pre_sale' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeCustomerStatuses.map(status => renderStatusCard(status, 'customer'))}
        </div>
      )}

      {activeTab === 'post_sale' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeProjectStatuses.map(status => renderStatusCard(status, 'project'))}
        </div>
      )}

      {/* Edit Modal */}
      {editingConfig && (
        <EditPortalCopyModal
          config={editingConfig}
          statusConfig={
            editingConfig.statusType === 'customer'
              ? customerStatusConfigs.find(s => s.id === editingConfig.statusId)
              : projectStatusConfigs.find(s => s.id === editingConfig.statusId)
          }
          onSave={handleSave}
          onClose={() => setEditingConfig(null)}
        />
      )}
    </PageLayout>
  );
};

// Edit Modal Component
interface EditModalProps {
  config: PortalCopyConfig;
  statusConfig: CustomerStatusConfig | ProjectStatusConfig | undefined;
  onSave: (config: PortalCopyConfig) => void;
  onClose: () => void;
}

const EditPortalCopyModal: React.FC<EditModalProps> = ({ config, statusConfig, onSave, onClose }) => {
  const [title, setTitle] = useState(config.title);
  const [description, setDescription] = useState(config.description);
  const [interactiveType, setInteractiveType] = useState<InteractiveType>(config.interactiveType);
  const [hasSubBox, setHasSubBox] = useState(!!config.subBox);
  const [subBoxTitle, setSubBoxTitle] = useState(config.subBox?.title || '');
  const [subBoxStyle, setSubBoxStyle] = useState<SubBoxStyle>(config.subBox?.style || 'checklist');
  const [subBoxColor, setSubBoxColor] = useState<SubBoxColor>(config.subBox?.color || 'gray');
  const [subBoxInfoText, setSubBoxInfoText] = useState(config.subBox?.infoText || '');
  const [subBoxItems, setSubBoxItems] = useState<SubBoxItem[]>(config.subBox?.items || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...config,
      title,
      description,
      interactiveType,
      subBox: hasSubBox ? {
        title: subBoxTitle || undefined,
        style: subBoxStyle,
        color: subBoxColor,
        infoText: subBoxStyle === 'info' ? subBoxInfoText : undefined,
        items: subBoxStyle !== 'info' ? subBoxItems : undefined,
      } : undefined,
    });
  };

  const addSubBoxItem = () => {
    setSubBoxItems([...subBoxItems, { text: '', status: 'complete' }]);
  };

  const updateSubBoxItem = (index: number, updates: Partial<SubBoxItem>) => {
    setSubBoxItems(subBoxItems.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const removeSubBoxItem = (index: number) => {
    setSubBoxItems(subBoxItems.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen onClose={onClose} title="Edit Portal Copy" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Status Badge */}
        <div className="flex items-center gap-2 pb-4 border-b">
          <span className="text-sm text-gray-500">Editing copy for:</span>
          {statusConfig && (
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.textColor,
              }}
            >
              {statusConfig.name}
            </span>
          )}
          <span className="text-xs text-gray-400">
            ({config.statusType === 'customer' ? 'Pre-Sale' : 'Post-Sale'})
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

        {/* Sub-Box Section */}
        <div className="border-t pt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Info Box
              </label>
              <p className="text-xs text-gray-400">Additional details shown below the main content</p>
            </div>
            {hasSubBox ? (
              <button
                type="button"
                onClick={() => setHasSubBox(false)}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setHasSubBox(true);
                  if (subBoxItems.length === 0) {
                    setSubBoxItems([{ text: '', status: 'complete' }]);
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Info Box
              </button>
            )}
          </div>

          {hasSubBox && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              {/* Sub-box Style & Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Style</label>
                  <select
                    value={subBoxStyle}
                    onChange={e => setSubBoxStyle(e.target.value as SubBoxStyle)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                  >
                    <option value="checklist">Checklist</option>
                    <option value="numbered">Numbered List</option>
                    <option value="info">Info Text</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                  <select
                    value={subBoxColor}
                    onChange={e => setSubBoxColor(e.target.value as SubBoxColor)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                  >
                    <option value="gray">Gray</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="orange">Orange</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
              </div>

              {/* Sub-box Title */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title (optional)</label>
                <input
                  type="text"
                  value={subBoxTitle}
                  onChange={e => setSubBoxTitle(e.target.value)}
                  placeholder="e.g., What happens next:"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                />
              </div>

              {/* Info Text (for info style) */}
              {subBoxStyle === 'info' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Info Text</label>
                  <textarea
                    value={subBoxInfoText}
                    onChange={e => setSubBoxInfoText(e.target.value)}
                    rows={2}
                    placeholder="Enter the info message..."
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
              )}

              {/* List Items (for checklist/numbered styles) */}
              {(subBoxStyle === 'checklist' || subBoxStyle === 'numbered') && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Items</label>
                  <div className="space-y-2">
                    {subBoxItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-4">{index + 1}.</span>
                        <input
                          type="text"
                          value={item.text}
                          onChange={e => updateSubBoxItem(index, { text: e.target.value })}
                          placeholder="Item text..."
                          className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                        />
                        {subBoxStyle === 'checklist' && (
                          <select
                            value={item.status || 'complete'}
                            onChange={e => updateSubBoxItem(index, { status: e.target.value as 'complete' | 'pending' | 'active' })}
                            className="px-2 py-1.5 text-xs border border-gray-300 rounded-lg"
                          >
                            <option value="complete">✓ Complete</option>
                            <option value="pending">◷ Pending</option>
                          </select>
                        )}
                        <button
                          type="button"
                          onClick={() => removeSubBoxItem(index)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSubBoxItem}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Item
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Live Preview
          </label>
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center max-w-xs mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title || 'Title preview...'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {description || 'Description preview...'}
              </p>

              {/* Date placeholder for reschedule_quote */}
              {interactiveType === 'reschedule_quote' && (
                <div className="bg-gray-50 rounded-lg py-3 px-4 mb-4">
                  <p className="text-base font-bold text-gray-900">[Appointment Date]</p>
                  <p className="text-sm text-blue-600 font-semibold">[Time]</p>
                </div>
              )}

              {/* Sub-box preview */}
              {hasSubBox && (
                <div
                  className={`rounded-lg p-3 mb-4 text-left text-xs ${
                    subBoxColor === 'blue' ? 'bg-blue-50 border border-blue-200' :
                    subBoxColor === 'green' ? 'bg-green-50 border border-green-200' :
                    subBoxColor === 'orange' ? 'bg-orange-50 border border-orange-200' :
                    subBoxColor === 'purple' ? 'bg-purple-50 border border-purple-200' :
                    'bg-gray-50 border border-gray-100'
                  }`}
                >
                  {subBoxTitle && (
                    <p className={`font-medium mb-2 ${
                      subBoxColor === 'blue' ? 'text-blue-800' :
                      subBoxColor === 'green' ? 'text-green-800' :
                      subBoxColor === 'orange' ? 'text-orange-800' :
                      subBoxColor === 'purple' ? 'text-purple-800' :
                      'text-gray-900'
                    }`}>
                      {subBoxTitle}
                    </p>
                  )}
                  {subBoxStyle === 'info' && subBoxInfoText && (
                    <p className={`${
                      subBoxColor === 'blue' ? 'text-blue-700' :
                      subBoxColor === 'green' ? 'text-green-700' :
                      subBoxColor === 'orange' ? 'text-orange-700' :
                      subBoxColor === 'purple' ? 'text-purple-700' :
                      'text-gray-600'
                    }`}>
                      {subBoxInfoText}
                    </p>
                  )}
                  {(subBoxStyle === 'checklist' || subBoxStyle === 'numbered') && subBoxItems.length > 0 && (
                    <ul className="space-y-1">
                      {subBoxItems.filter(item => item.text).map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          {subBoxStyle === 'numbered' ? (
                            <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-semibold">
                              {i + 1}
                            </span>
                          ) : (
                            <span className="flex-shrink-0 mt-0.5">
                              {item.status === 'pending' ? (
                                <svg className="w-4 h-4 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                          )}
                          <span className="text-gray-600">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {interactiveType !== 'none' && statusConfig && (
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    interactiveType === 'reschedule_quote'
                      ? 'bg-gray-100 text-gray-700'
                      : 'text-white'
                  }`}
                  style={interactiveType !== 'reschedule_quote' ? { backgroundColor: statusConfig.textColor } : undefined}
                >
                  {interactiveType === 'calendly_booking' && 'Book Appointment'}
                  {interactiveType === 'proposal_review' && 'Review & Sign'}
                  {interactiveType === 'deposit_payment' && 'Pay Deposit'}
                  {interactiveType === 'document_upload' && 'Upload Documents'}
                  {interactiveType === 'final_payment' && 'Pay Balance'}
                  {interactiveType === 'review_request' && 'Leave a Review'}
                  {interactiveType === 'request_new_quote' && 'Request New Quote'}
                  {interactiveType === 'reschedule_quote' && 'Need to Reschedule?'}
                </button>
              )}
            </div>
          </div>
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
