import { Customer, Project, Proposal, Drawing, Pricing, Note, Activity, Salesperson, ProjectSpecs, Photo, Document, Communication, Payment, User, ProjectStatusConfig, ProposalTag, PhotoCategory, DocumentCategory, CustomerStatusConfig, RequestTypeConfig, BuildType, LeadSource } from '../types';

export const salespeople: Salesperson[] = [
  { id: 'sp1', name: 'Cody McCraw', email: 'cody@fenceboys.com', phone: '(380) 234-5678' },
  { id: 'sp2', name: 'Cam Gribbons', email: 'cam@fenceboys.com', phone: '(614) 412-4281' },
  { id: 'sp3', name: 'Jake Turner', email: 'jake@fenceboys.com', phone: '(380) 345-6789' },
];

export const initialCustomers: Customer[] = [
  // === MASTER DEMO - Cameron Gribbons (Complete End-to-End Example) ===
  {
    id: 'cust_demo',
    name: 'Cameron Gribbons',
    phone: '(614) 555-9999',
    email: 'cameron@demo.com',
    address: '1234 Demo Street',
    city: 'Columbus',
    state: 'OH',
    zip: '43215',
    requestType: 'build',
    preferredContact: 'text',
    status: 'active',
    tags: ['6ft Cedar Privacy', 'Cap & Trim', 'Double Gate', '4ft Aluminum Pool'],
    salespersonId: 'sp2',
    notes: 'Master demo customer - shows complete end-to-end workflow with multiple projects',
    createdAt: '2025-11-01T10:00:00Z',
  },
  // === SALES PHASE ===
  // 1. New Lead
  {
    id: 'cust1',
    name: 'Marcus Rivera',
    phone: '(614) 555-0101',
    email: 'marcus.rivera@gmail.com',
    address: '3421 Sullivant Ave',
    city: 'Columbus',
    state: 'OH',
    zip: '43204',
    requestType: 'build',
    preferredContact: 'text',
    status: 'lead',
    tags: ['6ft Cedar Privacy'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2026-03-28T10:00:00Z',
  },
  // 2-5. Quote Scheduled (multiple)
  {
    id: 'cust2',
    name: 'Sarah & Tom Mitchell',
    phone: '(614) 555-0102',
    email: 's.mitchell42@gmail.com',
    address: '1847 Bryden Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43205',
    requestType: 'replace',
    preferredContact: 'email',
    status: 'lead',
    tags: ['6ft PT Privacy'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2026-03-24T10:00:00Z',
  },
  {
    id: 'cust3',
    name: 'David Chen',
    phone: '(614) 555-0103',
    email: 'dchen88@outlook.com',
    address: '5590 Riverside Dr',
    city: 'Columbus',
    state: 'OH',
    zip: '43221',
    requestType: 'build',
    preferredContact: 'phone',
    status: 'lead',
    tags: ['4ft Aluminum'],
    salespersonId: 'sp2',
    notes: '',
    createdAt: '2026-03-23T10:00:00Z',
  },
  {
    id: 'cust4',
    name: 'Jennifer Lopez',
    phone: '(614) 555-0104',
    email: 'jlopez.columbus@gmail.com',
    address: '892 Oakland Park Ave',
    city: 'Columbus',
    state: 'OH',
    zip: '43224',
    requestType: 'build',
    preferredContact: 'text',
    status: 'lead',
    tags: ['6ft Cedar Privacy'],
    salespersonId: 'sp3',
    notes: '',
    createdAt: '2026-03-22T10:00:00Z',
  },
  // 6. Building Proposal
  {
    id: 'cust5',
    name: 'Jessica & Brian Howard',
    phone: '(614) 555-0105',
    email: 'jhoward.columbus@gmail.com',
    address: '2234 Fairwood Ave',
    city: 'Columbus',
    state: 'OH',
    zip: '43207',
    requestType: 'replace',
    preferredContact: 'text',
    status: 'lead',
    tags: ['6ft Cedar Privacy'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2026-03-15T10:00:00Z',
  },
  // 7. Proposal Sent
  {
    id: 'cust6',
    name: 'Angela Washington',
    phone: '(614) 555-0106',
    email: 'a.washington@yahoo.com',
    address: '789 S Champion Ave',
    city: 'Columbus',
    state: 'OH',
    zip: '43206',
    requestType: 'build',
    preferredContact: 'email',
    status: 'lead',
    tags: ['6ft Cap & Trim Cedar'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2026-03-10T10:00:00Z',
  },
  // 8. Awaiting Deposit
  {
    id: 'cust7',
    name: 'Kevin Patel',
    phone: '(614) 555-0107',
    email: 'kpatel.home@gmail.com',
    address: '4412 Kenny Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43220',
    requestType: 'build',
    preferredContact: 'text',
    status: 'lead',
    tags: ['Vinyl Privacy'],
    salespersonId: 'sp2',
    notes: '',
    createdAt: '2026-03-05T10:00:00Z',
  },
  // 9. Lost
  {
    id: 'cust8',
    name: 'Robert Foster',
    phone: '(614) 555-0108',
    email: 'rfoster614@aol.com',
    address: '1123 E Broad St',
    city: 'Columbus',
    state: 'OH',
    zip: '43205',
    requestType: 'replace',
    preferredContact: 'phone',
    status: 'unqualified_lead',
    tags: ['6ft PT Privacy'],
    salespersonId: 'sp1',
    notes: 'Went with competitor - price',
    createdAt: '2026-02-10T10:00:00Z',
  },
  // 10. Quote Expired
  {
    id: 'cust9',
    name: 'Linda Thompson',
    phone: '(614) 555-0109',
    email: 'lthompson@gmail.com',
    address: '3456 Morse Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43231',
    requestType: 'build',
    preferredContact: 'email',
    status: 'lead',
    tags: ['4ft Aluminum'],
    salespersonId: 'sp3',
    notes: '',
    createdAt: '2026-01-15T10:00:00Z',
  },
  // === PERMITS PHASE ===
  // 11. Permit Preparation
  {
    id: 'cust10',
    name: 'Natalie Brooks',
    phone: '(614) 555-0110',
    email: 'nat.brooks@gmail.com',
    address: '3367 Indianola Ave',
    city: 'Columbus',
    state: 'OH',
    zip: '43214',
    requestType: 'build',
    preferredContact: 'text',
    status: 'active',
    tags: ['6ft Cedar Privacy'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2026-03-01T10:00:00Z',
  },
  // 12. Customer Docs Needed
  {
    id: 'cust11',
    name: 'James Kowalski',
    phone: '(614) 555-0111',
    email: 'jpkowalski@hotmail.com',
    address: '6278 Olentangy River Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43235',
    requestType: 'replace',
    preferredContact: 'email',
    status: 'active',
    tags: ['4ft Spaced Cedar Picket'],
    salespersonId: 'sp2',
    notes: 'Waiting on HOA approval documentation',
    createdAt: '2026-02-25T10:00:00Z',
  },
  // 13. Permit Submitted
  {
    id: 'cust12',
    name: 'Tamara Williams',
    phone: '(614) 555-0112',
    email: 'twill.columbus@gmail.com',
    address: '901 S High St',
    city: 'Columbus',
    state: 'OH',
    zip: '43206',
    requestType: 'build',
    preferredContact: 'text',
    status: 'active',
    tags: ['6ft Cedar Privacy'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2026-02-20T10:00:00Z',
  },
  // 14. Permit Revision Needed
  {
    id: 'cust13',
    name: 'Eric Nguyen',
    phone: '(614) 555-0113',
    email: 'ericnguyen614@gmail.com',
    address: '4520 Karl Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43224',
    requestType: 'build',
    preferredContact: 'phone',
    status: 'active',
    tags: ['6ft PT Privacy'],
    salespersonId: 'sp3',
    notes: 'City needs updated site plan',
    createdAt: '2026-02-15T10:00:00Z',
  },
  // 15. Permit Resubmitted
  {
    id: 'cust14',
    name: 'Michelle Garcia',
    phone: '(614) 555-0114',
    email: 'mgarcia.ohio@gmail.com',
    address: '2890 N High St',
    city: 'Columbus',
    state: 'OH',
    zip: '43202',
    requestType: 'build',
    preferredContact: 'text',
    status: 'active',
    tags: ['6ft Cedar Privacy'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2026-02-10T10:00:00Z',
  },
  // === MATERIALS PHASE ===
  // 16. Ready to Order Materials
  {
    id: 'cust15',
    name: 'Christopher Brown',
    phone: '(614) 555-0115',
    email: 'cbrown.cbus@outlook.com',
    address: '1567 Westerville Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43224',
    requestType: 'replace',
    preferredContact: 'email',
    status: 'active',
    tags: ['6ft PT Privacy'],
    salespersonId: 'sp2',
    notes: '',
    createdAt: '2026-02-05T10:00:00Z',
  },
  // 17. Materials Ordered
  {
    id: 'cust16',
    name: 'Amanda & Derek Wilson',
    phone: '(614) 555-0116',
    email: 'wilsonfamily614@gmail.com',
    address: '4892 Sawmill Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43235',
    requestType: 'build',
    preferredContact: 'text',
    status: 'active',
    tags: ['6ft Cedar Privacy'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2026-02-01T10:00:00Z',
  },
  // === SCHEDULING PHASE ===
  // 18. Scheduling Installation
  {
    id: 'cust17',
    name: 'Rachel Adams',
    phone: '(614) 555-0117',
    email: 'radams.columbus@gmail.com',
    address: '3234 Agler Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43219',
    requestType: 'build',
    preferredContact: 'phone',
    status: 'active',
    tags: ['4ft Aluminum'],
    salespersonId: 'sp3',
    notes: '',
    createdAt: '2026-01-28T10:00:00Z',
  },
  // 19. Installation Scheduled
  {
    id: 'cust18',
    name: 'Daniel Martinez',
    phone: '(614) 555-0118',
    email: 'dmartinez614@yahoo.com',
    address: '7821 Refugee Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43232',
    requestType: 'replace',
    preferredContact: 'text',
    status: 'active',
    tags: ['6ft PT Privacy'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2026-01-25T10:00:00Z',
  },
  // 20. Installation Delayed
  {
    id: 'cust19',
    name: 'Stephanie Clark',
    phone: '(614) 555-0119',
    email: 'sclark.ohio@gmail.com',
    address: '5678 Georgesville Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43228',
    requestType: 'build',
    preferredContact: 'email',
    status: 'active',
    tags: ['6ft Cedar Privacy'],
    salespersonId: 'sp2',
    notes: 'Weather delay',
    createdAt: '2026-01-20T10:00:00Z',
  },
  // === INSTALLATION PHASE ===
  // 21. Installation In Progress
  {
    id: 'cust20',
    name: 'Andrew & Lisa Taylor',
    phone: '(614) 555-0120',
    email: 'taylorfam.cbus@gmail.com',
    address: '9012 Hamilton Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43219',
    requestType: 'build',
    preferredContact: 'text',
    status: 'active',
    tags: ['6ft Cap & Trim Cedar'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2026-01-15T10:00:00Z',
  },
  // 22. Scheduling Walkthrough
  {
    id: 'cust21',
    name: 'Megan Scott',
    phone: '(614) 555-0121',
    email: 'mscott614@outlook.com',
    address: '2345 Parsons Ave',
    city: 'Columbus',
    state: 'OH',
    zip: '43207',
    requestType: 'replace',
    preferredContact: 'phone',
    status: 'active',
    tags: ['6ft PT Privacy'],
    salespersonId: 'sp3',
    notes: '',
    createdAt: '2026-01-10T10:00:00Z',
  },
  // 23. Walkthrough Scheduled
  {
    id: 'cust22',
    name: 'Jason & Emily White',
    phone: '(614) 555-0122',
    email: 'whitefamily.ohio@gmail.com',
    address: '6789 Cleveland Ave',
    city: 'Columbus',
    state: 'OH',
    zip: '43231',
    requestType: 'build',
    preferredContact: 'text',
    status: 'active',
    tags: ['6ft Cedar Privacy'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2026-01-05T10:00:00Z',
  },
  // === CLOSE OUT PHASE ===
  // 24. Fixes Needed
  {
    id: 'cust23',
    name: 'Brandon Lee',
    phone: '(614) 555-0123',
    email: 'blee.columbus@gmail.com',
    address: '4321 Livingston Ave',
    city: 'Columbus',
    state: 'OH',
    zip: '43227',
    requestType: 'build',
    preferredContact: 'email',
    status: 'active',
    tags: ['6ft PT Privacy'],
    salespersonId: 'sp2',
    notes: 'Gate latch adjustment needed',
    createdAt: '2025-12-28T10:00:00Z',
  },
  // 25. Final Payment Due
  {
    id: 'cust24',
    name: 'Nicole & Ryan Harris',
    phone: '(614) 555-0124',
    email: 'harrisfam614@yahoo.com',
    address: '8765 Sunbury Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43230',
    requestType: 'replace',
    preferredContact: 'text',
    status: 'active',
    tags: ['6ft Cedar Privacy'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2025-12-20T10:00:00Z',
  },
  // 26. Requesting Review
  {
    id: 'cust25',
    name: 'Tyler Robinson',
    phone: '(614) 555-0125',
    email: 'trobinson.cbus@gmail.com',
    address: '1234 Dublin Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43215',
    requestType: 'build',
    preferredContact: 'phone',
    status: 'active',
    tags: ['4ft Aluminum'],
    salespersonId: 'sp3',
    notes: '',
    createdAt: '2025-12-15T10:00:00Z',
  },
  // 27. Complete
  {
    id: 'cust26',
    name: 'Heather & Mark Johnson',
    phone: '(614) 555-0126',
    email: 'johnsonfamily614@gmail.com',
    address: '5432 Bethel Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43220',
    requestType: 'build',
    preferredContact: 'email',
    status: 'complete',
    tags: ['6ft Cedar Privacy'],
    salespersonId: 'sp1',
    notes: '',
    createdAt: '2025-12-01T10:00:00Z',
  },
];

export const initialProjects: Project[] = [
  // === MASTER DEMO - Cameron Gribbons Project (Complete) ===
  {
    id: 'proj_demo',
    customerId: 'cust_demo',
    name: 'Gribbons Fence - Demo',
    address: '1234 Demo Street, Columbus, OH 43215',
    status: 'complete',
    customerStatus: 'Complete',
    salespersonId: 'sp2',
    portalLive: false,
    autoNotifications: false,
    salesAppointment: '2025-11-05T14:00:00Z',
    depositAmount: 4500,
    depositPaid: true,
    installationDate: '2025-12-10T08:00:00Z',
    walkthroughDate: '2025-12-12T10:00:00Z',
    finalPaymentAmount: 4500,
    finalPaymentPaid: true,
    buildType: 'new_build',
    leadSource: 'webform',
    statusChangedAt: '2025-12-13T14:00:00Z',
    lastContacted: '2025-12-13T14:00:00Z',
    createdAt: '2025-11-01T10:00:00Z'
  },
  // === MASTER DEMO - Cameron Gribbons Project 2 (Proposal Sent - Multiple Options) ===
  {
    id: 'proj_demo2',
    customerId: 'cust_demo',
    name: 'Gribbons Pool Fence',
    address: '1234 Demo Street, Columbus, OH 43215',
    status: 'proposal_sent',
    customerStatus: 'Reviewing Proposal',
    salespersonId: 'sp2',
    portalLive: true,
    autoNotifications: true,
    salesAppointment: '2026-03-10T14:00:00Z',
    buildType: 'new_build',
    leadSource: 'phone',
    statusChangedAt: '2026-03-12T10:00:00Z',
    lastContacted: '2026-03-12T10:00:00Z',
    createdAt: '2026-03-05T10:00:00Z'
  },
  // 1. New Lead
  { id: 'proj1', customerId: 'cust1', name: 'Rivera Fence', address: '3421 Sullivant Ave, Columbus, OH 43204', status: 'new_lead', customerStatus: 'New Lead', salespersonId: 'sp1', portalLive: false, autoNotifications: true, buildType: 'new_build', leadSource: 'webform', statusChangedAt: '2026-03-28T10:00:00Z', lastContacted: '2026-03-28T10:00:00Z', createdAt: '2026-03-28T10:00:00Z' },
  // 2-4. Quote Scheduled (multiple)
  { id: 'proj2', customerId: 'cust2', name: 'Mitchell Fence', address: '1847 Bryden Rd, Columbus, OH 43205', status: 'quote_scheduled', customerStatus: 'Quote Scheduled', salespersonId: 'sp1', portalLive: true, autoNotifications: true, salesAppointment: '2026-03-31T10:00:00Z', buildType: 'replacement', leadSource: 'phone', statusChangedAt: '2026-03-25T10:00:00Z', lastContacted: '2026-03-29T14:00:00Z', createdAt: '2026-03-24T10:00:00Z' },
  { id: 'proj3', customerId: 'cust3', name: 'Chen Fence', address: '5590 Riverside Dr, Columbus, OH 43221', status: 'quote_scheduled', customerStatus: 'Quote Scheduled', salespersonId: 'sp2', portalLive: true, autoNotifications: true, salesAppointment: '2026-03-31T14:00:00Z', buildType: 'new_build', leadSource: 'google_ads', statusChangedAt: '2026-03-24T10:00:00Z', lastContacted: '2026-03-28T09:00:00Z', createdAt: '2026-03-23T10:00:00Z' },
  { id: 'proj4', customerId: 'cust4', name: 'Lopez Fence', address: '892 Oakland Park Ave, Columbus, OH 43224', status: 'quote_scheduled', customerStatus: 'Quote Scheduled', salespersonId: 'sp3', portalLive: true, autoNotifications: true, salesAppointment: '2026-03-31T16:00:00Z', buildType: 'new_build', leadSource: 'meta_ads', statusChangedAt: '2026-03-23T10:00:00Z', lastContacted: '2026-03-27T11:00:00Z', createdAt: '2026-03-22T10:00:00Z' },
  // 5. Building Proposal
  { id: 'proj5', customerId: 'cust5', name: 'Howard Fence', address: '2234 Fairwood Ave, Columbus, OH 43207', status: 'building_proposal', customerStatus: 'Building Proposal', salespersonId: 'sp1', portalLive: true, autoNotifications: true, salesAppointment: '2026-03-18T10:00:00Z', buildType: 'replacement', leadSource: 'direct_mail', statusChangedAt: '2026-03-18T16:00:00Z', lastContacted: '2026-03-26T10:00:00Z', createdAt: '2026-03-15T10:00:00Z' },
  // 6. Proposal Sent
  { id: 'proj6', customerId: 'cust6', name: 'Washington Fence', address: '789 S Champion Ave, Columbus, OH 43206', status: 'proposal_sent', customerStatus: 'Proposal Sent', salespersonId: 'sp1', portalLive: true, autoNotifications: true, salesAppointment: '2026-03-11T14:00:00Z', buildType: 'new_build', leadSource: 'email', statusChangedAt: '2026-03-12T10:00:00Z', lastContacted: '2026-03-25T15:00:00Z', createdAt: '2026-03-10T10:00:00Z' },
  // 7. Awaiting Deposit
  { id: 'proj7', customerId: 'cust7', name: 'Patel Fence', address: '4412 Kenny Rd, Columbus, OH 43220', status: 'awaiting_deposit', customerStatus: 'Awaiting Deposit', salespersonId: 'sp2', portalLive: true, autoNotifications: true, salesAppointment: '2026-03-06T11:00:00Z', depositAmount: 2400, buildType: 'new_build', leadSource: 'text', statusChangedAt: '2026-03-08T14:00:00Z', lastContacted: '2026-03-24T09:00:00Z', createdAt: '2026-03-05T10:00:00Z' },
  // 8. Lost
  { id: 'proj8', customerId: 'cust8', name: 'Foster Fence', address: '1123 E Broad St, Columbus, OH 43205', status: 'lost', customerStatus: 'Lost', salespersonId: 'sp1', portalLive: false, autoNotifications: false, salesAppointment: '2026-02-12T09:00:00Z', buildType: 'replacement', leadSource: 'phone', statusChangedAt: '2026-02-15T10:00:00Z', lastContacted: '2026-02-15T10:00:00Z', createdAt: '2026-02-10T10:00:00Z' },
  // 9. Quote Expired
  { id: 'proj9', customerId: 'cust9', name: 'Thompson Fence', address: '3456 Morse Rd, Columbus, OH 43231', status: 'quote_expired', customerStatus: 'Quote Expired', salespersonId: 'sp3', portalLive: false, autoNotifications: false, salesAppointment: '2026-01-20T15:00:00Z', buildType: 'new_build', leadSource: 'webform', statusChangedAt: '2026-02-20T10:00:00Z', lastContacted: '2026-02-01T14:00:00Z', createdAt: '2026-01-15T10:00:00Z' },
  // 10. Permit Preparation
  { id: 'proj10', customerId: 'cust10', name: 'Brooks Fence', address: '3367 Indianola Ave, Columbus, OH 43214', status: 'permit_preparation', customerStatus: 'Permit Preparation', salespersonId: 'sp1', portalLive: true, autoNotifications: true, salesAppointment: '2026-02-28T10:00:00Z', depositAmount: 2800, depositPaid: true, createdAt: '2026-03-01T10:00:00Z' },
  // 11. Customer Docs Needed
  { id: 'proj11', customerId: 'cust11', name: 'Kowalski Fence', address: '6278 Olentangy River Rd, Columbus, OH 43235', status: 'customer_docs_needed', customerStatus: 'Customer Docs Needed', salespersonId: 'sp2', portalLive: true, autoNotifications: true, salesAppointment: '2026-02-22T14:00:00Z', depositAmount: 1800, depositPaid: true, documentationNeededDescription: 'HOA approval letter required', createdAt: '2026-02-25T10:00:00Z' },
  // 12. Permit Submitted
  { id: 'proj12', customerId: 'cust12', name: 'Williams Fence', address: '901 S High St, Columbus, OH 43206', status: 'permit_submitted', customerStatus: 'Permit Submitted', salespersonId: 'sp1', portalLive: true, autoNotifications: true, salesAppointment: '2026-02-18T11:00:00Z', depositAmount: 3200, depositPaid: true, createdAt: '2026-02-20T10:00:00Z' },
  // 13. Permit Revision Needed
  { id: 'proj13', customerId: 'cust13', name: 'Nguyen Fence', address: '4520 Karl Rd, Columbus, OH 43224', status: 'permit_revision_needed', customerStatus: 'Permit Revision', salespersonId: 'sp3', portalLive: true, autoNotifications: true, salesAppointment: '2026-02-12T16:00:00Z', depositAmount: 2600, depositPaid: true, createdAt: '2026-02-15T10:00:00Z' },
  // 14. Permit Resubmitted
  { id: 'proj14', customerId: 'cust14', name: 'Garcia Fence', address: '2890 N High St, Columbus, OH 43202', status: 'permit_resubmitted', customerStatus: 'Permit Resubmitted', salespersonId: 'sp1', portalLive: true, autoNotifications: true, salesAppointment: '2026-02-08T09:00:00Z', depositAmount: 2900, depositPaid: true, createdAt: '2026-02-10T10:00:00Z' },
  // 15. Ready to Order Materials
  { id: 'proj15', customerId: 'cust15', name: 'Brown Fence', address: '1567 Westerville Rd, Columbus, OH 43224', status: 'ready_to_order_materials', customerStatus: 'Ready to Order', salespersonId: 'sp2', portalLive: true, autoNotifications: true, salesAppointment: '2026-02-03T10:00:00Z', depositAmount: 2200, depositPaid: true, createdAt: '2026-02-05T10:00:00Z' },
  // 16. Materials Ordered
  { id: 'proj16', customerId: 'cust16', name: 'Wilson Fence', address: '4892 Sawmill Rd, Columbus, OH 43235', status: 'materials_ordered', customerStatus: 'Materials Ordered', salespersonId: 'sp1', portalLive: true, autoNotifications: true, salesAppointment: '2026-01-30T14:00:00Z', depositAmount: 3400, depositPaid: true, createdAt: '2026-02-01T10:00:00Z' },
  // 17. Scheduling Installation
  { id: 'proj17', customerId: 'cust17', name: 'Adams Fence', address: '3234 Agler Rd, Columbus, OH 43219', status: 'scheduling_installation', customerStatus: 'Scheduling Install', salespersonId: 'sp3', portalLive: true, autoNotifications: true, salesAppointment: '2026-01-25T11:00:00Z', depositAmount: 1600, depositPaid: true, createdAt: '2026-01-28T10:00:00Z' },
  // 18. Installation Scheduled
  { id: 'proj18', customerId: 'cust18', name: 'Martinez Fence', address: '7821 Refugee Rd, Columbus, OH 43232', status: 'installation_scheduled', customerStatus: 'Install Scheduled', salespersonId: 'sp1', portalLive: true, autoNotifications: true, salesAppointment: '2026-01-22T10:00:00Z', depositAmount: 2500, depositPaid: true, installationDate: '2026-04-08T08:00:00Z', createdAt: '2026-01-25T10:00:00Z' },
  // 19. Installation Delayed
  { id: 'proj19', customerId: 'cust19', name: 'Clark Fence', address: '5678 Georgesville Rd, Columbus, OH 43228', status: 'installation_delayed', customerStatus: 'Install Delayed', salespersonId: 'sp2', portalLive: true, autoNotifications: true, salesAppointment: '2026-01-18T15:00:00Z', depositAmount: 3100, depositPaid: true, installationDate: '2026-03-25T08:00:00Z', createdAt: '2026-01-20T10:00:00Z' },
  // 20. Installation In Progress
  { id: 'proj20', customerId: 'cust20', name: 'Taylor Fence', address: '9012 Hamilton Rd, Columbus, OH 43219', status: 'installation_in_progress', customerStatus: 'Installing', salespersonId: 'sp1', portalLive: true, autoNotifications: true, salesAppointment: '2026-01-12T09:00:00Z', depositAmount: 3600, depositPaid: true, installationDate: '2026-03-30T08:00:00Z', createdAt: '2026-01-15T10:00:00Z' },
  // 21. Scheduling Walkthrough
  { id: 'proj21', customerId: 'cust21', name: 'Scott Fence', address: '2345 Parsons Ave, Columbus, OH 43207', status: 'scheduling_walkthrough', customerStatus: 'Scheduling Walkthrough', salespersonId: 'sp3', portalLive: true, autoNotifications: true, salesAppointment: '2026-01-08T14:00:00Z', depositAmount: 2300, depositPaid: true, installationDate: '2026-03-20T08:00:00Z', createdAt: '2026-01-10T10:00:00Z' },
  // 22. Walkthrough Scheduled
  { id: 'proj22', customerId: 'cust22', name: 'White Fence', address: '6789 Cleveland Ave, Columbus, OH 43231', status: 'walkthrough_scheduled', customerStatus: 'Walkthrough Scheduled', salespersonId: 'sp1', portalLive: true, autoNotifications: true, salesAppointment: '2026-01-03T10:00:00Z', depositAmount: 2700, depositPaid: true, installationDate: '2026-03-15T08:00:00Z', walkthroughDate: '2026-04-05T10:00:00Z', createdAt: '2026-01-05T10:00:00Z' },
  // 23. Fixes Needed
  { id: 'proj23', customerId: 'cust23', name: 'Lee Fence', address: '4321 Livingston Ave, Columbus, OH 43227', status: 'fixes_needed', customerStatus: 'Fixes Needed', salespersonId: 'sp2', portalLive: true, autoNotifications: true, salesAppointment: '2025-12-22T11:00:00Z', depositAmount: 2100, depositPaid: true, installationDate: '2026-03-10T08:00:00Z', walkthroughDate: '2026-03-28T10:00:00Z', createdAt: '2025-12-28T10:00:00Z' },
  // 24. Final Payment Due
  { id: 'proj24', customerId: 'cust24', name: 'Harris Fence', address: '8765 Sunbury Rd, Columbus, OH 43230', status: 'final_payment_due', customerStatus: 'Final Payment Due', salespersonId: 'sp1', portalLive: true, autoNotifications: true, salesAppointment: '2025-12-18T14:00:00Z', depositAmount: 2800, depositPaid: true, installationDate: '2026-03-05T08:00:00Z', walkthroughDate: '2026-03-25T10:00:00Z', finalPaymentAmount: 2800, createdAt: '2025-12-20T10:00:00Z' },
  // 25. Requesting Review
  { id: 'proj25', customerId: 'cust25', name: 'Robinson Fence', address: '1234 Dublin Rd, Columbus, OH 43215', status: 'requesting_review', customerStatus: 'Requesting Review', salespersonId: 'sp3', portalLive: true, autoNotifications: true, salesAppointment: '2025-12-12T09:00:00Z', depositAmount: 1400, depositPaid: true, installationDate: '2026-02-25T08:00:00Z', walkthroughDate: '2026-03-15T10:00:00Z', finalPaymentAmount: 1400, finalPaymentPaid: true, createdAt: '2025-12-15T10:00:00Z' },
  // 26. Complete
  { id: 'proj26', customerId: 'cust26', name: 'Johnson Fence', address: '5432 Bethel Rd, Columbus, OH 43220', status: 'complete', customerStatus: 'Complete', salespersonId: 'sp1', portalLive: false, autoNotifications: false, salesAppointment: '2025-11-28T10:00:00Z', depositAmount: 3000, depositPaid: true, installationDate: '2026-02-15T08:00:00Z', walkthroughDate: '2026-03-01T10:00:00Z', finalPaymentAmount: 3000, finalPaymentPaid: true, createdAt: '2025-12-01T10:00:00Z' },
];

export const initialProposals: Proposal[] = [
  // === MASTER DEMO - Cameron Gribbons Proposal ===
  { id: 'prop_demo', projectId: 'proj_demo', name: '6ft Cap & Trim Cedar Privacy - 225 LF + Double Gate', total: 13500, depositAmount: 4500, status: 'signed', createdAt: '2025-11-08T10:00:00Z' },

  // === MASTER DEMO - Cameron Gribbons Pool Fence Proposals (Multiple Options) ===
  // Option 1: Budget-friendly aluminum
  {
    id: 'prop_demo2_opt1',
    projectId: 'proj_demo2',
    name: 'Option 1: Standard Aluminum Pool Fence - 80 LF',
    total: 5200,
    depositAmount: 2600,
    status: 'sent',
    createdAt: '2026-03-12T10:00:00Z'
  },
  // Option 2: Mid-range with upgraded gate
  {
    id: 'prop_demo2_opt2',
    projectId: 'proj_demo2',
    name: 'Option 2: Aluminum Pool Fence + Premium Self-Closing Gate - 80 LF',
    total: 6400,
    depositAmount: 3200,
    status: 'sent',
    createdAt: '2026-03-12T10:00:00Z'
  },
  // Option 3: Premium with decorative panels
  {
    id: 'prop_demo2_opt3',
    projectId: 'proj_demo2',
    name: 'Option 3: Decorative Aluminum Pool Fence + Premium Gate - 80 LF',
    total: 7800,
    depositAmount: 3900,
    status: 'sent',
    createdAt: '2026-03-12T10:00:00Z'
  },
  // Proposal Sent
  { id: 'prop1', projectId: 'proj6', name: '6ft Cap & Trim Cedar Privacy - 180 LF', total: 8400, depositAmount: 2800, status: 'sent', createdAt: '2026-03-12T10:00:00Z' },
  // Awaiting Deposit
  { id: 'prop2', projectId: 'proj7', name: 'Vinyl Privacy Fence - 150 LF', total: 7200, depositAmount: 2400, status: 'signed', createdAt: '2026-03-08T10:00:00Z' },
  // Lost
  { id: 'prop3', projectId: 'proj8', name: '6ft PT Privacy - 200 LF', total: 6600, depositAmount: 2200, status: 'rejected', createdAt: '2026-02-12T10:00:00Z' },
  // Quote Expired
  { id: 'prop4', projectId: 'proj9', name: '4ft Aluminum - 120 LF', total: 4800, depositAmount: 1600, status: 'sent', createdAt: '2026-01-18T10:00:00Z' },
  // Permit Preparation and beyond - all signed
  { id: 'prop5', projectId: 'proj10', name: '6ft Cedar Privacy - 170 LF', total: 8400, depositAmount: 2800, status: 'signed', createdAt: '2026-03-02T10:00:00Z' },
  { id: 'prop6', projectId: 'proj11', name: '4ft Spaced Cedar Picket - 140 LF', total: 5400, depositAmount: 1800, status: 'signed', createdAt: '2026-02-26T10:00:00Z' },
  { id: 'prop7', projectId: 'proj12', name: '6ft Cedar Privacy - 200 LF', total: 9600, depositAmount: 3200, status: 'signed', createdAt: '2026-02-21T10:00:00Z' },
  { id: 'prop8', projectId: 'proj13', name: '6ft PT Privacy - 160 LF', total: 5280, depositAmount: 2600, status: 'signed', createdAt: '2026-02-16T10:00:00Z' },
  { id: 'prop9', projectId: 'proj14', name: '6ft Cedar Privacy - 175 LF', total: 8700, depositAmount: 2900, status: 'signed', createdAt: '2026-02-11T10:00:00Z' },
  { id: 'prop10', projectId: 'proj15', name: '6ft PT Privacy - 130 LF', total: 4290, depositAmount: 2200, status: 'signed', createdAt: '2026-02-06T10:00:00Z' },
  { id: 'prop11', projectId: 'proj16', name: '6ft Cedar Privacy - 210 LF', total: 10200, depositAmount: 3400, status: 'signed', createdAt: '2026-02-02T10:00:00Z' },
  { id: 'prop12', projectId: 'proj17', name: '4ft Aluminum - 100 LF', total: 4800, depositAmount: 1600, status: 'signed', createdAt: '2026-01-29T10:00:00Z' },
  { id: 'prop13', projectId: 'proj18', name: '6ft PT Privacy - 150 LF', total: 4950, depositAmount: 2500, status: 'signed', createdAt: '2026-01-26T10:00:00Z' },
  { id: 'prop14', projectId: 'proj19', name: '6ft Cedar Privacy - 190 LF', total: 9300, depositAmount: 3100, status: 'signed', createdAt: '2026-01-21T10:00:00Z' },
  { id: 'prop15', projectId: 'proj20', name: '6ft Cap & Trim Cedar - 220 LF', total: 10800, depositAmount: 3600, status: 'signed', createdAt: '2026-01-16T10:00:00Z' },
  { id: 'prop16', projectId: 'proj21', name: '6ft PT Privacy - 140 LF', total: 4620, depositAmount: 2300, status: 'signed', createdAt: '2026-01-11T10:00:00Z' },
  { id: 'prop17', projectId: 'proj22', name: '6ft Cedar Privacy - 165 LF', total: 8100, depositAmount: 2700, status: 'signed', createdAt: '2026-01-06T10:00:00Z' },
  { id: 'prop18', projectId: 'proj23', name: '6ft PT Privacy - 125 LF', total: 4125, depositAmount: 2100, status: 'signed', createdAt: '2025-12-29T10:00:00Z' },
  { id: 'prop19', projectId: 'proj24', name: '6ft Cedar Privacy - 170 LF', total: 8400, depositAmount: 2800, status: 'signed', createdAt: '2025-12-21T10:00:00Z' },
  { id: 'prop20', projectId: 'proj25', name: '4ft Aluminum - 90 LF', total: 4200, depositAmount: 1400, status: 'signed', createdAt: '2025-12-16T10:00:00Z' },
  { id: 'prop21', projectId: 'proj26', name: '6ft Cedar Privacy - 185 LF', total: 9000, depositAmount: 3000, status: 'signed', createdAt: '2025-12-02T10:00:00Z' },
];

export const initialDrawings: Drawing[] = [];

export const initialPricings: Pricing[] = [];

export const initialNotes: Note[] = [
  // === MASTER DEMO - Cameron Gribbons Notes ===
  { id: 'note_demo1', projectId: 'proj_demo', content: 'Customer wants 6ft cedar privacy fence around entire backyard. Prefers Cap & Trim style. Has a dog so needs secure gates.', authorId: 'sp2', createdAt: '2025-11-01T10:00:00Z' },
  { id: 'note_demo2', projectId: 'proj_demo', content: 'Quote appointment confirmed for Nov 5th at 2pm. Customer will be home.', authorId: 'sp2', createdAt: '2025-11-03T14:00:00Z' },
  { id: 'note_demo3', projectId: 'proj_demo', content: 'Completed site visit. Measured 225 LF total. Customer wants double gate on east side for trailer access. Old fence removal included.', authorId: 'sp2', createdAt: '2025-11-05T15:30:00Z' },
  { id: 'note_demo4', projectId: 'proj_demo', content: 'Customer reviewed proposal and signed same day. Deposit paid via card.', authorId: 'sp2', createdAt: '2025-11-08T11:00:00Z' },
  { id: 'note_demo5', projectId: 'proj_demo', content: 'Permit approved by city. Ready to order materials.', authorId: 'sp2', createdAt: '2025-11-25T09:00:00Z' },
  { id: 'note_demo6', projectId: 'proj_demo', content: 'Installation crew completed fence in 2 days. Customer very happy with quality. Scheduled walkthrough for Friday.', authorId: 'sp2', createdAt: '2025-12-11T16:00:00Z' },
  { id: 'note_demo7', projectId: 'proj_demo', content: 'Walkthrough complete. No punch list items needed. Customer paid final payment on site.', authorId: 'sp2', createdAt: '2025-12-12T11:00:00Z' },
  // === MASTER DEMO - Cameron Gribbons Project 2 Notes ===
  { id: 'note_demo2_1', projectId: 'proj_demo2', content: 'Customer loved the first fence job so much they want to add a pool fence now. Getting a pool installed in April.', authorId: 'sp2', createdAt: '2026-03-05T10:00:00Z' },
  { id: 'note_demo2_2', projectId: 'proj_demo2', content: 'Needs 4ft aluminum fence around new pool. Must meet city code for self-closing, self-latching gate.', authorId: 'sp2', createdAt: '2026-03-10T15:00:00Z' },
  { id: 'note_demo2_3', projectId: 'proj_demo2', content: 'Proposal signed and deposit paid. Pool being installed first week of April, fence install scheduled for April 15th.', authorId: 'sp2', createdAt: '2026-03-15T11:00:00Z' },
];

export const initialActivities: Activity[] = [
  // === MASTER DEMO - Cameron Gribbons Full Workflow Activities ===
  { id: 'act_demo1', projectId: 'proj_demo', type: 'status_change', content: 'New lead created - Cameron Gribbons', createdAt: '2025-11-01T10:00:00Z' },
  { id: 'act_demo2', projectId: 'proj_demo', type: 'status_change', content: 'Status changed to Quote Scheduled', createdAt: '2025-11-03T14:00:00Z' },
  { id: 'act_demo3', projectId: 'proj_demo', type: 'note_added', content: 'Quote appointment confirmed for Nov 5th at 2pm', createdAt: '2025-11-03T14:05:00Z' },
  { id: 'act_demo4', projectId: 'proj_demo', type: 'status_change', content: 'Status changed to Building Proposal', createdAt: '2025-11-05T16:00:00Z' },
  { id: 'act_demo5', projectId: 'proj_demo', type: 'note_added', content: 'Site visit completed - 225 LF measured, double gate requested', createdAt: '2025-11-05T16:30:00Z' },
  { id: 'act_demo6', projectId: 'proj_demo', type: 'proposal_sent', content: 'Proposal sent: 6ft Cap & Trim Cedar Privacy - $13,500', createdAt: '2025-11-08T10:00:00Z' },
  { id: 'act_demo7', projectId: 'proj_demo', type: 'status_change', content: 'Status changed to Proposal Sent', createdAt: '2025-11-08T10:00:00Z' },
  { id: 'act_demo8', projectId: 'proj_demo', type: 'proposal_signed', content: 'Customer signed proposal', createdAt: '2025-11-08T10:45:00Z' },
  { id: 'act_demo9', projectId: 'proj_demo', type: 'status_change', content: 'Status changed to Awaiting Deposit', createdAt: '2025-11-08T10:45:00Z' },
  { id: 'act_demo10', projectId: 'proj_demo', type: 'payment_received', content: 'Deposit payment received - $4,500', createdAt: '2025-11-08T11:00:00Z' },
  { id: 'act_demo11', projectId: 'proj_demo', type: 'status_change', content: 'Status changed to Permit Preparation', createdAt: '2025-11-08T11:05:00Z' },
  { id: 'act_demo12', projectId: 'proj_demo', type: 'note_added', content: 'Survey uploaded for permit application', createdAt: '2025-11-10T09:00:00Z' },
  { id: 'act_demo13', projectId: 'proj_demo', type: 'status_change', content: 'Status changed to Permit Submitted', createdAt: '2025-11-12T14:00:00Z' },
  { id: 'act_demo14', projectId: 'proj_demo', type: 'status_change', content: 'Permit approved! Status changed to Ready to Order Materials', createdAt: '2025-11-25T09:00:00Z' },
  { id: 'act_demo15', projectId: 'proj_demo', type: 'status_change', content: 'Status changed to Materials Ordered', createdAt: '2025-11-26T10:00:00Z' },
  { id: 'act_demo16', projectId: 'proj_demo', type: 'status_change', content: 'Status changed to Scheduling Installation', createdAt: '2025-12-02T09:00:00Z' },
  { id: 'act_demo17', projectId: 'proj_demo', type: 'status_change', content: 'Installation scheduled for Dec 10th - Status changed to Installation Scheduled', createdAt: '2025-12-03T11:00:00Z' },
  { id: 'act_demo18', projectId: 'proj_demo', type: 'status_change', content: 'Crew on site - Status changed to Installation in Progress', createdAt: '2025-12-10T08:00:00Z' },
  { id: 'act_demo19', projectId: 'proj_demo', type: 'note_added', content: 'Before photos uploaded', createdAt: '2025-12-10T08:15:00Z' },
  { id: 'act_demo20', projectId: 'proj_demo', type: 'note_added', content: 'Progress photos uploaded - Day 1', createdAt: '2025-12-10T16:00:00Z' },
  { id: 'act_demo21', projectId: 'proj_demo', type: 'note_added', content: 'Progress photos uploaded - Day 2', createdAt: '2025-12-11T16:00:00Z' },
  { id: 'act_demo22', projectId: 'proj_demo', type: 'status_change', content: 'Installation complete - Status changed to Scheduling Walkthrough', createdAt: '2025-12-11T16:30:00Z' },
  { id: 'act_demo23', projectId: 'proj_demo', type: 'status_change', content: 'Walkthrough scheduled for Dec 12th - Status changed to Walkthrough Scheduled', createdAt: '2025-12-11T17:00:00Z' },
  { id: 'act_demo24', projectId: 'proj_demo', type: 'note_added', content: 'After photos uploaded', createdAt: '2025-12-12T10:30:00Z' },
  { id: 'act_demo25', projectId: 'proj_demo', type: 'status_change', content: 'Walkthrough complete, no fixes needed - Status changed to Final Payment Due', createdAt: '2025-12-12T10:45:00Z' },
  { id: 'act_demo26', projectId: 'proj_demo', type: 'payment_received', content: 'Final payment received - $4,500', createdAt: '2025-12-12T11:00:00Z' },
  { id: 'act_demo27', projectId: 'proj_demo', type: 'status_change', content: 'Status changed to Requesting Review', createdAt: '2025-12-12T11:05:00Z' },
  { id: 'act_demo28', projectId: 'proj_demo', type: 'status_change', content: 'Customer left 5-star review! Status changed to Complete', createdAt: '2025-12-13T14:00:00Z' },
  // === MASTER DEMO - Cameron Gribbons Project 2 Activities ===
  { id: 'act_demo2_1', projectId: 'proj_demo2', type: 'status_change', content: 'New project created - Pool Fence', createdAt: '2026-03-05T10:00:00Z' },
  { id: 'act_demo2_2', projectId: 'proj_demo2', type: 'status_change', content: 'Status changed to Quote Scheduled', createdAt: '2026-03-05T10:30:00Z' },
  { id: 'act_demo2_3', projectId: 'proj_demo2', type: 'status_change', content: 'Status changed to Building Proposal', createdAt: '2026-03-10T15:00:00Z' },
  { id: 'act_demo2_4', projectId: 'proj_demo2', type: 'proposal_sent', content: 'Proposal sent: 4ft Aluminum Pool Fence - $6,400', createdAt: '2026-03-12T10:00:00Z' },
  { id: 'act_demo2_5', projectId: 'proj_demo2', type: 'proposal_signed', content: 'Customer signed proposal', createdAt: '2026-03-12T14:00:00Z' },
  { id: 'act_demo2_6', projectId: 'proj_demo2', type: 'payment_received', content: 'Deposit payment received - $3,200', createdAt: '2026-03-12T14:30:00Z' },
  { id: 'act_demo2_7', projectId: 'proj_demo2', type: 'status_change', content: 'No permit required for pool fence under 6ft. Status changed to Materials Ordered', createdAt: '2026-03-15T09:00:00Z' },
  { id: 'act_demo2_8', projectId: 'proj_demo2', type: 'status_change', content: 'Installation scheduled for April 15th - Status changed to Installation Scheduled', createdAt: '2026-03-20T11:00:00Z' },
  // Other activities
  { id: 'act1', projectId: 'proj1', type: 'status_change', content: 'Project created', createdAt: '2026-03-28T10:00:00Z' },
  { id: 'act2', projectId: 'proj2', type: 'status_change', content: 'Quote appointment scheduled for April 2nd', createdAt: '2026-03-24T12:00:00Z' },
  { id: 'act3', projectId: 'proj6', type: 'proposal_sent', content: 'Proposal sent to customer', createdAt: '2026-03-12T10:00:00Z' },
  { id: 'act4', projectId: 'proj7', type: 'proposal_signed', content: 'Customer signed proposal', createdAt: '2026-03-08T14:00:00Z' },
  { id: 'act5', projectId: 'proj10', type: 'payment_received', content: 'Deposit payment received - $2,800', createdAt: '2026-03-03T10:00:00Z' },
  { id: 'act6', projectId: 'proj20', type: 'status_change', content: 'Installation started', createdAt: '2026-03-30T08:00:00Z' },
];

export const initialProjectSpecs: ProjectSpecs[] = [
  // === MASTER DEMO - Cameron Gribbons Project Specs ===
  {
    id: 'specs_demo',
    projectId: 'proj_demo',
    fenceType: 'Western Red Cedar',
    fenceStyle: 'Cap & Trim Privacy',
    fenceHeight: '6ft',
    estimatedLinearFeet: 225,
    requirements: {
      permit: true,
      hoa: false,
      fenceRemoval: true,
      haulAway: true
    },
    terrainHandling: 'followGrade',
    undergroundUtilities: {
      irrigation: false,
      electricDogFence: true,
      other: false
    },
    createdAt: '2025-11-05T16:00:00Z',
    updatedAt: '2025-11-05T16:00:00Z'
  }
];

export const initialPhotos: Photo[] = [
  // === MASTER DEMO - Cameron Gribbons Photos ===
  // Before photos
  { id: 'photo_demo1', projectId: 'proj_demo', dataUrl: '', filename: 'before-front.jpg', name: 'Before - Front', caption: 'Existing chain link fence - front yard view', tags: ['Before'], inPortal: true, uploadedBy: 'sp2', createdAt: '2025-12-10T08:15:00Z' },
  { id: 'photo_demo2', projectId: 'proj_demo', dataUrl: '', filename: 'before-back.jpg', name: 'Before - Back', caption: 'Existing chain link fence - backyard view', tags: ['Before'], inPortal: true, uploadedBy: 'sp2', createdAt: '2025-12-10T08:16:00Z' },
  { id: 'photo_demo3', projectId: 'proj_demo', dataUrl: '', filename: 'before-east.jpg', name: 'Before - East', caption: 'East side where double gate will go', tags: ['Before'], inPortal: true, uploadedBy: 'sp2', createdAt: '2025-12-10T08:17:00Z' },
  // During photos
  { id: 'photo_demo4', projectId: 'proj_demo', dataUrl: '', filename: 'during-removal.jpg', name: 'Removal', caption: 'Old fence removal in progress', tags: ['During'], inPortal: true, uploadedBy: 'sp2', createdAt: '2025-12-10T10:00:00Z' },
  { id: 'photo_demo5', projectId: 'proj_demo', dataUrl: '', filename: 'during-posts.jpg', name: 'Posts', caption: 'New posts set in concrete', tags: ['During'], inPortal: true, uploadedBy: 'sp2', createdAt: '2025-12-10T14:00:00Z' },
  { id: 'photo_demo6', projectId: 'proj_demo', dataUrl: '', filename: 'during-rails.jpg', name: 'Rails', caption: 'Rails installed, ready for pickets', tags: ['During'], inPortal: true, uploadedBy: 'sp2', createdAt: '2025-12-11T09:00:00Z' },
  { id: 'photo_demo7', projectId: 'proj_demo', dataUrl: '', filename: 'during-pickets.jpg', name: 'Pickets', caption: 'Pickets going up on south side', tags: ['During'], inPortal: true, uploadedBy: 'sp2', createdAt: '2025-12-11T12:00:00Z' },
  // After photos
  { id: 'photo_demo8', projectId: 'proj_demo', dataUrl: '', filename: 'after-front.jpg', name: 'After - Front', caption: 'Completed fence - front view', tags: ['After'], inPortal: true, uploadedBy: 'sp2', createdAt: '2025-12-12T10:30:00Z' },
  { id: 'photo_demo9', projectId: 'proj_demo', dataUrl: '', filename: 'after-back.jpg', name: 'After - Back', caption: 'Completed fence - backyard', tags: ['After'], inPortal: true, uploadedBy: 'sp2', createdAt: '2025-12-12T10:31:00Z' },
  { id: 'photo_demo10', projectId: 'proj_demo', dataUrl: '', filename: 'after-doublegate.jpg', name: 'Double Gate', caption: 'Completed double gate - east side', tags: ['After'], inPortal: true, uploadedBy: 'sp2', createdAt: '2025-12-12T10:32:00Z' },
  { id: 'photo_demo11', projectId: 'proj_demo', dataUrl: '', filename: 'after-walkgate.jpg', name: 'Walk Gate', caption: 'Walk gate with secure latch', tags: ['After'], inPortal: true, uploadedBy: 'sp2', createdAt: '2025-12-12T10:33:00Z' },
];

export const initialDocuments: Document[] = [
  // === MASTER DEMO - Cameron Gribbons Documents ===
  { id: 'doc_demo1', projectId: 'proj_demo', name: 'Gribbons Fence Proposal.pdf', category: 'proposal', fileType: 'pdf', dataUrl: '', fileSize: 245000, inPortal: true, uploadSource: 'team', createdAt: '2025-11-08T10:00:00Z' },
  { id: 'doc_demo2', projectId: 'proj_demo', name: 'Signed Contract.pdf', category: 'contract', fileType: 'pdf', dataUrl: '', fileSize: 189000, inPortal: true, uploadSource: 'team', createdAt: '2025-11-08T10:45:00Z' },
  { id: 'doc_demo3', projectId: 'proj_demo', name: 'Property Survey.pdf', category: 'other', fileType: 'pdf', dataUrl: '', fileSize: 512000, inPortal: false, uploadSource: 'customer', createdAt: '2025-11-10T09:00:00Z' },
  { id: 'doc_demo4', projectId: 'proj_demo', name: 'City of Columbus Fence Permit.pdf', category: 'permit', fileType: 'pdf', dataUrl: '', fileSize: 156000, inPortal: true, uploadSource: 'team', createdAt: '2025-11-25T09:00:00Z' },
  { id: 'doc_demo5', projectId: 'proj_demo', name: 'Warranty Certificate.pdf', category: 'other', fileType: 'pdf', dataUrl: '', fileSize: 98000, inPortal: true, uploadSource: 'team', createdAt: '2025-12-12T11:00:00Z' },
];

export const initialCommunications: Communication[] = [
  // === MASTER DEMO - Cameron Gribbons Communications ===
  { id: 'comm_demo1', projectId: 'proj_demo', type: 'sms', direction: 'outbound', recipientName: 'Cameron Gribbons', recipientContact: '(614) 555-9999', preview: 'Hi Cameron! This is Cam from Fence Boys...', fullBody: 'Hi Cameron! This is Cam from Fence Boys. I have you scheduled for a quote appointment on Nov 5th at 2pm. Does that still work for you?', status: 'delivered', via: 'QUO', createdAt: '2025-11-03T14:00:00Z' },
  { id: 'comm_demo2', projectId: 'proj_demo', type: 'sms', direction: 'inbound', recipientName: 'Cameron Gribbons', recipientContact: '(614) 555-9999', preview: 'Yes that works! See you then', fullBody: 'Yes that works! See you then', status: 'delivered', via: 'QUO', createdAt: '2025-11-03T14:15:00Z' },
  { id: 'comm_demo3', projectId: 'proj_demo', type: 'email', direction: 'outbound', recipientName: 'Cameron Gribbons', recipientContact: 'cameron@demo.com', subject: 'Your Fence Boys Proposal', preview: 'Thank you for choosing Fence Boys!', fullBody: 'Hi Cameron,\n\nThank you for choosing Fence Boys! I\'ve attached your proposal for the 6ft Cap & Trim Cedar Privacy fence. The total comes to $13,500 with a $4,500 deposit to get started.\n\nPlease review and let me know if you have any questions!\n\nBest,\nCam Gribbons\nFence Boys', status: 'delivered', createdAt: '2025-11-08T10:00:00Z' },
  { id: 'comm_demo4', projectId: 'proj_demo', type: 'sms', direction: 'inbound', recipientName: 'Cameron Gribbons', recipientContact: '(614) 555-9999', preview: 'Looks great! Just signed and paid...', fullBody: 'Looks great! Just signed and paid the deposit', status: 'delivered', via: 'QUO', createdAt: '2025-11-08T11:00:00Z' },
  { id: 'comm_demo5', projectId: 'proj_demo', type: 'sms', direction: 'outbound', recipientName: 'Cameron Gribbons', recipientContact: '(614) 555-9999', preview: 'Awesome! Got it. We\'ll get started...', fullBody: 'Awesome! Got it. We\'ll get started on your permit application right away. I\'ll keep you posted!', status: 'delivered', via: 'QUO', createdAt: '2025-11-08T11:05:00Z' },
  { id: 'comm_demo6', projectId: 'proj_demo', type: 'email', direction: 'outbound', recipientName: 'Cameron Gribbons', recipientContact: 'cameron@demo.com', subject: 'Permit Approved!', preview: 'Great news - your fence permit has been approved!', fullBody: 'Hi Cameron,\n\nGreat news - your fence permit has been approved by the City of Columbus! We\'re ordering materials now and will be in touch to schedule your installation.\n\nBest,\nCam', status: 'delivered', createdAt: '2025-11-25T09:30:00Z' },
  { id: 'comm_demo7', projectId: 'proj_demo', type: 'sms', direction: 'outbound', recipientName: 'Cameron Gribbons', recipientContact: '(614) 555-9999', preview: 'Hi Cameron! Your installation is scheduled...', fullBody: 'Hi Cameron! Your installation is scheduled for December 10th. Our crew will arrive around 8am. Please make sure the backyard is accessible and pets are secured. Any questions?', status: 'delivered', via: 'QUO', createdAt: '2025-12-03T11:00:00Z' },
  { id: 'comm_demo8', projectId: 'proj_demo', type: 'sms', direction: 'inbound', recipientName: 'Cameron Gribbons', recipientContact: '(614) 555-9999', preview: 'Perfect! I\'ll have the gate open...', fullBody: 'Perfect! I\'ll have the gate open and dog inside. Thanks!', status: 'delivered', via: 'QUO', createdAt: '2025-12-03T11:30:00Z' },
  { id: 'comm_demo9', projectId: 'proj_demo', type: 'sms', direction: 'outbound', recipientName: 'Cameron Gribbons', recipientContact: '(614) 555-9999', preview: 'Good morning! Our crew is on their way...', fullBody: 'Good morning! Our crew is on their way. They should arrive in about 20 minutes.', status: 'delivered', via: 'QUO', createdAt: '2025-12-10T07:45:00Z' },
  { id: 'comm_demo10', projectId: 'proj_demo', type: 'sms', direction: 'outbound', recipientName: 'Cameron Gribbons', recipientContact: '(614) 555-9999', preview: 'Installation is complete! The fence looks...', fullBody: 'Installation is complete! The fence looks amazing. Can we schedule a walkthrough for tomorrow at 10am?', status: 'delivered', via: 'QUO', createdAt: '2025-12-11T16:30:00Z' },
  { id: 'comm_demo11', projectId: 'proj_demo', type: 'sms', direction: 'inbound', recipientName: 'Cameron Gribbons', recipientContact: '(614) 555-9999', preview: '10am works great. It looks incredible...', fullBody: '10am works great. It looks incredible from inside - can\'t wait to see it up close!', status: 'delivered', via: 'QUO', createdAt: '2025-12-11T17:00:00Z' },
  { id: 'comm_demo12', projectId: 'proj_demo', type: 'email', direction: 'outbound', recipientName: 'Cameron Gribbons', recipientContact: 'cameron@demo.com', subject: 'Thank You - Project Complete!', preview: 'Thank you for your business!', fullBody: 'Hi Cameron,\n\nThank you for your business! Your fence project is now complete. I\'ve attached your warranty certificate for your records.\n\nIf you have a moment, we\'d really appreciate a Google review: [link]\n\nEnjoy your new fence!\n\nBest,\nCam Gribbons\nFence Boys', status: 'delivered', createdAt: '2025-12-12T11:30:00Z' },
];

export const initialPayments: Payment[] = [
  // === MASTER DEMO - Cameron Gribbons Payments ===
  { id: 'pay_demo1', projectId: 'proj_demo', type: 'deposit', amount: 4500, status: 'paid', paymentMethod: 'card', paymentDate: '2025-11-08T11:00:00Z', createdAt: '2025-11-08T11:00:00Z' },
  { id: 'pay_demo2', projectId: 'proj_demo', type: 'final', amount: 4500, status: 'paid', paymentMethod: 'card', paymentDate: '2025-12-12T11:00:00Z', createdAt: '2025-12-12T11:00:00Z' },
  // === MASTER DEMO - Cameron Gribbons Project 2 Payments ===
  { id: 'pay_demo2_1', projectId: 'proj_demo2', type: 'deposit', amount: 3200, status: 'paid', paymentMethod: 'card', paymentDate: '2026-03-12T14:30:00Z', createdAt: '2026-03-12T14:30:00Z' },
  // Deposits paid for post-sale projects
  { id: 'pay1', projectId: 'proj10', type: 'deposit', amount: 2800, status: 'paid', paymentMethod: 'card', paymentDate: '2026-03-03T10:00:00Z', createdAt: '2026-03-03T10:00:00Z' },
  { id: 'pay2', projectId: 'proj11', type: 'deposit', amount: 1800, status: 'paid', paymentMethod: 'card', paymentDate: '2026-02-27T10:00:00Z', createdAt: '2026-02-27T10:00:00Z' },
  { id: 'pay3', projectId: 'proj12', type: 'deposit', amount: 3200, status: 'paid', paymentMethod: 'check', paymentDate: '2026-02-22T10:00:00Z', createdAt: '2026-02-22T10:00:00Z' },
  { id: 'pay4', projectId: 'proj24', type: 'deposit', amount: 2800, status: 'paid', paymentMethod: 'card', paymentDate: '2025-12-22T10:00:00Z', createdAt: '2025-12-22T10:00:00Z' },
  { id: 'pay5', projectId: 'proj25', type: 'deposit', amount: 1400, status: 'paid', paymentMethod: 'card', paymentDate: '2025-12-17T10:00:00Z', createdAt: '2025-12-17T10:00:00Z' },
  { id: 'pay6', projectId: 'proj25', type: 'final', amount: 1400, status: 'paid', paymentMethod: 'card', paymentDate: '2025-12-20T10:00:00Z', createdAt: '2025-12-20T10:00:00Z' },
  { id: 'pay7', projectId: 'proj26', type: 'deposit', amount: 3000, status: 'paid', paymentMethod: 'card', paymentDate: '2025-12-03T10:00:00Z', createdAt: '2025-12-03T10:00:00Z' },
  { id: 'pay8', projectId: 'proj26', type: 'final', amount: 3000, status: 'paid', paymentMethod: 'check', paymentDate: '2025-12-10T10:00:00Z', createdAt: '2025-12-10T10:00:00Z' },
];

export const initialUsers: User[] = [
  {
    id: 'user1',
    name: 'Cody McCraw',
    email: 'cody@fenceboys.com',
    roles: ['admin', 'salesperson'],
    status: 'active',
    joinedAt: '2024-01-15T00:00:00Z',
    integrations: {
      google: { connected: true, email: 'cody@fenceboys.com' },
      calendly: { connected: true, url: 'https://calendly.com/cody-fenceboys' },
      quo: { lineId: 'main', lineType: 'main' },
    },
  },
  {
    id: 'user2',
    name: 'Cam Gribbons',
    email: 'cam@fenceboys.com',
    roles: ['admin', 'salesperson'],
    status: 'active',
    joinedAt: '2024-03-01T00:00:00Z',
    integrations: {
      google: { connected: true, email: 'cam@fenceboys.com' },
      calendly: { connected: false },
      quo: { lineId: 'direct-cam', lineType: 'direct' },
    },
  },
  {
    id: 'user3',
    name: 'Jake Turner',
    email: 'jake@fenceboys.com',
    roles: ['salesperson'],
    status: 'active',
    joinedAt: '2024-06-01T00:00:00Z',
    integrations: {
      google: { connected: true, email: 'jake@fenceboys.com' },
      calendly: { connected: true, url: 'https://calendly.com/jake-fenceboys' },
      quo: { lineId: 'direct-jake', lineType: 'direct' },
    },
  },
];

export const initialProjectStatusConfigs: ProjectStatusConfig[] = [
  // Permits Phase (Post-sale starts here)
  { id: 'status1', name: 'Not Started', customerLabel: 'Getting Started', phase: 'permits', triggerNote: 'Project won, not yet started', sortOrder: 1, bgColor: '#f3f4f6', textColor: '#374151', isActive: true, notifications: { slack: { enabled: true, channel: '#fb-ops' }, sms: { enabled: false, template: '' }, email: { enabled: false, subject: '', body: '' } } },
  { id: 'status2', name: 'Permit Preparation', customerLabel: 'Processing Permits', phase: 'permits', triggerNote: 'Preparing permit application', sortOrder: 2, bgColor: '#d1fae5', textColor: '#065f46', isActive: true, notifications: { slack: { enabled: true, channel: '#fb-ops' }, sms: { enabled: false, template: '' }, email: { enabled: false, subject: '', body: '' } } },
  { id: 'status3', name: 'Customer Docs Needed', customerLabel: 'Documents Required', phase: 'permits', triggerNote: 'Waiting on customer documents', sortOrder: 3, bgColor: '#fed7aa', textColor: '#9a3412', isActive: true, notifications: { slack: { enabled: false, channel: '' }, sms: { enabled: true, template: 'Hi {{customer_name}}, we need some documents from you to proceed.' }, email: { enabled: true, subject: 'Documents Needed', body: 'Hi {{customer_name}},\n\nWe need some documents to proceed with your permit.' } } },
  { id: 'status4', name: 'Permit Submitted', customerLabel: 'Processing Permits', phase: 'permits', triggerNote: 'Permit submitted to city', sortOrder: 4, bgColor: '#d1fae5', textColor: '#065f46', isActive: true, notifications: { slack: { enabled: true, channel: '#fb-ops' }, sms: { enabled: false, template: '' }, email: { enabled: false, subject: '', body: '' } } },
  { id: 'status5', name: 'Permit Revision Needed', customerLabel: 'Processing Permits', phase: 'permits', triggerNote: 'City requested changes', sortOrder: 5, bgColor: '#fed7aa', textColor: '#9a3412', isActive: true, notifications: { slack: { enabled: true, channel: '#fb-ops' }, sms: { enabled: false, template: '' }, email: { enabled: false, subject: '', body: '' } } },
  { id: 'status6', name: 'Permit Resubmitted', customerLabel: 'Processing Permits', phase: 'permits', triggerNote: 'Revised permit resubmitted', sortOrder: 6, bgColor: '#d1fae5', textColor: '#065f46', isActive: true, notifications: { slack: { enabled: false, channel: '' }, sms: { enabled: false, template: '' }, email: { enabled: false, subject: '', body: '' } } },
  // Materials Phase
  { id: 'status7', name: 'Ready to Order Materials', customerLabel: 'Preparing Materials', phase: 'materials', triggerNote: 'Permit approved, ready to order', sortOrder: 7, bgColor: '#fed7aa', textColor: '#9a3412', isActive: true, notifications: { slack: { enabled: true, channel: '#fb-ops' }, sms: { enabled: false, template: '' }, email: { enabled: false, subject: '', body: '' } } },
  { id: 'status8', name: 'Materials Ordered', customerLabel: 'Materials on the Way', phase: 'materials', triggerNote: 'Materials on order', sortOrder: 8, bgColor: '#fed7aa', textColor: '#9a3412', isActive: true, notifications: { slack: { enabled: false, channel: '' }, sms: { enabled: false, template: '' }, email: { enabled: false, subject: '', body: '' } } },
  // Scheduling Phase
  { id: 'status9', name: 'Scheduling Installation', customerLabel: 'Scheduling Your Installation', phase: 'scheduling', triggerNote: 'Coordinating install date', sortOrder: 9, bgColor: '#e9d5ff', textColor: '#6b21a8', isActive: true, notifications: { slack: { enabled: false, channel: '' }, sms: { enabled: false, template: '' }, email: { enabled: false, subject: '', body: '' } } },
  { id: 'status10', name: 'Installation Scheduled', customerLabel: 'Installation Scheduled', phase: 'scheduling', triggerNote: 'Install date confirmed', sortOrder: 10, bgColor: '#e9d5ff', textColor: '#6b21a8', isActive: true, notifications: { slack: { enabled: true, channel: '#fb-ops' }, sms: { enabled: true, template: 'Hi {{customer_name}}, your installation is scheduled!' }, email: { enabled: true, subject: 'Installation Scheduled', body: 'Hi {{customer_name}},\n\nYour fence installation has been scheduled.' } } },
  { id: 'status11', name: 'Installation Delayed', customerLabel: 'Installation Rescheduling', phase: 'scheduling', triggerNote: 'Install postponed', sortOrder: 11, bgColor: '#fee2e2', textColor: '#991b1b', isActive: true, notifications: { slack: { enabled: true, channel: '#fb-ops' }, sms: { enabled: true, template: 'Hi {{customer_name}}, we need to reschedule your installation.' }, email: { enabled: false, subject: '', body: '' } } },
  // Installation Phase
  { id: 'status12', name: 'Installation in Progress', customerLabel: 'Installation in Progress', phase: 'installation', triggerNote: 'Crew on site', sortOrder: 12, bgColor: '#dbeafe', textColor: '#1d4ed8', isActive: true, notifications: { slack: { enabled: true, channel: '#fb-ops' }, sms: { enabled: false, template: '' }, email: { enabled: false, subject: '', body: '' } } },
  { id: 'status13', name: 'Scheduling Walkthrough', customerLabel: 'Scheduling Final Walkthrough', phase: 'installation', triggerNote: 'Install complete, scheduling walkthrough', sortOrder: 13, bgColor: '#dbeafe', textColor: '#1d4ed8', isActive: true, notifications: { slack: { enabled: false, channel: '' }, sms: { enabled: false, template: '' }, email: { enabled: false, subject: '', body: '' } } },
  { id: 'status14', name: 'Walkthrough Scheduled', customerLabel: 'Walkthrough Scheduled', phase: 'installation', triggerNote: 'Walkthrough date set', sortOrder: 14, bgColor: '#dbeafe', textColor: '#1d4ed8', isActive: true, notifications: { slack: { enabled: false, channel: '' }, sms: { enabled: true, template: 'Hi {{customer_name}}, your walkthrough is scheduled!' }, email: { enabled: false, subject: '', body: '' } } },
  // Close Out Phase
  { id: 'status15', name: 'Fixes Needed', customerLabel: 'Completing Final Details', phase: 'close_out', triggerNote: 'Punch list items identified', sortOrder: 15, bgColor: '#fed7aa', textColor: '#9a3412', isActive: true, notifications: { slack: { enabled: true, channel: '#fb-ops' }, sms: { enabled: false, template: '' }, email: { enabled: false, subject: '', body: '' } } },
  { id: 'status16', name: 'Final Payment Due', customerLabel: 'Final Payment Due', phase: 'close_out', triggerNote: 'Ready for final payment', sortOrder: 16, bgColor: '#fef3c7', textColor: '#92400e', isActive: true, notifications: { slack: { enabled: false, channel: '' }, sms: { enabled: true, template: 'Hi {{customer_name}}, your fence is complete! Final payment is now due.' }, email: { enabled: true, subject: 'Final Payment Due', body: 'Hi {{customer_name}},\n\nYour fence installation is complete. Please submit your final payment.' } } },
  { id: 'status17', name: 'Requesting Review', customerLabel: 'Thank You!', phase: 'close_out', triggerNote: 'Asking for Google review', sortOrder: 17, bgColor: '#f3f4f6', textColor: '#374151', isActive: true, notifications: { slack: { enabled: false, channel: '' }, sms: { enabled: true, template: 'Hi {{customer_name}}, thank you for choosing Fence Boys! Would you mind leaving us a review?' }, email: { enabled: false, subject: '', body: '' } } },
  { id: 'status18', name: 'Complete', customerLabel: 'Project Complete', phase: 'close_out', triggerNote: 'Project fully complete', sortOrder: 18, bgColor: '#d1fae5', textColor: '#065f46', isActive: true, notifications: { slack: { enabled: true, channel: '#fb-sales' }, sms: { enabled: false, template: '' }, email: { enabled: false, subject: '', body: '' } } },
];

export const initialProposalTags: ProposalTag[] = [
  // Material
  { id: 'tag1', category: 'material', name: 'Pressure Treated Pine', sortOrder: 1, isActive: true },
  { id: 'tag2', category: 'material', name: 'Western Red Cedar', sortOrder: 2, isActive: true },
  { id: 'tag3', category: 'material', name: 'Vinyl', sortOrder: 3, isActive: true },
  { id: 'tag4', category: 'material', name: 'Decorative Aluminum', sortOrder: 4, isActive: true },
  // Height
  { id: 'tag5', category: 'height', name: '4ft', sortOrder: 1, isActive: true },
  { id: 'tag6', category: 'height', name: '5ft', sortOrder: 2, isActive: true },
  { id: 'tag7', category: 'height', name: '6ft', sortOrder: 3, isActive: true },
  // Style
  { id: 'tag8', category: 'style', name: 'Privacy', sortOrder: 1, isActive: true },
  { id: 'tag9', category: 'style', name: 'Spaced Picket', sortOrder: 2, isActive: true },
  { id: 'tag10', category: 'style', name: 'Cap & Trim', sortOrder: 3, isActive: true },
  { id: 'tag11', category: 'style', name: 'Shadowbox', sortOrder: 4, isActive: true },
  { id: 'tag12', category: 'style', name: 'Ranch Rail', sortOrder: 5, isActive: true },
];

export const initialPhotoCategories: PhotoCategory[] = [
  { id: 'pcat1', name: 'Before', sortOrder: 1, isActive: true },
  { id: 'pcat2', name: 'During', sortOrder: 2, isActive: true },
  { id: 'pcat3', name: 'After', sortOrder: 3, isActive: true },
  { id: 'pcat4', name: 'Issue', sortOrder: 4, isActive: true },
  { id: 'pcat5', name: 'Other', sortOrder: 5, isActive: true },
];

export const initialDocumentCategories: DocumentCategory[] = [
  { id: 'dcat1', name: 'Proposal', sortOrder: 1, isActive: true },
  { id: 'dcat2', name: 'Contract', sortOrder: 2, isActive: true },
  { id: 'dcat3', name: 'Permit', sortOrder: 3, isActive: true },
  { id: 'dcat4', name: 'HOA', sortOrder: 4, isActive: true },
  { id: 'dcat5', name: 'Survey', sortOrder: 5, isActive: true },
  { id: 'dcat6', name: 'Warranty', sortOrder: 6, isActive: true },
  { id: 'dcat7', name: 'Other', sortOrder: 7, isActive: true },
];

export const initialCustomerStatusConfigs: CustomerStatusConfig[] = [
  { id: 'cstat1', name: 'New Lead', sortOrder: 1, isActive: true },
  { id: 'cstat2', name: 'Contact Attempted', sortOrder: 2, isActive: true },
  { id: 'cstat3', name: 'Contacted', sortOrder: 3, isActive: true },
  { id: 'cstat4', name: 'Repair Scheduled', sortOrder: 4, isActive: true },
  { id: 'cstat5', name: 'Quote Scheduled', sortOrder: 5, isActive: true },
  { id: 'cstat6', name: 'Building Proposal', sortOrder: 6, isActive: true },
  { id: 'cstat7', name: 'Proposal Sent', sortOrder: 7, isActive: true },
  { id: 'cstat8', name: 'Awaiting Deposit', sortOrder: 8, isActive: true },
  { id: 'cstat9', name: 'Won', sortOrder: 9, isActive: true },
  { id: 'cstat10', name: 'Lost', sortOrder: 10, isActive: true },
];

export const initialRequestTypeConfigs: RequestTypeConfig[] = [
  { id: 'rtype1', name: 'New Build', value: 'build', sortOrder: 1, isActive: true },
  { id: 'rtype2', name: 'Replace Existing', value: 'replace', sortOrder: 2, isActive: true },
  { id: 'rtype3', name: 'Repair', value: 'repair', sortOrder: 3, isActive: true },
];
