import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Proposal, SignatureField, ProposalAttachment } from '../../types';
import { PDFSignatureEditor } from './PDFSignatureEditor';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string; // Optional - if not provided, show customer/project selection
}

type UploadStep = 'upload' | 'signature' | 'pricing';

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  projectId: initialProjectId,
}) => {
  const { getProposalsByProjectId, addProposal, updateProposal, deleteProposal, customers, projects, getProjectsByCustomerId } = useData();

  // Customer/Project selection state (for when no projectId is provided)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || '');

  // Use selected project or initial project
  const projectId = selectedProjectId || initialProjectId || '';
  const proposals = projectId ? getProposalsByProjectId(projectId) : [];

  // Get projects for selected customer
  const customerProjects = selectedCustomerId ? getProjectsByCustomerId(selectedCustomerId) : [];

  // Demo customer ID for highlighting
  const DEMO_CUSTOMER_ID = 'cust_demo';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const manualFileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // Upload flow state
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [uploadStep, setUploadStep] = useState<UploadStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [signatureField, setSignatureField] = useState<SignatureField | undefined>(undefined);
  const [proposalName, setProposalName] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  // Manual upload flow state
  const [showManualUploadFlow, setShowManualUploadFlow] = useState(false);
  const [manualUploadedFile, setManualUploadedFile] = useState<File | null>(null);
  const [manualPdfDataUrl, setManualPdfDataUrl] = useState<string | null>(null);
  const [manualProposalName, setManualProposalName] = useState('');
  const [manualTotalPrice, setManualTotalPrice] = useState('');
  const [manualDepositAmount, setManualDepositAmount] = useState('');

  // Attachment upload state
  const [attachingToProposal, setAttachingToProposal] = useState<Proposal | null>(null);

  // Edit state
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [showSignatureEditor, setShowSignatureEditor] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<Proposal | null>(null);

  if (!isOpen) return null;

  const resetUploadFlow = () => {
    setShowUploadFlow(false);
    setUploadStep('upload');
    setUploadedFile(null);
    setPdfDataUrl(null);
    setSignatureField(undefined);
    setProposalName('');
    setTotalPrice('');
    setDepositAmount('');
    setEditingProposal(null);
    setShowSignatureEditor(false);
  };

  const resetManualUploadFlow = () => {
    setShowManualUploadFlow(false);
    setManualUploadedFile(null);
    setManualPdfDataUrl(null);
    setManualProposalName('');
    setManualTotalPrice('');
    setManualDepositAmount('');
  };

  const handleManualFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setManualUploadedFile(file);
      if (!manualProposalName) {
        setManualProposalName(file.name.replace('.pdf', ''));
      }
      const reader = new FileReader();
      reader.onload = () => {
        setManualPdfDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setManualUploadedFile(file);
      if (!manualProposalName) {
        setManualProposalName(file.name.replace('.pdf', ''));
      }
      const reader = new FileReader();
      reader.onload = () => {
        setManualPdfDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualSubmit = () => {
    if (!manualProposalName || !manualPdfDataUrl) return;

    const total = manualTotalPrice ? parseFloat(manualTotalPrice) : 0;
    const deposit = manualDepositAmount ? parseFloat(manualDepositAmount) : total * 0.5;

    addProposal({
      projectId,
      name: manualProposalName,
      total,
      depositAmount: deposit,
      pdfData: manualPdfDataUrl,
      pdfFileName: manualUploadedFile?.name || 'manual-proposal.pdf',
      isManual: true,
      status: 'draft',
    });

    resetManualUploadFlow();
  };

  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && attachingToProposal) {
      const reader = new FileReader();
      reader.onload = () => {
        const newAttachment: ProposalAttachment = {
          id: Date.now().toString(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          dataUrl: reader.result as string,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
        };

        const existingAttachments = attachingToProposal.attachments || [];
        updateProposal(attachingToProposal.id, {
          attachments: [...existingAttachments, newAttachment],
        });

        setAttachingToProposal(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = (proposalId: string, attachmentId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal && proposal.attachments) {
      updateProposal(proposalId, {
        attachments: proposal.attachments.filter(a => a.id !== attachmentId),
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      if (!proposalName) {
        setProposalName(file.name.replace('.pdf', ''));
      }
      // Convert to data URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setPdfDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      if (!proposalName) {
        setProposalName(file.name.replace('.pdf', ''));
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPdfDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleContinueToSignature = () => {
    if (uploadedFile && pdfDataUrl) {
      setUploadStep('signature');
    }
  };

  const handleSignatureSave = () => {
    setUploadStep('pricing');
  };

  const handleFinalSubmit = (sendToPortal: boolean = false) => {
    if (!proposalName || !totalPrice) return;

    const total = parseFloat(totalPrice);
    const deposit = depositAmount ? parseFloat(depositAmount) : total * 0.5;

    if (editingProposal) {
      // Update existing proposal
      updateProposal(editingProposal.id, {
        name: proposalName,
        total,
        depositAmount: deposit,
        signatureField,
        status: sendToPortal ? 'sent' : 'draft',
      });
    } else {
      // Create new proposal
      addProposal({
        projectId,
        name: proposalName,
        total,
        depositAmount: deposit,
        pdfData: pdfDataUrl || undefined,
        pdfFileName: uploadedFile?.name || 'proposal.pdf',
        signatureField,
        status: sendToPortal ? 'sent' : 'draft',
      });
    }

    resetUploadFlow();
  };

  const handleEditProposal = (proposal: Proposal) => {
    setEditingProposal(proposal);
    setProposalName(proposal.name);
    setTotalPrice(proposal.total.toString());
    setDepositAmount(proposal.depositAmount?.toString() || '');
    setSignatureField(proposal.signatureField);
    setPdfDataUrl(proposal.pdfData || null);
  };

  const handleUpdateProposal = () => {
    if (!editingProposal || !proposalName || !totalPrice) return;

    const total = parseFloat(totalPrice);
    const deposit = depositAmount ? parseFloat(depositAmount) : total * 0.5;

    updateProposal(editingProposal.id, {
      name: proposalName,
      total,
      depositAmount: deposit,
      signatureField,
    });

    resetUploadFlow();
  };

  const handleEditSignatureField = (proposal: Proposal) => {
    setEditingProposal(proposal);
    setPdfDataUrl(proposal.pdfData || null);
    setSignatureField(proposal.signatureField);
    setShowSignatureEditor(true);
  };

  const handleSaveEditedSignature = () => {
    if (editingProposal) {
      updateProposal(editingProposal.id, { signatureField });
    }
    setShowSignatureEditor(false);
    setEditingProposal(null);
    setPdfDataUrl(null);
    setSignatureField(undefined);
  };

  const handleDeleteProposal = (proposalId: string) => {
    if (window.confirm('Are you sure you want to delete this proposal?')) {
      deleteProposal(proposalId);
    }
  };

  const handleSetupProposal = (proposal: Proposal) => {
    setEditingProposal(proposal);
    setProposalName(proposal.name);
    setTotalPrice(proposal.total > 0 ? proposal.total.toString() : '');
    setDepositAmount(proposal.depositAmount?.toString() || '');
    setSignatureField(proposal.signatureField);
    setPdfDataUrl(proposal.pdfData || null);
    setShowUploadFlow(true);
    // Existing proposals have PDFs - go directly to signature step
    setUploadStep('signature');
  };

  const handleSendToPortal = (proposal: Proposal) => {
    if (!proposal.signatureField) {
      alert('Please add a signature field before sending to portal');
      handleEditSignatureField(proposal);
      return;
    }
    updateProposal(proposal.id, { status: 'sent' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: Proposal['status']) => {
    const styles = {
      draft: 'bg-amber-100 text-amber-700',
      sent: 'bg-blue-100 text-blue-600',
      viewed: 'bg-yellow-100 text-yellow-600',
      signed: 'bg-blue-100 text-blue-600',
      rejected: 'bg-red-100 text-red-600',
    };
    const labels = {
      draft: 'Needs to be Uploaded',
      sent: 'Uploaded to Portal',
      viewed: 'Viewed',
      signed: 'Uploaded to Portal',
      rejected: 'Rejected',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getSignatureBadge = (status: Proposal['status']) => {
    if (status === 'signed') {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
          Signed
        </span>
      );
    }
    if (status === 'sent') {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
          Unsigned
        </span>
      );
    }
    return null;
  };

  // Show signature editor for editing existing proposal
  if (showSignatureEditor && pdfDataUrl) {
    return (
      <PDFSignatureEditor
        pdfData={pdfDataUrl}
        signatureField={signatureField}
        onSignatureFieldChange={setSignatureField}
        onClose={() => {
          setShowSignatureEditor(false);
          setEditingProposal(null);
          setPdfDataUrl(null);
          setSignatureField(undefined);
        }}
        onSave={handleSaveEditedSignature}
      />
    );
  }

  // Upload flow - Signature step (with PDF)
  if (showUploadFlow && uploadStep === 'signature' && pdfDataUrl) {
    return (
      <PDFSignatureEditor
        pdfData={pdfDataUrl}
        signatureField={signatureField}
        onSignatureFieldChange={setSignatureField}
        onClose={resetUploadFlow}
        onSave={handleSignatureSave}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {editingProposal
                ? 'Edit Proposal'
                : showManualUploadFlow
                ? 'Upload Manual Proposal'
                : showUploadFlow
                ? uploadStep === 'upload'
                  ? 'Upload Proposal'
                  : 'Set Pricing'
                : 'Proposals'}
            </h3>
            {/* Show selected customer/project in header */}
            {!initialProjectId && selectedCustomerId && (
              <p className="text-sm text-gray-500 mt-0.5">
                {customers.find(c => c.id === selectedCustomerId)?.name}
                {selectedProjectId && ` → ${projects.find(p => p.id === selectedProjectId)?.name}`}
              </p>
            )}
          </div>
          <button
            onClick={showManualUploadFlow ? resetManualUploadFlow : showUploadFlow || editingProposal ? resetUploadFlow : onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Flow - Step 1: Upload */}
          {showUploadFlow && uploadStep === 'upload' && (
            <div className="space-y-4">
              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">1</div>
                  <span className="ml-2 text-sm font-medium text-gray-900">{editingProposal ? 'Add PDF' : 'Upload'}</span>
                </div>
                <div className="w-8 h-px bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">2</div>
                  <span className="ml-2 text-sm text-gray-500">Signature</span>
                </div>
                <div className="w-8 h-px bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">3</div>
                  <span className="ml-2 text-sm text-gray-500">Pricing</span>
                </div>
              </div>

              {/* Header for existing proposal */}
              {editingProposal && (
                <div className="text-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Add PDF to Proposal</h4>
                  <p className="text-sm text-gray-500 mt-1">{proposalName}</p>
                </div>
              )}

              {/* File Upload */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${uploadedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">Click to change file</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600">Drag and drop a PDF or click to browse</p>
                    <p className="text-sm text-gray-400 mt-1">PDF files only</p>
                  </>
                )}
              </div>

              {/* Proposal Name - only show for new proposals */}
              {!editingProposal && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposal Name
                  </label>
                  <input
                    type="text"
                    value={proposalName}
                    onChange={(e) => setProposalName(e.target.value)}
                    placeholder="e.g., Cedar Fence Installation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetUploadFlow}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinueToSignature}
                  disabled={!uploadedFile || !proposalName}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Upload Flow - Step 3: Pricing */}
          {showUploadFlow && uploadStep === 'pricing' && (
            <div className="space-y-4">
              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-2 text-sm text-gray-500">{editingProposal ? 'PDF' : 'Upload'}</span>
                </div>
                <div className="w-8 h-px bg-gray-300"></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${signatureField ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {signatureField ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : '2'}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">Signature</span>
                </div>
                <div className="w-8 h-px bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">3</div>
                  <span className="ml-2 text-sm font-medium text-gray-900">Pricing</span>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">Set Pricing</h4>
                <p className="text-sm text-gray-500 mt-1">{proposalName}</p>
              </div>

              {/* Total Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                    placeholder="1500.00"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Deposit Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deposit Amount (50% default)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder={totalPrice ? (parseFloat(totalPrice) * 0.5).toFixed(2) : '750.00'}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This is the amount that will be charged via Stripe when the customer pays the deposit.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {pdfDataUrl && (
                  <button
                    onClick={() => setUploadStep('signature')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                )}
                <button
                  onClick={resetUploadFlow}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleFinalSubmit(false)}
                  disabled={!totalPrice}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleFinalSubmit(true)}
                  disabled={!totalPrice}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send to Portal
                </button>
              </div>
            </div>
          )}

          {/* Edit Proposal Form - only show when not in upload flow */}
          {editingProposal && !showSignatureEditor && !showUploadFlow && (
            <div className="space-y-4">
              {/* Signature field status */}
              {editingProposal.pdfData && (
                <div className={`border rounded-lg p-3 flex items-center gap-3 ${editingProposal.signatureField ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  {editingProposal.signatureField ? (
                    <>
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-green-800">Signature field on page {editingProposal.signatureField.page}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-sm text-yellow-800">No signature field placed</span>
                    </>
                  )}
                  <button
                    onClick={() => handleEditSignatureField(editingProposal)}
                    className="ml-auto text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {editingProposal.signatureField ? 'Edit' : 'Add'}
                  </button>
                </div>
              )}

              {/* Proposal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposal Name
                </label>
                <input
                  type="text"
                  value={proposalName}
                  onChange={(e) => setProposalName(e.target.value)}
                  placeholder="e.g., Cedar Fence Installation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Total Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                    placeholder="1500.00"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Deposit Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deposit Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder={totalPrice ? (parseFloat(totalPrice) * 0.5).toFixed(2) : '750.00'}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetUploadFlow}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProposal}
                  disabled={!proposalName || !totalPrice}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Update Proposal
                </button>
              </div>
            </div>
          )}

          {/* Manual Upload Flow */}
          {showManualUploadFlow && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Upload Manual Proposal</h4>
                  <p className="text-sm text-gray-500">For handwritten or paper proposals (no portal signing)</p>
                </div>
              </div>

              {/* File Upload */}
              <div
                onDrop={handleManualDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => manualFileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${manualUploadedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'}
                `}
              >
                <input
                  ref={manualFileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleManualFileSelect}
                  className="hidden"
                />
                {manualUploadedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">{manualUploadedFile.name}</p>
                      <p className="text-sm text-gray-500">Click to change file</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600">Drag and drop a scanned proposal or click to browse</p>
                    <p className="text-sm text-gray-400 mt-1">PDF files only</p>
                  </>
                )}
              </div>

              {/* Proposal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposal Name *
                </label>
                <input
                  type="text"
                  value={manualProposalName}
                  onChange={(e) => setManualProposalName(e.target.value)}
                  placeholder="e.g., Johnson Fence - Handwritten"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Optional Pricing */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-3">Pricing (Optional)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Total Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={manualTotalPrice}
                        onChange={(e) => setManualTotalPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Deposit Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={manualDepositAmount}
                        onChange={(e) => setManualDepositAmount(e.target.value)}
                        placeholder={manualTotalPrice ? (parseFloat(manualTotalPrice) * 0.5).toFixed(2) : '0.00'}
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 bg-amber-50 p-3 rounded-lg">
                <strong>Note:</strong> Manual proposals are for record-keeping only. They won't appear in the customer portal for digital signing. You can attach additional documents after uploading.
              </p>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetManualUploadFlow}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualSubmit}
                  disabled={!manualUploadedFile || !manualProposalName}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Upload Manual Proposal
                </button>
              </div>
            </div>
          )}

          {/* Proposal List View */}
          {!showUploadFlow && !showManualUploadFlow && !editingProposal && (
            <div className="space-y-4">
              {/* Customer/Project Selection - only show when no initialProjectId */}
              {!initialProjectId && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium text-blue-900">Assign to Customer & Project</span>
                  </div>

                  {/* Customer Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => {
                        setSelectedCustomerId(e.target.value);
                        setSelectedProjectId(''); // Reset project when customer changes
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="">Select a customer...</option>
                      {/* Demo customer first with highlight */}
                      {customers.filter(c => c.id === DEMO_CUSTOMER_ID).map(customer => (
                        <option key={customer.id} value={customer.id} className="font-medium">
                          ⭐ {customer.name} (Demo)
                        </option>
                      ))}
                      <option disabled>──────────────</option>
                      {/* Other customers */}
                      {customers.filter(c => c.id !== DEMO_CUSTOMER_ID).map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project Dropdown - only show when customer is selected */}
                  {selectedCustomerId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="">Select a project...</option>
                        {customerProjects.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.name} - {project.status.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                      {customerProjects.length === 0 && (
                        <p className="text-sm text-amber-600 mt-1">No projects found for this customer</p>
                      )}
                    </div>
                  )}

                  {/* Info message */}
                  {selectedCustomerId === DEMO_CUSTOMER_ID && (
                    <div className="flex items-start gap-2 text-sm text-blue-700 bg-blue-100 p-2 rounded">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Demo customer selected - great for testing the full workflow!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Button - only enable when project is selected */}
              <button
                onClick={() => setShowUploadFlow(true)}
                disabled={!projectId}
                className={`w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg transition-colors ${
                  projectId
                    ? 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                }`}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="text-sm font-medium">Upload Proposal</span>
                <span className="text-xs text-gray-400">
                  {projectId ? 'Add PDF, signature field & pricing' : 'Select a customer and project first'}
                </span>
              </button>

              {/* Hidden attachment input */}
              <input
                ref={attachmentInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleAttachmentSelect}
                className="hidden"
              />

              {/* Proposals List */}
              {projectId && proposals.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
                    Existing Proposals
                  </h4>
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{proposal.name}</h5>
                        {proposal.isManual && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            Manual
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        {proposal.total > 0 && (
                          <>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(proposal.total)}
                            </span>
                            <span>•</span>
                            <span>Deposit: {formatCurrency(proposal.depositAmount || proposal.total * 0.5)}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{formatDate(proposal.createdAt)}</span>
                      </div>

                      {/* Attachments */}
                      {proposal.attachments && proposal.attachments.length > 0 && (
                        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-500 mb-2">Attached Documents:</p>
                          <div className="space-y-1">
                            {proposal.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700 truncate">{attachment.name}</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = attachment.dataUrl;
                                      link.download = attachment.fileName;
                                      link.click();
                                    }}
                                    className="p-1 text-gray-400 hover:text-blue-600"
                                    title="Download"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleRemoveAttachment(proposal.id, attachment.id)}
                                    className="p-1 text-gray-400 hover:text-red-600"
                                    title="Remove"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center flex-wrap gap-2 pt-3 border-t border-gray-100">
                        {getStatusBadge(proposal.status)}
                        {!proposal.isManual && getSignatureBadge(proposal.status)}
                        {proposal.status === 'draft' && !proposal.isManual && (
                          <button
                            onClick={() => handleSetupProposal(proposal)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Set Up for Portal
                          </button>
                        )}
                        <button
                          onClick={() => handleEditProposal(proposal)}
                          className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        {proposal.pdfData && (
                          <button
                            onClick={() => setViewingPdf(proposal)}
                            className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                          >
                            View
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setAttachingToProposal(proposal);
                            attachmentInputRef.current?.click();
                          }}
                          className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                        >
                          Attach Doc
                        </button>
                        <button
                          onClick={() => handleDeleteProposal(proposal.id)}
                          className="px-3 py-1.5 text-red-600 border border-red-200 text-sm rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : projectId ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No proposals yet</p>
                  <p className="text-sm">Upload a proposal to send to the customer portal</p>
                </div>
              ) : !initialProjectId ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  <p>Select a customer and project above</p>
                  <p className="text-sm">Then you can create or view proposals</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{viewingPdf.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = viewingPdf.pdfData!;
                    link.download = viewingPdf.pdfFileName || 'proposal.pdf';
                    link.click();
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Download
                </button>
                <button
                  onClick={() => setViewingPdf(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <iframe
                src={viewingPdf.pdfData}
                className="w-full h-[70vh] border-0 rounded shadow"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
