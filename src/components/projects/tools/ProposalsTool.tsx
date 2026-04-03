import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout, PageHeader } from '../../layout';
import { useData } from '../../../context/DataContext';
import { Proposal } from '../../../types';
import { ProposalModal } from '../ProposalModal';

export const ProposalsTool: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, getCustomerById, getProposalsByProjectId, updateProposal, deleteProposal } = useData();

  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [viewingProposal, setViewingProposal] = useState<Proposal | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const project = getProjectById(projectId || '');
  const customer = project ? getCustomerById(project.customerId) : null;
  const proposals = getProposalsByProjectId(projectId || '');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: Proposal['status']) => {
    const styles: Record<Proposal['status'], { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sent' },
      viewed: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Viewed' },
      signed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Signed' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
    };
    const style = styles[status];
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const handleCreateNew = () => {
    window.open('/proposal-tool/index.html', '_blank');
  };

  const handleEdit = () => {
    window.open('/proposal-tool/index.html', '_blank');
    setSelectedProposal(null);
  };

  const handleStartRename = () => {
    if (selectedProposal) {
      setNewName(selectedProposal.name);
      setIsRenaming(true);
    }
  };

  const handleSaveRename = () => {
    if (selectedProposal && newName.trim()) {
      updateProposal(selectedProposal.id, { name: newName.trim() });
      setSelectedProposal({ ...selectedProposal, name: newName.trim() });
      setIsRenaming(false);
    }
  };

  const handleCancelRename = () => {
    setIsRenaming(false);
    setNewName('');
  };

  const handleDelete = () => {
    if (selectedProposal && window.confirm(`Are you sure you want to delete "${selectedProposal.name}"?`)) {
      deleteProposal(selectedProposal.id);
      setSelectedProposal(null);
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
            <span>Proposals</span>
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
              {customer?.name}
            </span>
          </div>
        }
        subtitle={`${project.address} • ${proposals.length} proposal${proposals.length !== 1 ? 's' : ''}`}
        backLink={{ label: 'Back to Project', to: `/projects/${projectId}` }}
      />

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Upload to Portal Card */}
        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-4 p-5 bg-white border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
        >
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-base font-semibold text-gray-900 group-hover:text-blue-600 block">Upload Proposal to Portal</span>
            <span className="text-sm text-gray-500">Add PDF, signature field & pricing</span>
          </div>
        </button>

        {/* Create New Card */}
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-4 p-5 bg-white border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
        >
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors flex-shrink-0">
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-base font-semibold text-gray-900 group-hover:text-purple-600 block">Create New Proposal</span>
            <span className="text-sm text-gray-500">Open proposal editor tool</span>
          </div>
        </button>
      </div>

      {/* Gallery Section */}
      {proposals.length > 0 && (
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Uploaded Proposals
        </h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Proposal Cards */}
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            onClick={() => setSelectedProposal(proposal)}
            className="flex flex-col bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all cursor-pointer overflow-hidden min-h-[200px]"
          >
            {/* Preview Area */}
            <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100">
              <div className="w-16 h-20 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            {/* Info Area */}
            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-medium text-gray-900 truncate flex-1">{proposal.name}</h3>
                {getStatusBadge(proposal.status)}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium text-gray-900">{formatCurrency(proposal.total)}</span>
                <span>{customer?.name}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{formatDate(proposal.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State - Only show if no proposals */}
      {proposals.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="font-medium text-gray-600">No proposals uploaded yet</p>
          <p className="text-sm mt-1">Upload a proposal to the portal or create a new one above</p>
        </div>
      )}

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  {isRenaming ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-lg font-semibold text-gray-900 border border-blue-500 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename();
                        if (e.key === 'Escape') handleCancelRename();
                      }}
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-900">{selectedProposal.name}</h3>
                  )}
                  <p className="text-sm text-gray-500">Created {formatDate(selectedProposal.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedProposal(null);
                  setIsRenaming(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Status & Amount */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  {getStatusBadge(selectedProposal.status)}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Total</p>
                  <p className="text-xl font-semibold text-gray-900">{formatCurrency(selectedProposal.total)}</p>
                </div>
              </div>

              {selectedProposal.depositAmount && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Deposit Amount</p>
                  <p className="text-sm font-medium text-gray-700">{formatCurrency(selectedProposal.depositAmount)}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 space-y-3">
              {isRenaming ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelRename}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveRename}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Save Name
                  </button>
                </div>
              ) : (
                <>
                  {/* View, Edit, Delete on same row */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setViewingProposal(selectedProposal);
                        setSelectedProposal(null);
                      }}
                      className="flex-1 px-3 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium flex items-center justify-center gap-1.5 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button
                      onClick={handleEdit}
                      className="flex-1 px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-1.5 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 px-3 py-2.5 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 font-medium flex items-center justify-center gap-1.5 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                  {/* Rename on separate row */}
                  <button
                    onClick={handleStartRename}
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Rename
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {viewingProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[90vh] mx-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">{viewingProposal.name}</h3>
              <button
                onClick={() => setViewingProposal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              {viewingProposal.pdfData ? (
                <iframe
                  src={viewingProposal.pdfData}
                  className="w-full h-full rounded border border-gray-200"
                  title={viewingProposal.name}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">No PDF Available</p>
                  <p className="text-sm">This proposal doesn't have a PDF attached yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Proposal Modal */}
      <ProposalModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        projectId={projectId || ''}
      />
    </PageLayout>
  );
};
