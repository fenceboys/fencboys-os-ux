import React, { useState } from 'react';
import { Button, Modal, Input } from '../ui';
import { useData } from '../../context/DataContext';
import { CustomerProjectModal } from '../dashboard/CustomerProjectModal';

// Tool definitions
const tools = [
  {
    id: 'drawings',
    name: 'Drawings',
    description: 'Create fence layouts and site drawings',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    color: 'bg-blue-100 text-blue-600',
    comingSoon: false,
  },
  {
    id: 'proposals',
    name: 'Proposals',
    description: 'Create and manage customer proposals',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'bg-purple-100 text-purple-600',
    comingSoon: false,
  },
  {
    id: 'pricing',
    name: 'Pricing',
    description: 'Calculate project costs and materials',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-green-100 text-green-600',
    comingSoon: true,
  },
  {
    id: 'documents',
    name: 'Documents',
    description: 'Manage project documents and files',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-orange-100 text-orange-600',
    comingSoon: false,
  },
  {
    id: 'photos',
    name: 'Photos',
    description: 'Upload and organize project photos',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-pink-100 text-pink-600',
    comingSoon: false,
  },
  {
    id: 'payments',
    name: 'Payments',
    description: 'View payment history and transactions',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    color: 'bg-emerald-100 text-emerald-600',
    comingSoon: false,
  },
];

// Mock data for gallery items
const mockDrawings = [
  { id: '1', name: 'Site Layout - Front Yard', createdAt: '2024-01-15', thumbnail: '/api/placeholder/200/150' },
  { id: '2', name: 'Backyard Fence Plan', createdAt: '2024-01-20', thumbnail: '/api/placeholder/200/150' },
  { id: '3', name: 'Property Survey Markup', createdAt: '2024-02-01', thumbnail: '/api/placeholder/200/150' },
];

const mockProposals = [
  { id: '1', name: 'Initial Quote - 6ft Cedar', createdAt: '2024-01-15', status: 'sent' },
  { id: '2', name: 'Revised Quote - 8ft Privacy', createdAt: '2024-01-22', status: 'accepted' },
  { id: '3', name: 'Add-on: Gate Installation', createdAt: '2024-02-05', status: 'draft' },
];

const mockPhotos = [
  { id: '1', name: 'Before - Front Yard', category: 'before', uploadedAt: '2024-01-10', thumbnail: '/api/placeholder/200/150' },
  { id: '2', name: 'Before - Backyard', category: 'before', uploadedAt: '2024-01-10', thumbnail: '/api/placeholder/200/150' },
  { id: '3', name: 'Progress - Day 1', category: 'progress', uploadedAt: '2024-02-01', thumbnail: '/api/placeholder/200/150' },
  { id: '4', name: 'Completed - Front', category: 'after', uploadedAt: '2024-02-15', thumbnail: '/api/placeholder/200/150' },
];

export const ToolsLanding: React.FC = () => {
  const { documentCategories, photoCategories, drawings, proposals, documents, photos, payments, getProjectById, getCustomerById } = useData();

  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const activeDocumentCategories = documentCategories.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const activePhotoCategories = photoCategories.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  const handleToolClick = (toolId: string) => {
    if (tools.find(t => t.id === toolId)?.comingSoon) return;
    setActiveTool(toolId);
    setSearchQuery('');
    setCategoryFilter('all');
  };

  const handleBackToGallery = () => {
    setActiveTool(null);
    setSelectedItem(null);
    setShowItemModal(false);
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const renderToolGallery = () => {
    switch (activeTool) {
      case 'drawings':
        const filteredDrawings = mockDrawings.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToGallery}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Drawings</h2>
                  <p className="text-sm text-gray-500">{filteredDrawings.length} drawings</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <Input
                    placeholder="Search drawings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-9"
                  />
                </div>
                <Button variant="primary" onClick={() => window.open('/drawing-tool/index.html', '_blank')}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Drawing
                </Button>
              </div>
            </div>

            {filteredDrawings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No drawings found' : 'No drawings yet'}
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  {searchQuery
                    ? `No drawings match "${searchQuery}". Try a different search term.`
                    : 'Create your first fence layout drawing to visualize projects for customers.'}
                </p>
                {!searchQuery && (
                  <Button variant="primary" onClick={() => window.open('/drawing-tool/index.html', '_blank')}>
                    Create First Drawing
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* New Drawing Card - Always First */}
                <div
                  onClick={() => window.open('/drawing-tool/index.html', '_blank')}
                  className="group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <div className="aspect-video flex flex-col items-center justify-center p-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">New Drawing</span>
                    <span className="text-xs text-gray-500 mt-1">Create fence layout</span>
                  </div>
                </div>

                {filteredDrawings.map((drawing) => (
                  <div
                    key={drawing.id}
                    onClick={() => handleItemClick(drawing)}
                    className="group cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{drawing.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(drawing.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open('/drawing-tool/index.html', '_blank');
                          }}
                          className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(drawing);
                          }}
                          className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'proposals':
        const filteredProposals = mockProposals.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        const proposalStats = {
          draft: mockProposals.filter(p => p.status === 'draft').length,
          sent: mockProposals.filter(p => p.status === 'sent').length,
          accepted: mockProposals.filter(p => p.status === 'accepted').length,
        };
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToGallery}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Proposals</h2>
                  <p className="text-sm text-gray-500">{filteredProposals.length} proposals</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <Input
                    placeholder="Search proposals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-9"
                  />
                </div>
                <Button variant="primary" onClick={() => window.open('/proposal-tool/index.html', '_blank')}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Proposal
                </Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span className="text-sm text-gray-600">{proposalStats.draft} Draft</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-sm text-blue-700">{proposalStats.sent} Sent</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm text-green-700">{proposalStats.accepted} Accepted</span>
              </div>
            </div>

            {filteredProposals.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No proposals found' : 'No proposals yet'}
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  {searchQuery
                    ? `No proposals match "${searchQuery}". Try a different search term.`
                    : 'Create your first customer proposal to start closing deals.'}
                </p>
                {!searchQuery && (
                  <Button variant="primary" onClick={() => window.open('/proposal-tool/index.html', '_blank')}>
                    Create First Proposal
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* New Proposal Card - Always First */}
                <div
                  onClick={() => window.open('/proposal-tool/index.html', '_blank')}
                  className="group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-purple-400 hover:bg-purple-50 transition-all"
                >
                  <div className="aspect-video flex flex-col items-center justify-center p-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">New Proposal</span>
                    <span className="text-xs text-gray-500 mt-1">Create quote</span>
                  </div>
                </div>

                {filteredProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    onClick={() => handleItemClick(proposal)}
                    className="group cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
                  >
                    <div className="aspect-video bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center relative">
                      <svg className="w-12 h-12 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium ${
                        proposal.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        proposal.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-gray-900 truncate group-hover:text-purple-600 transition-colors">{proposal.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(proposal.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open('/proposal-tool/index.html', '_blank');
                          }}
                          className="flex-1 px-3 py-2 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(proposal);
                          }}
                          className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'documents':
        // Use real documents with customer lookup
        const docsWithCustomer = documents.map(doc => {
          const project = getProjectById(doc.projectId);
          const customer = project ? getCustomerById(project.customerId) : null;
          return { ...doc, project, customer };
        });
        const filteredDocs = docsWithCustomer.filter(d => categoryFilter === 'all' || d.category === categoryFilter);
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToGallery}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Documents</h2>
                  <p className="text-sm text-gray-500">{filteredDocs.length} documents</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                >
                  <option value="all">All Categories</option>
                  {activeDocumentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <Button variant="primary" className="bg-orange-600 hover:bg-orange-700">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload
                </Button>
              </div>
            </div>

            {/* New Document Card */}
            <div className="mb-6">
              <div
                onClick={() => {/* trigger upload */}}
                className="inline-flex items-center gap-4 p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors block">New Document</span>
                  <span className="text-xs text-gray-500">Upload file</span>
                </div>
              </div>
            </div>

            {filteredDocs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Upload contracts, permits, and other important project files.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDocs.map((doc) => {
                      const getCustomerStatusBadge = (status: string | undefined) => {
                        const styles: Record<string, string> = {
                          lead: 'bg-yellow-100 text-yellow-700',
                          needs_qualifying: 'bg-orange-100 text-orange-700',
                          unqualified_lead: 'bg-gray-100 text-gray-700',
                          active: 'bg-green-100 text-green-700',
                          complete: 'bg-blue-100 text-blue-700',
                        };
                        const labels: Record<string, string> = {
                          lead: 'Lead',
                          needs_qualifying: 'Needs Qualifying',
                          unqualified_lead: 'Unqualified',
                          active: 'Active',
                          complete: 'Complete',
                        };
                        return status ? (
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
                            {labels[status] || status}
                          </span>
                        ) : <span className="text-gray-400">—</span>;
                      };

                      return (
                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <span className="font-medium text-gray-900">{doc.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {doc.customer ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCustomerId(doc.customer!.id);
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              >
                                {doc.customer.name}
                              </button>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {getCustomerStatusBadge(doc.customer?.status)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">{doc.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">View</button>
                              <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'photos':
        const filteredPhotos = mockPhotos.filter(p => categoryFilter === 'all' || p.category === categoryFilter);
        const photoCategories = Array.from(new Set(mockPhotos.map(p => p.category)));
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToGallery}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Photos</h2>
                  <p className="text-sm text-gray-500">{filteredPhotos.length} photos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
                >
                  <option value="all">All Categories</option>
                  {activePhotoCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <Button variant="primary" className="bg-pink-600 hover:bg-pink-700">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload
                </Button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({mockPhotos.length})
              </button>
              {photoCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                    categoryFilter === cat
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat} ({mockPhotos.filter(p => p.category === cat).length})
                </button>
              ))}
            </div>

            {filteredPhotos.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Upload before, during, and after photos to document project progress.
                </p>
                <Button variant="primary" className="bg-pink-600 hover:bg-pink-700">
                  Upload First Photo
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* New Photo Card - Always First */}
                <div
                  onClick={() => {/* trigger upload */}}
                  className="group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-pink-400 hover:bg-pink-50 transition-all aspect-square"
                >
                  <div className="h-full flex flex-col items-center justify-center p-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-pink-200 transition-colors">
                      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors text-sm">New Photo</span>
                    <span className="text-xs text-gray-500 mt-1">Upload image</span>
                  </div>
                </div>

                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative cursor-pointer rounded-xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all"
                    onClick={() => handleItemClick(photo)}
                  >
                    <div className="aspect-square bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p className="text-white text-sm font-medium truncate">{photo.name}</p>
                      <p className="text-white/70 text-xs capitalize">{photo.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'payments':
        // Use real payments with customer lookup
        const paymentsWithCustomer = payments.map(payment => {
          const project = getProjectById(payment.projectId);
          const customer = project ? getCustomerById(project.customerId) : null;
          // Calculate days since unpaid for awaiting payments
          const daysSinceUnpaid = payment.status === 'awaiting'
            ? Math.floor((Date.now() - new Date(payment.createdAt).getTime()) / (1000 * 60 * 60 * 24))
            : null;
          return { ...payment, project, customer, daysSinceUnpaid };
        });
        const totalReceived = paymentsWithCustomer.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
        const totalPending = paymentsWithCustomer.filter(p => p.status === 'awaiting').reduce((sum, p) => sum + p.amount, 0);
        const totalAmount = paymentsWithCustomer.reduce((sum, p) => sum + p.amount, 0);
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToGallery}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Payments</h2>
                  <p className="text-sm text-gray-500">{paymentsWithCustomer.length} transactions</p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-500">Total</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-green-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-green-600">Received</span>
                </div>
                <p className="text-2xl font-bold text-green-600">${totalReceived.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-orange-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-orange-600">Pending</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">${totalPending.toLocaleString()}</p>
              </div>
            </div>

            {paymentsWithCustomer.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Create invoices and track payments from customers.
                </p>
                <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700">
                  Create First Invoice
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Days Unpaid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paymentsWithCustomer.map((payment) => {
                      const getTypeLabel = (type: string) => {
                        const labels: Record<string, string> = {
                          deposit: 'Deposit',
                          final: 'Final Payment',
                          partial: 'Partial Payment',
                          refund: 'Refund',
                        };
                        return labels[type] || type;
                      };

                      const getStatusBadge = (status: string) => {
                        const styles: Record<string, string> = {
                          paid: 'bg-green-100 text-green-700',
                          awaiting: 'bg-orange-100 text-orange-700',
                          failed: 'bg-red-100 text-red-700',
                          refunded: 'bg-gray-100 text-gray-700',
                        };
                        const labels: Record<string, string> = {
                          paid: 'Paid',
                          awaiting: 'Awaiting',
                          failed: 'Failed',
                          refunded: 'Refunded',
                        };
                        return (
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
                            {labels[status] || status}
                          </span>
                        );
                      };

                      return (
                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">{new Date(payment.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            {payment.customer ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCustomerId(payment.customer!.id);
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              >
                                {payment.customer.name}
                              </button>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{getTypeLabel(payment.type)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">${payment.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {payment.daysSinceUnpaid !== null ? (
                              <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                payment.daysSinceUnpaid > 30 ? 'bg-red-100 text-red-700' :
                                payment.daysSinceUnpaid > 14 ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {payment.daysSinceUnpaid} days
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // If a tool is active, show its gallery view
  if (activeTool) {
    return (
      <div>
        {renderToolGallery()}

        {/* Item Modal for Drawings/Proposals/Photos */}
        <Modal
          isOpen={showItemModal}
          onClose={() => setShowItemModal(false)}
          title={selectedItem?.name || 'Item Details'}
        >
          <div className="space-y-6">
            <div className={`aspect-video rounded-xl flex items-center justify-center ${
              activeTool === 'drawings' ? 'bg-gradient-to-br from-blue-50 to-blue-100' :
              activeTool === 'proposals' ? 'bg-gradient-to-br from-purple-50 to-purple-100' :
              'bg-gradient-to-br from-pink-50 to-pink-100'
            }`}>
              {activeTool === 'drawings' && (
                <svg className="w-20 h-20 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              )}
              {activeTool === 'proposals' && (
                <svg className="w-20 h-20 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              {activeTool === 'photos' && (
                <svg className="w-20 h-20 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">{selectedItem?.name}</h3>
              <p className="text-sm text-gray-500">
                Created: {selectedItem?.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'Unknown'}
              </p>
              {selectedItem?.status && (
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                  selectedItem.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  selectedItem.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                </span>
              )}
              {selectedItem?.category && (
                <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                  {selectedItem.category}
                </span>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              {(activeTool === 'drawings' || activeTool === 'proposals') && (
                <Button
                  variant="primary"
                  className={activeTool === 'drawings' ? 'flex-1' : 'flex-1 bg-purple-600 hover:bg-purple-700'}
                  onClick={() => {
                    if (activeTool === 'drawings') {
                      window.open('/drawing-tool/index.html', '_blank');
                    } else if (activeTool === 'proposals') {
                      window.open('/proposal-tool/index.html', '_blank');
                    }
                    setShowItemModal(false);
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowItemModal(false)}
              >
                {activeTool === 'photos' ? 'Close' : 'View Only'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Customer Project Modal */}
        {selectedCustomerId && (
          <CustomerProjectModal
            customerId={selectedCustomerId}
            onClose={() => setSelectedCustomerId(null)}
          />
        )}
      </div>
    );
  }

  // Get counts for each tool
  const getToolCount = (toolId: string): number => {
    switch (toolId) {
      case 'drawings':
        return drawings?.length || 0;
      case 'proposals':
        return proposals?.length || 0;
      case 'documents':
        return documents?.length || 0;
      case 'photos':
        return photos?.length || 0;
      case 'payments':
        return payments?.length || 0;
      default:
        return 0;
    }
  };

  // Main tools gallery view
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tools</h1>
        <p className="text-gray-500 mt-2">
          Access project tools and resources to manage your fence business
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{drawings?.length || 0}</p>
              <p className="text-xs text-gray-500">Drawings</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{proposals?.length || 0}</p>
              <p className="text-xs text-gray-500">Proposals</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{documents?.length || 0}</p>
              <p className="text-xs text-gray-500">Documents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{photos?.length || 0}</p>
              <p className="text-xs text-gray-500">Photos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const count = getToolCount(tool.id);
          return (
            <div
              key={tool.id}
              onClick={() => !tool.comingSoon && handleToolClick(tool.id)}
              className={`relative group ${tool.comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className={`
                bg-white rounded-xl border border-gray-200 p-6
                transition-all duration-200
                ${!tool.comingSoon && 'hover:shadow-lg hover:border-gray-300 hover:-translate-y-1'}
              `}>
                {tool.comingSoon && (
                  <div className="absolute inset-0 bg-white/70 rounded-xl z-10 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      Coming Soon
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${tool.color}`}>
                    {tool.icon}
                  </div>
                  {count > 0 && !tool.comingSoon && (
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>

                {!tool.comingSoon && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Open {tool.name}
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Project Modal */}
      {selectedCustomerId && (
        <CustomerProjectModal
          customerId={selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
        />
      )}
    </div>
  );
};
