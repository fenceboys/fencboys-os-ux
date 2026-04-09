import { CustomerStatus, ProjectStatus } from '../types';

export interface CustomerStatusInfo {
  id: CustomerStatus;
  label: string;
  color: 'yellow' | 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'gray';
  sortOrder: number;
}

export interface ProjectStatusInfo {
  id: ProjectStatus;
  label: string;
  phase: 'pre_sale' | 'post_sale';
  color: 'yellow' | 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'gray';
  sortOrder: number;
}

// Customer statuses (full customer journey)
export const customerStatuses: CustomerStatusInfo[] = [
  // Pre-sale
  { id: 'new_lead', label: 'New Lead', color: 'gray', sortOrder: 1 },
  { id: 'contact_attempted', label: 'Contact Attempted', color: 'yellow', sortOrder: 2 },
  { id: 'contacted', label: 'Contacted', color: 'blue', sortOrder: 3 },
  { id: 'needs_qualifying', label: 'Needs Qualifying', color: 'orange', sortOrder: 4 },
  { id: 'quote_scheduled', label: 'Quote Scheduled', color: 'purple', sortOrder: 5 },
  { id: 'building_proposal', label: 'Building Proposal', color: 'yellow', sortOrder: 6 },
  { id: 'proposal_sent', label: 'Proposal Sent', color: 'green', sortOrder: 7 },
  { id: 'awaiting_deposit', label: 'Awaiting Deposit', color: 'green', sortOrder: 8 },
  // Post-sale (active customer)
  { id: 'active_project', label: 'Active Project', color: 'green', sortOrder: 9 },
  { id: 'complete', label: 'Complete', color: 'green', sortOrder: 10 },
  // Terminal states
  { id: 'quote_expired', label: 'Quote Expired', color: 'red', sortOrder: 11 },
  { id: 'lost', label: 'Lost', color: 'red', sortOrder: 12 },
  // Legacy statuses for backward compatibility
  { id: 'lead', label: 'Lead', color: 'blue', sortOrder: 100 },
  { id: 'won', label: 'Won', color: 'green', sortOrder: 101 },
  { id: 'unqualified_lead', label: 'Unqualified Lead', color: 'red', sortOrder: 102 },
  { id: 'active', label: 'Active', color: 'green', sortOrder: 103 },
];

export const getCustomerStatusInfo = (statusId: CustomerStatus): CustomerStatusInfo | undefined => {
  return customerStatuses.find(s => s.id === statusId);
};

// Project statuses (Post-Sale only - projects begin after sale is won)
export const projectStatuses: ProjectStatusInfo[] = [
  { id: 'not_started', label: 'Not Started', phase: 'post_sale', color: 'gray', sortOrder: 1 },
  { id: 'permit_preparation', label: 'Permit Preparation', phase: 'post_sale', color: 'green', sortOrder: 2 },
  { id: 'customer_docs_needed', label: 'Customer Docs Needed', phase: 'post_sale', color: 'orange', sortOrder: 3 },
  { id: 'permit_submitted', label: 'Permit Submitted', phase: 'post_sale', color: 'green', sortOrder: 4 },
  { id: 'permit_revision_needed', label: 'Permit Revision Needed', phase: 'post_sale', color: 'orange', sortOrder: 5 },
  { id: 'permit_resubmitted', label: 'Permit Resubmitted', phase: 'post_sale', color: 'green', sortOrder: 6 },
  { id: 'ready_to_order_materials', label: 'Ready to Order Materials', phase: 'post_sale', color: 'orange', sortOrder: 7 },
  { id: 'materials_ordered', label: 'Materials Ordered', phase: 'post_sale', color: 'orange', sortOrder: 8 },
  { id: 'scheduling_installation', label: 'Scheduling Installation', phase: 'post_sale', color: 'purple', sortOrder: 9 },
  { id: 'installation_scheduled', label: 'Installation Scheduled', phase: 'post_sale', color: 'purple', sortOrder: 10 },
  { id: 'installation_delayed', label: 'Installation Delayed', phase: 'post_sale', color: 'red', sortOrder: 11 },
  { id: 'installation_in_progress', label: 'Installation In Progress', phase: 'post_sale', color: 'blue', sortOrder: 12 },
  { id: 'scheduling_walkthrough', label: 'Scheduling Walkthrough', phase: 'post_sale', color: 'blue', sortOrder: 13 },
  { id: 'walkthrough_scheduled', label: 'Walkthrough Scheduled', phase: 'post_sale', color: 'blue', sortOrder: 14 },
  { id: 'fixes_needed', label: 'Fixes Needed', phase: 'post_sale', color: 'orange', sortOrder: 15 },
  { id: 'final_payment_due', label: 'Final Payment Due', phase: 'post_sale', color: 'yellow', sortOrder: 16 },
  { id: 'requesting_review', label: 'Requesting Review', phase: 'post_sale', color: 'gray', sortOrder: 17 },
  { id: 'complete', label: 'Complete', phase: 'post_sale', color: 'green', sortOrder: 18 },
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

// Helper to check if customer is in pre-sale (not yet active_project)
export const isPreSale = (customerStatus: CustomerStatus): boolean => {
  return customerStatus !== 'active_project' && customerStatus !== 'complete' &&
         customerStatus !== 'lost' && customerStatus !== 'quote_expired' &&
         // Legacy values
         customerStatus !== 'won' && customerStatus !== 'active';
};

// Helper to check if customer is active (has active project)
export const isActive = (customerStatus: CustomerStatus): boolean => {
  return customerStatus === 'active_project' || customerStatus === 'won' || customerStatus === 'active';
};

// Helper to check if customer has completed their project(s)
export const isComplete = (customerStatus: CustomerStatus): boolean => {
  return customerStatus === 'complete';
};
