import { CustomerStatus, ProjectStatus } from '../types';

export interface CustomerStatusInfo {
  id: CustomerStatus;
  label: string;
  color: 'yellow' | 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'gray';
}

export interface ProjectStatusInfo {
  id: ProjectStatus;
  label: string;
  phase: 'pre_sale' | 'post_sale';
  color: 'yellow' | 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'gray';
}

// Customer statuses (simple: Lead, Active, Complete)
export const customerStatuses: CustomerStatusInfo[] = [
  { id: 'lead', label: 'Lead', color: 'blue' },
  { id: 'needs_qualifying', label: 'Needs Qualifying', color: 'yellow' },
  { id: 'unqualified_lead', label: 'Unqualified Lead', color: 'red' },
  { id: 'active', label: 'Active', color: 'green' },
  { id: 'complete', label: 'Complete', color: 'gray' },
];

export const getCustomerStatusInfo = (statusId: CustomerStatus): CustomerStatusInfo | undefined => {
  return customerStatuses.find(s => s.id === statusId);
};

// Project statuses (detailed workflow)
// Colors by category: Sales=yellow, Permits=green, Materials=orange, Scheduling=purple, Installation=blue, CloseOut=gray
export const projectStatuses: ProjectStatusInfo[] = [
  // Sales (yellow)
  { id: 'new_lead', label: 'Schedule Quote', phase: 'pre_sale', color: 'yellow' },
  { id: 'quote_scheduled', label: 'Quote Scheduled', phase: 'pre_sale', color: 'yellow' },
  { id: 'building_proposal', label: 'Building Proposal', phase: 'pre_sale', color: 'yellow' },
  { id: 'proposal_sent', label: 'Proposal Sent', phase: 'pre_sale', color: 'yellow' },
  { id: 'awaiting_deposit', label: 'Awaiting Deposit', phase: 'pre_sale', color: 'yellow' },
  { id: 'lost', label: 'Lost', phase: 'pre_sale', color: 'red' },
  { id: 'quote_expired', label: 'Quote Expired', phase: 'pre_sale', color: 'yellow' },

  // Permits (green)
  { id: 'permit_preparation', label: 'Permit Preparation', phase: 'post_sale', color: 'green' },
  { id: 'customer_docs_needed', label: 'Customer Docs Needed', phase: 'post_sale', color: 'green' },
  { id: 'permit_submitted', label: 'Permit Submitted', phase: 'post_sale', color: 'green' },
  { id: 'permit_revision_needed', label: 'Permit Revision Needed', phase: 'post_sale', color: 'green' },
  { id: 'permit_resubmitted', label: 'Permit Resubmitted', phase: 'post_sale', color: 'green' },

  // Materials (orange)
  { id: 'ready_to_order_materials', label: 'Ready to Order Materials', phase: 'post_sale', color: 'orange' },
  { id: 'materials_ordered', label: 'Materials Ordered', phase: 'post_sale', color: 'orange' },

  // Scheduling (purple)
  { id: 'scheduling_installation', label: 'Scheduling Installation', phase: 'post_sale', color: 'purple' },
  { id: 'installation_scheduled', label: 'Installation Scheduled', phase: 'post_sale', color: 'purple' },
  { id: 'installation_delayed', label: 'Installation Delayed', phase: 'post_sale', color: 'purple' },

  // Installation (blue)
  { id: 'installation_in_progress', label: 'Installation in Progress', phase: 'post_sale', color: 'blue' },
  { id: 'scheduling_walkthrough', label: 'Scheduling Walkthrough', phase: 'post_sale', color: 'blue' },
  { id: 'walkthrough_scheduled', label: 'Walkthrough Scheduled', phase: 'post_sale', color: 'blue' },

  // Close Out (gray)
  { id: 'fixes_needed', label: 'Fixes Needed', phase: 'post_sale', color: 'gray' },
  { id: 'final_payment_due', label: 'Final Payment Due', phase: 'post_sale', color: 'gray' },
  { id: 'requesting_review', label: 'Requesting Review', phase: 'post_sale', color: 'gray' },
  { id: 'complete', label: 'Complete', phase: 'post_sale', color: 'gray' },
];

// Aliases for backward compatibility
export const statuses = projectStatuses;

export const getStatusInfo = (statusId: ProjectStatus): ProjectStatusInfo | undefined => {
  return projectStatuses.find(s => s.id === statusId);
};

export const getStatusesByPhase = (phase: 'pre_sale' | 'post_sale'): ProjectStatusInfo[] => {
  return projectStatuses.filter(s => s.phase === phase);
};

export const preSaleStatuses = getStatusesByPhase('pre_sale');
export const postSaleStatuses = getStatusesByPhase('post_sale');
