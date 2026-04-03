import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Proposal, Drawing, Pricing, Photo, Document } from '../../types';
import { useData } from '../../context/DataContext';

interface ProjectDocument {
  id: string;
  name: string;
  type: 'proposal' | 'drawing' | 'pricing' | 'permit' | 'upload';
  url?: string;
  uploadedAt: string;
  showInPortal: boolean;
}

interface DocumentsListProps {
  proposals: Proposal[];
  drawings: Drawing[];
  pricings: Pricing[];
  photos?: Photo[];
  customerUploads?: ProjectDocument[];
  projectDocuments?: Document[];
  signedProposal?: { signature: string; signatureDate: string } | null;
  onUploadClick: () => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  proposals,
  drawings,
  pricings,
  photos = [],
  customerUploads = [],
  projectDocuments = [],
  signedProposal,
  onUploadClick,
}) => {
  const { documentCategories } = useData();
  const [expandedSection, setExpandedSection] = useState<string | null>('proposals');
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);

  // Filter photos that should be shown in portal
  const portalPhotos = photos.filter(p => p.inPortal);

  // Filter documents that should be shown in portal
  const portalDocuments = projectDocuments.filter(d => d.inPortal);

  // Get active document categories sorted by sortOrder
  const activeCategories = documentCategories
    .filter(c => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Group documents by category
  const getDocumentsByCategory = (categoryName: string) => {
    return portalDocuments.filter(d =>
      d.category.toLowerCase() === categoryName.toLowerCase()
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleDownload = (name: string) => {
    // In a real app, this would trigger a download
    alert(`Downloading ${name}...`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const signedProposals = proposals.filter(p => p.status === 'signed');
  const sentProposals = proposals.filter(p => p.status === 'sent' || p.status === 'viewed');

  const hasDocuments =
    proposals.length > 0 ||
    drawings.length > 0 ||
    pricings.length > 0 ||
    portalPhotos.length > 0 ||
    customerUploads.length > 0 ||
    portalDocuments.length > 0;

  if (!hasDocuments) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Documents Yet</h3>
          <p className="text-gray-500 mb-4">Documents will appear here as your project progresses.</p>
          <Button variant="outline" onClick={onUploadClick}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Documents
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Project Documents</h3>
        <Button variant="outline" size="sm" onClick={onUploadClick}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload
        </Button>
      </div>

      <div className="space-y-3">
        {/* Signed Proposals */}
        {signedProposals.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('signed')}
              className="w-full px-4 py-3 bg-green-50 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-green-800">Signed Contracts</span>
                <span className="text-sm text-green-600">({signedProposals.length})</span>
              </div>
              <svg
                className={`w-5 h-5 text-green-600 transform transition-transform ${expandedSection === 'signed' ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSection === 'signed' && (
              <div className="divide-y divide-gray-100">
                {signedProposals.map((proposal) => (
                  <div key={proposal.id} className="px-4 py-3 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{proposal.name}</p>
                        <p className="text-xs text-gray-500">
                          Signed {signedProposal ? formatDate(signedProposal.signatureDate) : ''}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(proposal.name)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Proposals */}
        {sentProposals.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('proposals')}
              className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium text-gray-700">Proposals</span>
                <span className="text-sm text-gray-500">({sentProposals.length})</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedSection === 'proposals' ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSection === 'proposals' && (
              <div className="divide-y divide-gray-100">
                {sentProposals.map((proposal) => (
                  <div key={proposal.id} className="px-4 py-3 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{proposal.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(proposal.createdAt)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(proposal.name)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Drawings */}
        {drawings.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('drawings')}
              className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-gray-700">Drawings</span>
                <span className="text-sm text-gray-500">({drawings.length})</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedSection === 'drawings' ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSection === 'drawings' && (
              <div className="divide-y divide-gray-100">
                {drawings.map((drawing) => (
                  <div key={drawing.id} className="px-4 py-3 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{drawing.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(drawing.createdAt)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(drawing.name)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Photos */}
        {portalPhotos.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('photos')}
              className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-gray-700">Photos</span>
                <span className="text-sm text-gray-500">({portalPhotos.length})</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedSection === 'photos' ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSection === 'photos' && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-3 gap-2">
                  {portalPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setViewingPhoto(photo)}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={photo.dataUrl}
                        alt={photo.name || photo.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer Uploads */}
        {customerUploads.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('uploads')}
              className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="font-medium text-gray-700">Your Uploads</span>
                <span className="text-sm text-gray-500">({customerUploads.length})</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedSection === 'uploads' ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSection === 'uploads' && (
              <div className="divide-y divide-gray-100">
                {customerUploads.map((doc) => (
                  <div key={doc.id} className="px-4 py-3 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(doc.uploadedAt)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(doc.name)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Document Categories from Admin Settings */}
        {activeCategories.map((category) => {
          const categoryDocs = getDocumentsByCategory(category.name);
          if (categoryDocs.length === 0) return null;

          const sectionKey = `category_${category.id}`;
          return (
            <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(sectionKey)}
                className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-500">({categoryDocs.length})</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedSection === sectionKey ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === sectionKey && (
                <div className="divide-y divide-gray-100">
                  {categoryDocs.map((doc) => (
                    <div key={doc.id} className="px-4 py-3 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(doc.createdAt)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(doc.name)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Photo Viewing Modal */}
      {viewingPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setViewingPhoto(null)}
        >
          <button
            onClick={() => setViewingPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={viewingPhoto.dataUrl}
            alt={viewingPhoto.name || viewingPhoto.filename}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
