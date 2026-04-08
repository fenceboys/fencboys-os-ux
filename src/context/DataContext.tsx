import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { loadTestPdf } from '../data/testPdf';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  Customer,
  Project,
  Proposal,
  Drawing,
  Pricing,
  Note,
  Activity,
  Salesperson,
  ProjectSpecs,
  Photo,
  Document,
  Communication,
  Payment,
  User,
  ProjectStatusConfig,
  ProposalTag,
  PhotoCategory,
  DocumentCategory,
  CustomerStatusConfig,
  RequestTypeConfig,
} from '../types';
import {
  initialCustomers,
  initialProjects,
  initialProposals,
  initialDrawings,
  initialPricings,
  initialNotes,
  initialActivities,
  initialProjectSpecs,
  initialPhotos,
  initialDocuments,
  initialCommunications,
  initialPayments,
  salespeople,
  initialUsers,
  initialProjectStatusConfigs,
  initialProposalTags,
  initialPhotoCategories,
  initialDocumentCategories,
  initialCustomerStatusConfigs,
  initialRequestTypeConfigs,
} from '../data/mockData';

interface DataContextType {
  customers: Customer[];
  projects: Project[];
  proposals: Proposal[];
  drawings: Drawing[];
  pricings: Pricing[];
  notes: Note[];
  activities: Activity[];
  salespeople: Salesperson[];
  projectSpecs: ProjectSpecs[];
  photos: Photo[];
  documents: Document[];
  communications: Communication[];
  payments: Payment[];
  users: User[];
  projectStatusConfigs: ProjectStatusConfig[];
  proposalTags: ProposalTag[];
  photoCategories: PhotoCategory[];
  documentCategories: DocumentCategory[];
  customerStatusConfigs: CustomerStatusConfig[];
  requestTypeConfigs: RequestTypeConfig[];

  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;

  // Activity actions
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;

  // Proposal actions
  addProposal: (proposal: Omit<Proposal, 'id' | 'createdAt'>) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  deleteProposal: (id: string) => void;

  // Drawing actions
  addDrawing: (drawing: Omit<Drawing, 'id' | 'createdAt'>) => void;
  assignDrawingToProject: (drawingId: string, projectId: string) => void;

  // Pricing actions
  addPricing: (pricing: Omit<Pricing, 'id' | 'createdAt'>) => void;
  assignPricingToProject: (pricingId: string, projectId: string) => void;

  // Project Specs actions
  addProjectSpecs: (specs: Omit<ProjectSpecs, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProjectSpecs: (id: string, updates: Partial<ProjectSpecs>) => void;
  getProjectSpecsByProjectId: (projectId: string) => ProjectSpecs | undefined;

  // Photo actions
  addPhoto: (photo: Omit<Photo, 'id' | 'createdAt'>) => void;
  updatePhoto: (id: string, updates: Partial<Photo>) => void;
  deletePhoto: (id: string) => void;
  getPhotosByProjectId: (projectId: string) => Photo[];

  // Document actions
  addDocument: (document: Omit<Document, 'id' | 'createdAt'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  getDocumentsByProjectId: (projectId: string) => Document[];

  // Communication actions
  addCommunication: (communication: Omit<Communication, 'id' | 'createdAt'>) => void;
  getCommunicationsByProjectId: (projectId: string) => Communication[];

  // Payment actions
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  getPaymentsByProjectId: (projectId: string) => Payment[];

  // User actions
  addUser: (user: Omit<User, 'id' | 'joinedAt'>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;

  // Project Status Config actions
  addProjectStatusConfig: (config: Omit<ProjectStatusConfig, 'id'>) => ProjectStatusConfig;
  updateProjectStatusConfig: (id: string, updates: Partial<ProjectStatusConfig>) => void;
  deleteProjectStatusConfig: (id: string) => void;
  reorderProjectStatusConfigs: (phase: string, orderedIds: string[]) => void;

  // Proposal Tag actions
  addProposalTag: (tag: Omit<ProposalTag, 'id'>) => ProposalTag;
  updateProposalTag: (id: string, updates: Partial<ProposalTag>) => void;
  deleteProposalTag: (id: string) => void;
  reorderProposalTags: (category: string, orderedIds: string[]) => void;

  // Photo Category actions
  addPhotoCategory: (category: Omit<PhotoCategory, 'id'>) => PhotoCategory;
  updatePhotoCategory: (id: string, updates: Partial<PhotoCategory>) => void;
  deletePhotoCategory: (id: string) => void;
  reorderPhotoCategories: (orderedIds: string[]) => void;

  // Document Category actions
  addDocumentCategory: (category: Omit<DocumentCategory, 'id'>) => DocumentCategory;
  updateDocumentCategory: (id: string, updates: Partial<DocumentCategory>) => void;
  deleteDocumentCategory: (id: string) => void;
  reorderDocumentCategories: (orderedIds: string[]) => void;

  // Customer Status Config actions
  addCustomerStatusConfig: (config: Omit<CustomerStatusConfig, 'id'>) => CustomerStatusConfig;
  updateCustomerStatusConfig: (id: string, updates: Partial<CustomerStatusConfig>) => void;
  deleteCustomerStatusConfig: (id: string) => void;
  reorderCustomerStatusConfigs: (orderedIds: string[]) => void;

  // Request Type Config actions
  addRequestTypeConfig: (config: Omit<RequestTypeConfig, 'id'>) => RequestTypeConfig;
  updateRequestTypeConfig: (id: string, updates: Partial<RequestTypeConfig>) => void;
  deleteRequestTypeConfig: (id: string) => void;
  reorderRequestTypeConfigs: (orderedIds: string[]) => void;

  // Helpers
  getCustomerById: (id: string) => Customer | undefined;
  getProjectById: (id: string) => Project | undefined;
  getProjectsByCustomerId: (customerId: string) => Project[];
  getProposalsByProjectId: (projectId: string) => Proposal[];
  getDrawingsByProjectId: (projectId: string) => Drawing[];
  getPricingsByProjectId: (projectId: string) => Pricing[];
  getNotesByProjectId: (projectId: string) => Note[];
  getActivitiesByProjectId: (projectId: string) => Activity[];
  getSalespersonById: (id: string) => Salesperson | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

// Data version - increment to force reset of localStorage
const DATA_VERSION = '28';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check data version and reset if outdated
  const storedVersion = localStorage.getItem('fenceboys_data_version');
  if (storedVersion !== DATA_VERSION) {
    localStorage.removeItem('fenceboys_customers');
    localStorage.removeItem('fenceboys_projects');
    localStorage.removeItem('fenceboys_proposals');
    localStorage.removeItem('fenceboys_drawings');
    localStorage.removeItem('fenceboys_pricings');
    localStorage.removeItem('fenceboys_notes');
    localStorage.removeItem('fenceboys_activities');
    localStorage.removeItem('fenceboys_projectSpecs');
    localStorage.removeItem('fenceboys_photos');
    localStorage.removeItem('fenceboys_documents');
    localStorage.removeItem('fenceboys_communications');
    localStorage.removeItem('fenceboys_payments');
    localStorage.removeItem('fenceboys_users');
    localStorage.removeItem('fenceboys_projectStatusConfigs');
    localStorage.removeItem('fenceboys_proposalTags');
    localStorage.removeItem('fenceboys_photoCategories');
    localStorage.removeItem('fenceboys_documentCategories');
    localStorage.removeItem('fenceboys_customerStatusConfigs');
    localStorage.removeItem('fenceboys_requestTypeConfigs');
    localStorage.setItem('fenceboys_data_version', DATA_VERSION);
  }

  const [customers, setCustomers] = useLocalStorage<Customer[]>('fenceboys_customers', initialCustomers);
  const [projects, setProjects] = useLocalStorage<Project[]>('fenceboys_projects', initialProjects);
  const [proposals, setProposals] = useLocalStorage<Proposal[]>('fenceboys_proposals', initialProposals);
  const [drawings, setDrawings] = useLocalStorage<Drawing[]>('fenceboys_drawings', initialDrawings);
  const [pricings, setPricings] = useLocalStorage<Pricing[]>('fenceboys_pricings', initialPricings);
  const [notes, setNotes] = useLocalStorage<Note[]>('fenceboys_notes', initialNotes);
  const [activities, setActivities] = useLocalStorage<Activity[]>('fenceboys_activities', initialActivities);
  const [projectSpecs, setProjectSpecs] = useLocalStorage<ProjectSpecs[]>('fenceboys_projectSpecs', initialProjectSpecs);
  const [photos, setPhotos] = useLocalStorage<Photo[]>('fenceboys_photos', initialPhotos);
  const [documents, setDocuments] = useLocalStorage<Document[]>('fenceboys_documents', initialDocuments);
  const [communications, setCommunications] = useLocalStorage<Communication[]>('fenceboys_communications', initialCommunications);
  const [payments, setPayments] = useLocalStorage<Payment[]>('fenceboys_payments', initialPayments);
  const [users, setUsers] = useLocalStorage<User[]>('fenceboys_users', initialUsers);
  const [projectStatusConfigs, setProjectStatusConfigs] = useLocalStorage<ProjectStatusConfig[]>('fenceboys_projectStatusConfigs', initialProjectStatusConfigs);
  const [proposalTags, setProposalTags] = useLocalStorage<ProposalTag[]>('fenceboys_proposalTags', initialProposalTags);
  const [photoCategories, setPhotoCategories] = useLocalStorage<PhotoCategory[]>('fenceboys_photoCategories', initialPhotoCategories);
  const [documentCategories, setDocumentCategories] = useLocalStorage<DocumentCategory[]>('fenceboys_documentCategories', initialDocumentCategories);
  const [customerStatusConfigs, setCustomerStatusConfigs] = useLocalStorage<CustomerStatusConfig[]>('fenceboys_customerStatusConfigs', initialCustomerStatusConfigs);
  const [requestTypeConfigs, setRequestTypeConfigs] = useLocalStorage<RequestTypeConfig[]>('fenceboys_requestTypeConfigs', initialRequestTypeConfigs);

  // Load test PDF for mock proposals that don't have pdfData
  useEffect(() => {
    const loadPdfForMockProposals = async () => {
      const proposalsWithoutPdf = proposals.filter(p => !p.pdfData);
      if (proposalsWithoutPdf.length > 0) {
        try {
          const pdfDataUrl = await loadTestPdf();
          setProposals(prev => prev.map(p =>
            !p.pdfData
              ? { ...p, pdfData: pdfDataUrl, pdfFileName: 'proposal.pdf' }
              : p
          ));
        } catch (e) {
          console.log('Test PDF not available');
        }
      }
    };
    loadPdfForMockProposals();
  }, []);

  // Customer actions
  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newCustomer: Customer = {
      ...customer,
      id: `cust_${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Project actions
  const addProject = (project: Omit<Project, 'id' | 'createdAt'>): Project => {
    const newProject: Project = {
      ...project,
      id: `proj_${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Note actions
  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: `note_${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, newNote]);
  };

  // Activity actions
  const addActivity = (activity: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `act_${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setActivities((prev) => [...prev, newActivity]);
  };

  // Proposal actions
  const addProposal = (proposal: Omit<Proposal, 'id' | 'createdAt'>) => {
    const newProposal: Proposal = {
      ...proposal,
      id: `prop_${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setProposals((prev) => [...prev, newProposal]);
  };

  const updateProposal = (id: string, updates: Partial<Proposal>) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProposal = (id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
  };

  // Drawing actions
  const addDrawing = (drawing: Omit<Drawing, 'id' | 'createdAt'>) => {
    const newDrawing: Drawing = {
      ...drawing,
      id: `draw_${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setDrawings((prev) => [...prev, newDrawing]);
  };

  const assignDrawingToProject = (drawingId: string, projectId: string) => {
    setDrawings((prev) =>
      prev.map((d) => (d.id === drawingId ? { ...d, projectId } : d))
    );
  };

  // Pricing actions
  const addPricing = (pricing: Omit<Pricing, 'id' | 'createdAt'>) => {
    const newPricing: Pricing = {
      ...pricing,
      id: `price_${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setPricings((prev) => [...prev, newPricing]);
  };

  const assignPricingToProject = (pricingId: string, projectId: string) => {
    setPricings((prev) =>
      prev.map((p) => (p.id === pricingId ? { ...p, projectId } : p))
    );
  };

  // Project Specs actions
  const addProjectSpecs = (specs: Omit<ProjectSpecs, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newSpecs: ProjectSpecs = {
      ...specs,
      id: `specs_${generateId()}`,
      createdAt: now,
      updatedAt: now,
    };
    setProjectSpecs((prev) => [...prev, newSpecs]);
  };

  const updateProjectSpecs = (id: string, updates: Partial<ProjectSpecs>) => {
    setProjectSpecs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s))
    );
  };

  const getProjectSpecsByProjectId = (projectId: string) =>
    projectSpecs.find((s) => s.projectId === projectId);

  // Photo actions
  const addPhoto = (photo: Omit<Photo, 'id' | 'createdAt'>) => {
    const newPhoto: Photo = {
      ...photo,
      id: `photo_${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const updatePhoto = (id: string, updates: Partial<Photo>) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const getPhotosByProjectId = (projectId: string) =>
    photos.filter((p) => p.projectId === projectId);

  // Document actions
  const addDocument = (document: Omit<Document, 'id' | 'createdAt'>) => {
    const newDocument: Document = {
      ...document,
      id: `doc_${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setDocuments((prev) => [...prev, newDocument]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const getDocumentsByProjectId = (projectId: string) =>
    documents.filter((d) => d.projectId === projectId);

  // Communication actions
  const addCommunication = (communication: Omit<Communication, 'id' | 'createdAt'>) => {
    const newCommunication: Communication = {
      ...communication,
      id: `comm_${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setCommunications((prev) => [...prev, newCommunication]);
  };

  const getCommunicationsByProjectId = (projectId: string) =>
    communications.filter((c) => c.projectId === projectId);

  // Payment actions
  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: `pay_${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setPayments((prev) => [...prev, newPayment]);
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const getPaymentsByProjectId = (projectId: string) =>
    payments.filter((p) => p.projectId === projectId);

  // User actions
  const addUser = (user: Omit<User, 'id' | 'joinedAt'>): User => {
    const newUser: User = {
      ...user,
      id: `user_${generateId()}`,
      joinedAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const getUserById = (id: string) => users.find((u) => u.id === id);

  // Project Status Config actions
  const addProjectStatusConfig = (config: Omit<ProjectStatusConfig, 'id'>): ProjectStatusConfig => {
    const newConfig: ProjectStatusConfig = {
      ...config,
      id: `status_${generateId()}`,
    };
    setProjectStatusConfigs((prev) => [...prev, newConfig]);
    return newConfig;
  };

  const updateProjectStatusConfig = (id: string, updates: Partial<ProjectStatusConfig>) => {
    setProjectStatusConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteProjectStatusConfig = (id: string) => {
    setProjectStatusConfigs((prev) => prev.filter((c) => c.id !== id));
  };

  const reorderProjectStatusConfigs = (phase: string, orderedIds: string[]) => {
    setProjectStatusConfigs((prev) => {
      const updated = [...prev];
      orderedIds.forEach((id, index) => {
        const configIndex = updated.findIndex((c) => c.id === id);
        if (configIndex !== -1) {
          updated[configIndex] = { ...updated[configIndex], sortOrder: index + 1 };
        }
      });
      return updated;
    });
  };

  // Proposal Tag actions
  const addProposalTag = (tag: Omit<ProposalTag, 'id'>): ProposalTag => {
    const newTag: ProposalTag = {
      ...tag,
      id: `tag_${generateId()}`,
    };
    setProposalTags((prev) => [...prev, newTag]);
    return newTag;
  };

  const updateProposalTag = (id: string, updates: Partial<ProposalTag>) => {
    setProposalTags((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteProposalTag = (id: string) => {
    setProposalTags((prev) => prev.filter((t) => t.id !== id));
  };

  const reorderProposalTags = (category: string, orderedIds: string[]) => {
    setProposalTags((prev) => {
      const updated = [...prev];
      orderedIds.forEach((id, index) => {
        const tagIndex = updated.findIndex((t) => t.id === id);
        if (tagIndex !== -1) {
          updated[tagIndex] = { ...updated[tagIndex], sortOrder: index + 1 };
        }
      });
      return updated;
    });
  };

  // Photo Category actions
  const addPhotoCategory = (category: Omit<PhotoCategory, 'id'>): PhotoCategory => {
    const newCategory: PhotoCategory = {
      ...category,
      id: `photo_cat_${generateId()}`,
    };
    setPhotoCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updatePhotoCategory = (id: string, updates: Partial<PhotoCategory>) => {
    setPhotoCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deletePhotoCategory = (id: string) => {
    setPhotoCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const reorderPhotoCategories = (orderedIds: string[]) => {
    setPhotoCategories((prev) => {
      const updated = [...prev];
      orderedIds.forEach((id, index) => {
        const catIndex = updated.findIndex((c) => c.id === id);
        if (catIndex !== -1) {
          updated[catIndex] = { ...updated[catIndex], sortOrder: index + 1 };
        }
      });
      return updated;
    });
  };

  // Document Category actions
  const addDocumentCategory = (category: Omit<DocumentCategory, 'id'>): DocumentCategory => {
    const newCategory: DocumentCategory = {
      ...category,
      id: `doc_cat_${generateId()}`,
    };
    setDocumentCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateDocumentCategory = (id: string, updates: Partial<DocumentCategory>) => {
    setDocumentCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteDocumentCategory = (id: string) => {
    setDocumentCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const reorderDocumentCategories = (orderedIds: string[]) => {
    setDocumentCategories((prev) => {
      const updated = [...prev];
      orderedIds.forEach((id, index) => {
        const catIndex = updated.findIndex((c) => c.id === id);
        if (catIndex !== -1) {
          updated[catIndex] = { ...updated[catIndex], sortOrder: index + 1 };
        }
      });
      return updated;
    });
  };

  // Customer Status Config actions
  const addCustomerStatusConfig = (config: Omit<CustomerStatusConfig, 'id'>): CustomerStatusConfig => {
    const newConfig: CustomerStatusConfig = {
      ...config,
      id: `cust_status_${generateId()}`,
    };
    setCustomerStatusConfigs((prev) => [...prev, newConfig]);
    return newConfig;
  };

  const updateCustomerStatusConfig = (id: string, updates: Partial<CustomerStatusConfig>) => {
    setCustomerStatusConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCustomerStatusConfig = (id: string) => {
    setCustomerStatusConfigs((prev) => prev.filter((c) => c.id !== id));
  };

  const reorderCustomerStatusConfigs = (orderedIds: string[]) => {
    setCustomerStatusConfigs((prev) => {
      const updated = [...prev];
      orderedIds.forEach((id, index) => {
        const configIndex = updated.findIndex((c) => c.id === id);
        if (configIndex !== -1) {
          updated[configIndex] = { ...updated[configIndex], sortOrder: index + 1 };
        }
      });
      return updated;
    });
  };

  // Request Type Config actions
  const addRequestTypeConfig = (config: Omit<RequestTypeConfig, 'id'>): RequestTypeConfig => {
    const newConfig: RequestTypeConfig = {
      ...config,
      id: `req_type_${generateId()}`,
    };
    setRequestTypeConfigs((prev) => [...prev, newConfig]);
    return newConfig;
  };

  const updateRequestTypeConfig = (id: string, updates: Partial<RequestTypeConfig>) => {
    setRequestTypeConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteRequestTypeConfig = (id: string) => {
    setRequestTypeConfigs((prev) => prev.filter((c) => c.id !== id));
  };

  const reorderRequestTypeConfigs = (orderedIds: string[]) => {
    setRequestTypeConfigs((prev) => {
      const updated = [...prev];
      orderedIds.forEach((id, index) => {
        const configIndex = updated.findIndex((c) => c.id === id);
        if (configIndex !== -1) {
          updated[configIndex] = { ...updated[configIndex], sortOrder: index + 1 };
        }
      });
      return updated;
    });
  };

  // Helpers
  const getCustomerById = (id: string) => customers.find((c) => c.id === id);
  const getProjectById = (id: string) => projects.find((p) => p.id === id);
  const getProjectsByCustomerId = (customerId: string) =>
    projects.filter((p) => p.customerId === customerId);
  const getProposalsByProjectId = (projectId: string) =>
    proposals.filter((p) => p.projectId === projectId);
  const getDrawingsByProjectId = (projectId: string) =>
    drawings.filter((d) => d.projectId === projectId);
  const getPricingsByProjectId = (projectId: string) =>
    pricings.filter((p) => p.projectId === projectId);
  const getNotesByProjectId = (projectId: string) =>
    notes.filter((n) => n.projectId === projectId);
  const getActivitiesByProjectId = (projectId: string) =>
    activities.filter((a) => a.projectId === projectId);
  const getSalespersonById = (id: string) =>
    salespeople.find((s) => s.id === id);

  return (
    <DataContext.Provider
      value={{
        customers,
        projects,
        proposals,
        drawings,
        pricings,
        notes,
        activities,
        salespeople,
        projectSpecs,
        photos,
        documents,
        communications,
        payments,
        users,
        projectStatusConfigs,
        proposalTags,
        photoCategories,
        documentCategories,
        customerStatusConfigs,
        requestTypeConfigs,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addProject,
        updateProject,
        deleteProject,
        addNote,
        addActivity,
        addProposal,
        updateProposal,
        deleteProposal,
        addDrawing,
        assignDrawingToProject,
        addPricing,
        assignPricingToProject,
        addProjectSpecs,
        updateProjectSpecs,
        getProjectSpecsByProjectId,
        addPhoto,
        updatePhoto,
        deletePhoto,
        getPhotosByProjectId,
        addDocument,
        updateDocument,
        deleteDocument,
        getDocumentsByProjectId,
        addCommunication,
        getCommunicationsByProjectId,
        addPayment,
        updatePayment,
        deletePayment,
        getPaymentsByProjectId,
        addUser,
        updateUser,
        deleteUser,
        getUserById,
        addProjectStatusConfig,
        updateProjectStatusConfig,
        deleteProjectStatusConfig,
        reorderProjectStatusConfigs,
        addProposalTag,
        updateProposalTag,
        deleteProposalTag,
        reorderProposalTags,
        addPhotoCategory,
        updatePhotoCategory,
        deletePhotoCategory,
        reorderPhotoCategories,
        addDocumentCategory,
        updateDocumentCategory,
        deleteDocumentCategory,
        reorderDocumentCategories,
        addCustomerStatusConfig,
        updateCustomerStatusConfig,
        deleteCustomerStatusConfig,
        reorderCustomerStatusConfigs,
        addRequestTypeConfig,
        updateRequestTypeConfig,
        deleteRequestTypeConfig,
        reorderRequestTypeConfigs,
        getCustomerById,
        getProjectById,
        getProjectsByCustomerId,
        getProposalsByProjectId,
        getDrawingsByProjectId,
        getPricingsByProjectId,
        getNotesByProjectId,
        getActivitiesByProjectId,
        getSalespersonById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
