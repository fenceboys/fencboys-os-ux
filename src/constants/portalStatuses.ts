import { CustomerStatus, ProjectStatus } from '../types';
import { isPreSale } from './statuses';

export interface PortalStatusContent {
  title: string;
  description: string;
  isInteractive?: boolean;
  interactiveType?: 'calendly_booking' | 'proposal_review' | 'deposit_payment' | 'document_upload' | 'final_payment' | 'review_request';
}

// Get portal content based on customer status (pre-sale)
export const getCustomerStatusPortalContent = (
  status: CustomerStatus,
  salespersonName?: string,
  appointmentDate?: string
): PortalStatusContent => {
  const formatDate = (date?: string) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  switch (status) {
    case 'new_lead':
      return {
        title: 'Schedule Your Free Consultation',
        description: `Book your on-site fence consultation below. ${salespersonName ? `${salespersonName} will visit your property to discuss your project and provide a free quote.` : 'We\'ll visit your property to discuss your project and provide a free quote.'}`,
        isInteractive: true,
        interactiveType: 'calendly_booking',
      };

    case 'contact_attempted':
      return {
        title: 'We\'re Trying to Reach You',
        description: `We've tried to contact you about your fence project. Please call us back or schedule a time below.`,
        isInteractive: true,
        interactiveType: 'calendly_booking',
      };

    case 'contacted':
      return {
        title: 'Schedule Your Free Consultation',
        description: `Great chatting with you! Book your on-site fence consultation below.`,
        isInteractive: true,
        interactiveType: 'calendly_booking',
      };

    case 'repair_scheduled':
      return {
        title: 'Repair Visit Scheduled',
        description: `Your repair visit is scheduled for ${formatDate(appointmentDate)}. ${salespersonName || 'Our team'} will assess the repair and discuss your options.`,
      };

    case 'quote_scheduled':
      return {
        title: 'Quote Visit Scheduled',
        description: `Your quote visit is scheduled for ${formatDate(appointmentDate)}. ${salespersonName || 'Your sales representative'} will visit your property to assess the project and discuss your options.`,
      };

    case 'building_proposal':
      return {
        title: 'Building Your Proposal',
        description: `We're putting together your custom fence quote based on our site visit. You'll receive it soon!`,
      };

    case 'proposal_sent':
      return {
        title: 'Your Proposal is Ready!',
        description: 'Review your custom fence proposal below. Once you\'re happy with everything, sign to get your project started.',
        isInteractive: true,
        interactiveType: 'proposal_review',
      };

    case 'awaiting_deposit':
      return {
        title: 'Contract Signed!',
        description: 'Great news! Your contract has been signed. Pay your deposit to officially start your project.',
        isInteractive: true,
        interactiveType: 'deposit_payment',
      };

    case 'won':
      return {
        title: 'Welcome to the Fence Boys Family!',
        description: 'Your project is officially underway. Check back here for updates on permits, materials, and installation.',
      };

    case 'lost':
      return {
        title: 'Project Closed',
        description: 'This project has been closed. If you\'d like to restart your fence project, please contact us.',
      };

    default:
      return {
        title: 'Project in Progress',
        description: 'Your project is currently being processed. Check back for updates.',
      };
  }
};

// Get portal content based on project status (post-sale)
export const getProjectStatusPortalContent = (
  status: ProjectStatus,
  installationDate?: string,
  walkthroughDate?: string
): PortalStatusContent => {
  const formatDate = (date?: string) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  switch (status) {
    case 'not_started':
      return {
        title: 'Getting Started',
        description: 'Your project is being set up. We\'ll update you when we begin the permit process.',
      };

    case 'permit_preparation':
      return {
        title: 'Preparing Your Permit',
        description: 'We\'re preparing all the necessary documents to submit your permit application to the city.',
      };

    case 'permit_submitted':
      return {
        title: 'Permit Submitted',
        description: 'Your permit has been submitted to the city for approval. This typically takes 1-3 weeks depending on your municipality.',
      };

    case 'permit_revision_needed':
      return {
        title: 'Permit Revision Required',
        description: 'The city has requested some revisions to your permit application. Our team is working on the updates.',
      };

    case 'permit_resubmitted':
      return {
        title: 'Permit Resubmitted',
        description: 'We\'ve made the requested changes and resubmitted your permit. Waiting for final approval.',
      };

    case 'ready_to_order_materials':
      return {
        title: 'Permit Approved!',
        description: 'Great news! Your permit has been approved. We\'re preparing to order your fence materials.',
      };

    case 'materials_ordered':
      return {
        title: 'Materials Ordered',
        description: 'Your fence materials have been ordered and are on the way. We\'ll be in touch once they arrive to schedule your installation.',
      };

    case 'installation_scheduled':
      return {
        title: 'Installation Scheduled!',
        description: `Your fence installation is scheduled for ${formatDate(installationDate)}. Our crew will arrive in the morning to get started.`,
      };

    case 'installation_delayed':
      return {
        title: 'Installation Delayed',
        description: 'Unfortunately, your installation has been delayed. We\'ll contact you to reschedule as soon as possible.',
      };

    case 'installation_in_progress':
      return {
        title: 'Installation in Progress',
        description: 'Your fence is being built! Our crew is working hard to complete your installation.',
      };

    case 'walkthrough_scheduled':
      return {
        title: 'Walkthrough Scheduled',
        description: 'Your final walkthrough has been scheduled. We\'ll review the installation together and address any concerns.',
      };

    case 'fixes_needed':
      return {
        title: 'Addressing Concerns',
        description: 'We\'re working on the items identified during your walkthrough. We\'ll reach out once everything is complete.',
      };

    case 'final_payment_due':
      return {
        title: 'Final Payment Due',
        description: 'Your fence project is complete! Please submit your final payment to close out the project.',
        isInteractive: true,
        interactiveType: 'final_payment',
      };

    case 'complete':
      return {
        title: 'Project Complete!',
        description: 'Thank you for choosing Fence Boys! Your fence project is complete. Enjoy your new fence!',
      };

    default:
      return {
        title: 'Project in Progress',
        description: 'Your project is currently being processed. Check back for updates.',
      };
  }
};

// Legacy/backward-compatible portal content getter - uses ProjectStatus
// This maintains compatibility with existing code that passes project.status
export const getPortalStatusContent = (
  status: ProjectStatus,
  salespersonName?: string,
  appointmentDate?: string,
  installationDate?: string
): PortalStatusContent => {
  const formatDate = (date?: string) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle pre-sale statuses (legacy - these will move to CustomerStatus)
  switch (status) {
    case 'new_lead':
      return {
        title: 'Schedule Your Free Consultation',
        description: `Book your on-site fence consultation below. ${salespersonName ? `${salespersonName} will visit your property to discuss your project and provide a free quote.` : 'We\'ll visit your property to discuss your project and provide a free quote.'}`,
        isInteractive: true,
        interactiveType: 'calendly_booking',
      };

    case 'quote_scheduled':
      return {
        title: 'Quote Visit Scheduled',
        description: `Your quote visit is scheduled for ${formatDate(appointmentDate)}. ${salespersonName || 'Your sales representative'} will visit your property to assess the project and discuss your options.`,
      };

    case 'building_proposal':
      return {
        title: 'Building Your Proposal',
        description: `We're putting together your custom fence quote based on our site visit. You'll receive it soon!`,
      };

    case 'proposal_sent':
      return {
        title: 'Your Proposal is Ready!',
        description: 'Review your custom fence proposal below. Once you\'re happy with everything, sign to get your project started.',
        isInteractive: true,
        interactiveType: 'proposal_review',
      };

    case 'awaiting_deposit':
      return {
        title: 'Contract Signed!',
        description: 'Great news! Your contract has been signed. Pay your deposit to officially start your project.',
        isInteractive: true,
        interactiveType: 'deposit_payment',
      };

    case 'lost':
      return {
        title: 'Project Closed',
        description: 'This project has been closed. If you\'d like to restart your fence project, please contact us.',
      };

    case 'quote_expired':
      return {
        title: 'Quote Expired',
        description: 'Your quote has expired. Please contact us if you\'d like to get a new quote for your fence project.',
      };

    default:
      // Fall through to project status content
      return getProjectStatusPortalContent(status, installationDate);
  }
};

// New unified portal content getter - checks customer status first, then project status
// Use this for new code that has access to both customer and project status
export const getUnifiedPortalContent = (
  customerStatus: CustomerStatus,
  projectStatus: ProjectStatus,
  salespersonName?: string,
  appointmentDate?: string,
  installationDate?: string,
  walkthroughDate?: string
): PortalStatusContent => {
  // If customer is in pre-sale (not won yet), use customer status
  if (isPreSale(customerStatus)) {
    return getCustomerStatusPortalContent(customerStatus, salespersonName, appointmentDate);
  }

  // If customer is won (active), use project status
  return getProjectStatusPortalContent(projectStatus, installationDate, walkthroughDate);
};
