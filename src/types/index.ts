export type RequestType = 'build' | 'replace' | 'repair';
export type PreferredContact = 'phone' | 'email' | 'text';

// Customer Status (full customer journey)
// Note: Legacy values (lead, active, won, needs_qualifying, unqualified_lead) kept for backward compatibility
export type CustomerStatus =
  // Pre-sale journey
  | 'new_lead'
  | 'contact_attempted'
  | 'contacted'
  | 'needs_qualifying'
  | 'quote_scheduled'
  | 'building_proposal'
  | 'proposal_sent'
  | 'awaiting_deposit'
  // Post-sale (active customer)
  | 'active_project'
  | 'complete'
  // Terminal states
  | 'quote_expired'
  | 'lost'
  // Legacy values - to be migrated
  | 'lead'
  | 'active'
  | 'won'
  | 'unqualified_lead';

// New types for Phase 1
export type BuildType = 'new_build' | 'replacement' | 'repair';
export type LeadSource = 'unknown' | 'webflow_form' | 'meta_ads' | 'google_lsa' | 'referral' | 'out_of_home' | 'phone' | 'email' | 'text' | 'organic_search';

// Project Status (post-sale journey - after deposit paid)
// Note: Legacy pre-sale values kept for backward compatibility during migration
export type ProjectStatus =
  | 'not_started'           // Placeholder while in pre-sale
  | 'permit_preparation'
  | 'permit_submitted'
  | 'permit_revision_needed'
  | 'permit_resubmitted'
  | 'ready_to_order_materials'
  | 'materials_ordered'
  | 'installation_scheduled'
  | 'installation_delayed'
  | 'installation_in_progress'
  | 'walkthrough_scheduled'
  | 'fixes_needed'
  | 'final_payment_due'
  | 'complete'
  // Legacy pre-sale values - to be migrated to CustomerStatus
  | 'new_lead'
  | 'quote_scheduled'
  | 'building_proposal'
  | 'proposal_sent'
  | 'awaiting_deposit'
  | 'lost'
  | 'quote_expired'
  | 'customer_docs_needed'
  | 'scheduling_installation'
  | 'scheduling_walkthrough'
  | 'requesting_review';


export type Phase = 'pre_sale' | 'post_sale';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  requestType: RequestType;
  preferredContact: PreferredContact;
  status: CustomerStatus;
  statusChangedAt?: string;
  tags: string[];
  salespersonId: string;
  notes: string;
  createdAt: string;
}

export interface Project {
  id: string;
  customerId: string;
  name: string;
  address: string;
  status: ProjectStatus;
  /**
   * @deprecated This field uses display strings (e.g., 'New Lead') instead of CustomerStatus values.
   * TODO: Migrate to use Customer.status directly or convert to CustomerStatus type.
   * Currently contains arbitrary strings like 'Processing', 'Complete', 'New Lead', etc.
   */
  customerStatus: string;
  salespersonId: string;
  portalLive: boolean;
  autoNotifications: boolean;
  salesAppointment?: string;
  installationDate?: string;
  walkthroughDate?: string;
  createdAt: string;
  // New Phase 1 fields
  buildType?: BuildType;
  leadSource?: LeadSource;
  lastContacted?: string;
  statusChangedAt?: string; // Used to calculate daysInStatus
  // Portal-specific fields
  customerSignature?: string;
  signatureDate?: string;
  depositAmount?: number;
  depositPaid?: boolean;
  finalPaymentAmount?: number;
  finalPaymentPaid?: boolean;
  documentationNeededDescription?: string;
}

export interface SignatureField {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProposalAttachment {
  id: string;
  name: string;
  dataUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  name: string;
  total: number;
  depositAmount?: number;
  pdfData?: string;
  pdfFileName?: string;
  signatureField?: SignatureField;
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected';
  isManual?: boolean; // True for handwritten/scanned proposals
  attachments?: ProposalAttachment[]; // Additional documents appended to proposal
  createdAt: string;
}

export interface Drawing {
  id: string;
  projectId?: string;
  name: string;
  preview: string;
  createdAt: string;
}

export interface Pricing {
  id: string;
  projectId?: string;
  name: string;
  fenceType: string;
  total: number;
  createdAt: string;
}

export interface Note {
  id: string;
  projectId: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  projectId: string;
  type: 'status_change' | 'note_added' | 'message_inbound' | 'message_outbound' | 'proposal_sent' | 'proposal_signed' | 'payment_received' | 'call_recording' | 'voicemail' | 'text_inbound' | 'text_outbound' | 'email_inbound' | 'email_outbound';
  content: string;
  from?: string;
  duration?: number; // For calls/voicemails in seconds
  createdAt: string;
}

export interface Salesperson {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface StatusInfo {
  id: CustomerStatus;
  label: string;
  phase: Phase;
  color: 'yellow' | 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'gray';
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  name: string;
  url: string;
  type: 'proposal' | 'drawing' | 'pricing' | 'permit' | 'customer_upload';
  showInPortal: boolean;
  uploadedAt: string;
}

// Project Specs
export interface ProjectSpecs {
  id: string;
  projectId: string;
  fenceType: string;
  fenceStyle: string;
  fenceHeight: string;
  estimatedLinearFeet: number | null;
  requirements: {
    permit: boolean;
    hoa: boolean;
    fenceRemoval: boolean;
    haulAway: boolean;
  };
  terrainHandling: 'followGrade' | 'stepAndLevel' | 'keepTopStraight' | '';
  undergroundUtilities: {
    irrigation: boolean;
    electricDogFence: boolean;
    other: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Photo
export interface Photo {
  id: string;
  projectId: string;
  dataUrl: string;
  filename: string;
  name: string;
  caption?: string;
  tags: string[];
  inPortal: boolean;
  uploadedBy: string;
  createdAt: string;
}

// Document
export interface Document {
  id: string;
  projectId: string;
  name: string;
  category: 'proposal' | 'contract' | 'permit' | 'hoa' | 'invoice' | 'other';
  fileType: 'pdf' | 'image' | 'doc';
  dataUrl: string;
  fileSize: number;
  inPortal: boolean;
  uploadSource: 'team' | 'customer';
  createdAt: string;
}

// Communication
export interface Communication {
  id: string;
  projectId: string;
  type: 'email' | 'sms';
  direction: 'inbound' | 'outbound';
  recipientName: string;
  recipientContact: string;
  subject?: string;
  preview: string;
  fullBody: string;
  status: 'delivered' | 'sent' | 'failed';
  via?: string;
  createdAt: string;
}

// Payment
export interface Payment {
  id: string;
  projectId: string;
  type: 'deposit' | 'final' | 'partial' | 'refund';
  amount: number;
  status: 'awaiting' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'card' | 'check' | 'cash' | 'ach';
  paymentDate?: string;
  invoiceUrl?: string;
  notes?: string;
  createdAt: string;
}

// User (replaces/extends Salesperson for admin management)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: ('admin' | 'salesperson')[];
  status: 'active' | 'inactive';
  joinedAt: string;
  integrations: {
    google: { connected: boolean; email?: string };
    calendly: { connected: boolean; url?: string };
    quo: { lineId?: string; lineType?: 'main' | 'direct' };
  };
}

// Project Status Config (admin-manageable)
export type ProjectPhase = 'permits' | 'materials' | 'scheduling' | 'installation' | 'close_out';

// Status Trigger - how a status change is initiated
export type StatusTrigger =
  | 'manual'              // Staff manually changes status
  | 'calendly_scheduled'  // Customer books via Calendly in portal
  | 'portal_signed'       // Customer signs document in portal
  | 'deposit_paid'        // Deposit payment received
  | 'final_payment_paid'; // Final balance payment received

export interface ProjectStatusConfig {
  id: string;
  name: string;
  customerLabel: string;
  phase: ProjectPhase;
  trigger?: StatusTrigger;  // How this status is triggered (default: manual)
  triggerNote: string;
  sortOrder: number;
  bgColor: string;   // hex e.g. "#dbeafe"
  textColor: string; // hex e.g. "#1d4ed8"
  isActive: boolean;
  notifications: {
    slack: { enabled: boolean; channel: string };
    sms: { enabled: boolean; template: string };
    email: { enabled: boolean; subject: string; body: string };
  };
  // Portal copy - configurable text shown to customer for this status
  portalCopy?: {
    title?: string;
    description?: string;
    additionalInfo?: string;
  };
}

// Proposal Tag
export interface ProposalTag {
  id: string;
  category: 'material' | 'height' | 'style';
  name: string;
  sortOrder: number;
  isActive: boolean;
}

// Photo Category
export interface PhotoCategory {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

// Document Category
export interface DocumentCategory {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

// Customer Status Config (pre-sale lead journey)
export interface CustomerStatusConfig {
  id: string;
  name: string;
  customerLabel: string;  // What customer sees in portal
  trigger?: StatusTrigger; // How this status is triggered (default: manual)
  triggerNote: string;    // Description of when this status is used
  sortOrder: number;
  bgColor: string;        // hex e.g. "#dbeafe"
  textColor: string;      // hex e.g. "#1d4ed8"
  isActive: boolean;
  hasPortalPage: boolean; // Whether this status has a customer-facing portal page
  notifications: {
    slack: { enabled: boolean; channel: string };
    sms: { enabled: boolean; template: string };
    email: { enabled: boolean; subject: string; body: string };
  };
}

// Request Type Config
export interface RequestTypeConfig {
  id: string;
  name: string;
  value: RequestType;
  description?: string;
  bgColor?: string;
  textColor?: string;
  sortOrder: number;
  isActive: boolean;
}

// View Configuration for Dashboard tabs (Phase 10)
export interface ViewColumnConfig {
  id: string;
  field: string;
  label: string;
  visible: boolean;
  sortOrder: number;
  width?: string;
}

export interface ViewFilterConfig {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
  value: string | string[] | number;
}

export interface ViewConfig {
  id: string;
  name: string;
  viewType: 'sales_dashboard' | 'admin_dashboard' | 'customers' | 'project_tracking_presale' | 'project_tracking_postsale';
  tabId: string;
  columns: ViewColumnConfig[];
  filters: ViewFilterConfig[];
  defaultSort?: { field: string; direction: 'asc' | 'desc' };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
