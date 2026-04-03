import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import {
  Dashboard,
  Customers,
  CustomerDetail,
  ProjectPage,
  Tools,
  ToolsDrawings,
  ToolsPricing,
  Placeholder,
  Portal,
  ProjectNotes,
  ProjectPhotos,
  ProjectDocuments,
  ProjectCommunications,
  ProjectPayments,
  ProjectProposals,
  ProjectDrawings,
  Users,
} from './pages';
import {
  ProjectStatusesPage,
  ProposalTagsPage,
  PhotoCategoriesPage,
  DocumentCategoriesPage,
  CustomerStatusPage,
  RequestTypesPage,
  AdminLanding,
} from './components/admin';
import './index.css';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          {/* Portal route - outside main layout */}
          <Route path="/portal/:projectId" element={<Portal />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/projects/:projectId/notes" element={<ProjectNotes />} />
          <Route path="/projects/:projectId/photos" element={<ProjectPhotos />} />
          <Route path="/projects/:projectId/documents" element={<ProjectDocuments />} />
          <Route path="/projects/:projectId/communications" element={<ProjectCommunications />} />
          <Route path="/projects/:projectId/payments" element={<ProjectPayments />} />
          <Route path="/projects/:projectId/proposals" element={<ProjectProposals />} />
          <Route path="/projects/:projectId/drawings" element={<ProjectDrawings />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/drawings" element={<ToolsDrawings />} />
          <Route path="/tools/pricing" element={<ToolsPricing />} />
          <Route path="/users" element={<Users />} />
          <Route path="/admin" element={<AdminLanding />} />
          <Route path="/admin/statuses" element={<ProjectStatusesPage />} />
          <Route path="/admin/proposal-tags" element={<ProposalTagsPage />} />
          <Route path="/admin/photo-categories" element={<PhotoCategoriesPage />} />
          <Route path="/admin/document-categories" element={<DocumentCategoriesPage />} />
          <Route path="/admin/customer-status" element={<CustomerStatusPage />} />
          <Route path="/admin/request-types" element={<RequestTypesPage />} />
          <Route path="/settings" element={<Placeholder />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
