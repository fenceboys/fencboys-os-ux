export type RequestType = 'build' | 'replace' | 'repair';
export type PreferredContact = 'phone' | 'email' | 'text';

export type CustomerStatus = 'lead' | 'active' | 'complete';

export type ProjectStatus =
  // Pre-Sale
  | 'new_lead'
  | 'quote_scheduled'
  | 'building_proposal'
  | 'proposal_sent'
  | 'awaiting_deposit'
  | 'lost'
  | 'quote_expired'
  // Post-Sale
  | 'permit_preparation'
  | 'customer_docs_needed'
  | 'permit_submitted'
  | 'permit_revision_needed'
  | 'permit_resubmitted'
  | 'ready_to_order_materials'
  | 'materials_ordered'
  | 'scheduling_installation'
  | 'installation_scheduled'
  | 'installation_delayed'
  | 'installation_in_progress'
  | 'scheduling_walkthrough'
  | 'walkthrough_scheduled'
  | 'fixes_needed'
  | 'final_payment_due'
  | 'requesting_review'
  | 'complete';


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
  customerStatus: string;
  salespersonId: string;
  portalLive: boolean;
  autoNotifications: boolean;
  salesAppointment?: string;
  installationDate?: string;
  walkthroughDate?: string;
  createdAt: string;
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
  type: 'status_change' | 'note_added' | 'message_inbound' | 'message_outbound' | 'proposal_sent' | 'proposal_signed' | 'payment_received';
  content: string;
  from?: string;
  createdAt: string;
}

export interface Salesperson {
  id: string;
  name: string;
  email: string;
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
export type ProjectPhase = 'schedule' | 'proposal' | 'permits' | 'materials' | 'scheduling' | 'installation' | 'close_out';

export interface ProjectStatusConfig {
  id: string;
  name: string;
  customerLabel: string;
  phase: ProjectPhase;
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

// Customer Status Config
export interface CustomerStatusConfig {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}
