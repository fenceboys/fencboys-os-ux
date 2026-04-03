import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout, PageHeader } from '../../layout';
import { useData } from '../../../context/DataContext';
import { Document } from '../../../types';
import { DocumentDetailModal } from './DocumentDetailModal';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'contract', label: 'Contract' },
  { value: 'permit', label: 'Permit' },
  { value: 'hoa', label: 'HOA' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'other', label: 'Other' },
];

const FILE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'pdf', label: 'PDF' },
  { value: 'image', label: 'Image' },
  { value: 'doc', label: 'Document' },
];

export const DocumentsTool: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, getCustomerById, getDocumentsByProjectId, addDocument, deleteDocument, updateDocument } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const project = getProjectById(projectId || '');
  const customer = project ? getCustomerById(project.customerId) : null;
  const documents = getDocumentsByProjectId(projectId || '');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || doc.category === categoryFilter;
    const matchesType = !typeFilter || doc.fileType === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !projectId) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileType = file.type.includes('pdf') ? 'pdf' :
                        file.type.includes('image') ? 'image' : 'doc';

        addDocument({
          projectId,
          name: file.name,
          category: 'other',
          fileType: fileType as 'pdf' | 'image' | 'doc',
          dataUrl: reader.result as string,
          fileSize: file.size,
          inPortal: false,
          uploadSource: 'team',
        });
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-700';
      case 'image': return 'bg-blue-100 text-blue-700';
      case 'doc': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'proposal': return 'bg-purple-100 text-purple-700';
      case 'contract': return 'bg-green-100 text-green-700';
      case 'permit': return 'bg-blue-100 text-blue-700';
      case 'hoa': return 'bg-orange-100 text-orange-700';
      case 'invoice': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!projectId || !project) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Project not found</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span>Documents</span>
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
              {customer?.name}
            </span>
          </div>
        }
        subtitle={`${project.address} • ${documents.length} document${documents.length !== 1 ? 's' : ''}`}
        backLink={{ label: 'Back to Project', to: `/projects/${projectId}` }}
        actions={
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] max-w-md relative">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {FILE_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* New Document Card - Always First */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[200px]"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">New Document</span>
            <span className="text-xs text-gray-500 mt-1">Upload file</span>
          </div>

          {/* Existing Documents */}
          {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                onClick={() => setSelectedDocument(doc)}
              >
                {/* In Portal Badge */}
                {doc.inPortal && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    In Portal
                  </span>
                )}

                {/* Document Icon */}
                <div className="flex justify-center mb-3 pt-2">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Document Name */}
                <p className="text-sm font-medium text-gray-900 truncate mb-2" title={doc.name}>
                  {doc.name}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${getFileTypeColor(doc.fileType)}`}>
                    {doc.fileType.toUpperCase()}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${getCategoryColor(doc.category)}`}>
                    {doc.category}
                  </span>
                </div>

                {/* Upload Source Badge */}
                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                  doc.uploadSource === 'team' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                }`}>
                  {doc.uploadSource === 'team' ? 'Team Uploaded' : 'Customer Uploaded'}
                </span>

                {/* Date & Customer */}
                <p className="text-xs text-gray-500 mt-2">{customer?.name} • {formatDate(doc.createdAt)}</p>

                {/* View Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDocument(doc);
                  }}
                  className="w-full mt-3 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <DocumentDetailModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onUpdate={(updates) => {
            updateDocument(selectedDocument.id, updates);
            setSelectedDocument({ ...selectedDocument, ...updates });
          }}
          onDelete={() => {
            deleteDocument(selectedDocument.id);
            setSelectedDocument(null);
          }}
        />
      )}
    </PageLayout>
  );
};
