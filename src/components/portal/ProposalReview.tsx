import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SignatureModal } from './SignatureModal';
import { Proposal } from '../../types';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// CSS to fix react-pdf rendering issues
const pdfStyles = `
  .react-pdf__Page {
    position: relative !important;
  }
  .react-pdf__Page canvas {
    display: block !important;
  }
  .react-pdf__Page__textContent,
  .react-pdf__Page__annotations {
    display: none !important;
  }
`;

interface ProposalReviewProps {
  isOpen: boolean;
  onClose: () => void;
  proposals: Proposal[];
  customerName: string;
  onSign: (signature: string, proposalId: string) => void;
}

export const ProposalReview: React.FC<ProposalReviewProps> = ({
  isOpen,
  onClose,
  proposals,
  customerName,
  onSign,
}) => {
  const [showSignature, setShowSignature] = useState(false);
  const [showSignConfirmation, setShowSignConfirmation] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentProposalIndex, setCurrentProposalIndex] = useState(0);

  // Filter to only show sent proposals (not drafts)
  const sentProposals = proposals.filter(p => p.status !== 'draft');
  const proposal = sentProposals[currentProposalIndex];

  // Reset to first proposal when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentProposalIndex(0);
      setCurrentPage(1);
    }
  }, [isOpen]);

  if (!proposal || sentProposals.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Proposal" size="lg">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600">No proposal available yet.</p>
        </div>
      </Modal>
    );
  }

  const handleDownload = () => {
    if (proposal.pdfData) {
      const link = document.createElement('a');
      link.href = proposal.pdfData;
      link.download = proposal.pdfFileName || 'proposal.pdf';
      link.click();
    }
  };

  const handleSign = (signature: string) => {
    setShowSignature(false);
    onSign(signature, proposal.id);
    // Close immediately after signing - only one proposal can be signed
    onClose();
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    // If there's a signature field, go to that page
    if (proposal.signatureField) {
      setCurrentPage(proposal.signatureField.page);
    }
  };

  const depositAmount = proposal.depositAmount || proposal.total * 0.5;
  const showSignatureOnCurrentPage = proposal.signatureField && proposal.signatureField.page === currentPage;
  const hasMultipleProposals = sentProposals.length > 1;
  const anyProposalSigned = sentProposals.some(p => p.status === 'signed');
  const thisProposalSigned = proposal.status === 'signed';

  const handleSignClick = () => {
    if (hasMultipleProposals) {
      setShowSignConfirmation(true);
    } else {
      setShowSignature(true);
    }
  };

  const confirmAndSign = () => {
    setShowSignConfirmation(false);
    setShowSignature(true);
  };

  return (
    <>
      <style>{pdfStyles}</style>
      <Modal isOpen={isOpen} onClose={onClose} title="Review Your Proposal" size="xl">
        <div className="space-y-6">
          {/* Multi-proposal Warning Banner */}
          {sentProposals.length > 1 && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-amber-800">
                <strong>You have {sentProposals.length} proposal options.</strong> Review each one carefully before signing.
              </p>
            </div>
          )}

          {/* Proposal Summary Header */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
            {/* Navigation above title - left aligned */}
            {sentProposals.length > 1 && (
              <div className="flex items-center gap-1 mb-4 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 w-fit">
                <button
                  onClick={() => {
                    setCurrentProposalIndex(Math.max(0, currentProposalIndex - 1));
                    setCurrentPage(1);
                  }}
                  disabled={currentProposalIndex === 0}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-base font-semibold text-blue-800 px-2">
                  Proposal {currentProposalIndex + 1} of {sentProposals.length}
                </span>
                <button
                  onClick={() => {
                    setCurrentProposalIndex(Math.min(sentProposals.length - 1, currentProposalIndex + 1));
                    setCurrentPage(1);
                  }}
                  disabled={currentProposalIndex === sentProposals.length - 1}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{proposal.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Created {new Date(proposal.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${proposal.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Deposit: ${depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* PDF Viewer with Signature Field */}
            {proposal.pdfData ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Page Navigation */}
                {numPages > 1 && (
                  <div className="flex items-center justify-center gap-4 py-2 bg-gray-100 border-b border-gray-200">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {numPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                      disabled={currentPage === numPages}
                      className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {proposal.signatureField && proposal.signatureField.page !== currentPage && (
                      <button
                        onClick={() => setCurrentPage(proposal.signatureField!.page)}
                        className="ml-2 text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Go to signature
                      </button>
                    )}
                  </div>
                )}

                {/* PDF Page with Signature Overlay */}
                <div className="flex justify-center overflow-auto max-h-[500px] bg-gray-200 p-4">
                  <div className="relative bg-white shadow-lg">
                    <Document
                      file={proposal.pdfData}
                      onLoadSuccess={onDocumentLoadSuccess}
                      loading={
                        <div className="flex items-center justify-center h-[600px] w-[500px]">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      }
                    >
                      <Page
                        key={`page_${currentPage}`}
                        pageNumber={currentPage}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        width={550}
                      />
                    </Document>

                    {/* Signature Field Overlay */}
                    {showSignatureOnCurrentPage && (
                      thisProposalSigned ? (
                        <div
                          className="absolute border-2 border-solid border-green-500 bg-green-50 bg-opacity-90 flex flex-col items-center justify-center"
                          style={{
                            left: proposal.signatureField!.x * (550 / 612),
                            top: proposal.signatureField!.y * (550 / 612),
                            width: proposal.signatureField!.width * (550 / 612),
                            height: proposal.signatureField!.height * (550 / 612),
                          }}
                        >
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs text-green-700 font-medium mt-1">Signed</span>
                        </div>
                      ) : !anyProposalSigned ? (
                        <button
                          onClick={handleSignClick}
                          className="absolute border-2 border-dashed border-blue-500 bg-blue-50 bg-opacity-80 hover:bg-blue-100 hover:border-blue-600 transition-colors cursor-pointer flex flex-col items-center justify-center group"
                          style={{
                            left: proposal.signatureField!.x * (550 / 612),
                            top: proposal.signatureField!.y * (550 / 612),
                            width: proposal.signatureField!.width * (550 / 612),
                            height: proposal.signatureField!.height * (550 / 612),
                          }}
                        >
                          <svg className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span className="text-xs text-blue-700 font-medium mt-1">Click to Sign</span>
                        </button>
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback Mock Preview */
              <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[300px]">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">FB</span>
                    </div>
                    <span className="font-bold text-gray-900">Fence Boys</span>
                  </div>
                  <p className="text-sm text-gray-500">Professional Fence Installation</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Project Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-500">Customer:</p>
                      <p className="text-gray-900">{customerName}</p>
                      <p className="text-gray-500">Proposal:</p>
                      <p className="text-gray-900">{proposal.name}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Scope of Work</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Professional fence installation</li>
                      <li>• All materials included</li>
                      <li>• Site cleanup upon completion</li>
                      <li>• 1-year workmanship warranty</li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Investment:</span>
                      <span className="text-xl font-bold text-gray-900">
                        ${proposal.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-blue-900">Payment Terms</p>
                <p className="text-sm text-blue-700 mt-1">
                  50% deposit (${depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}) due upon signing.
                  Remaining balance due upon completion.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {proposal.pdfData && (
              <Button variant="outline" onClick={handleDownload} className="flex-1">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </Button>
            )}
            {thisProposalSigned ? (
              <div className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Signed
              </div>
            ) : anyProposalSigned ? (
              <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-center text-sm flex items-center justify-center">
                A different proposal has been signed
              </div>
            ) : (
              <Button variant="primary" onClick={handleSignClick} className="flex-1">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Sign Proposal
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog for Multiple Proposals */}
      <Modal
        isOpen={showSignConfirmation}
        onClose={() => setShowSignConfirmation(false)}
        title="Confirm Proposal Selection"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-medium text-amber-800">Are you sure this is the correct proposal?</p>
                <p className="text-sm text-amber-700 mt-1">
                  You have {sentProposals.length} options available. Make sure you've reviewed each one.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500 mb-1">You are signing:</p>
            <p className="font-semibold text-gray-900">{proposal.name}</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              ${proposal.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSignConfirmation(false)}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={confirmAndSign}
              className="flex-1"
            >
              Yes, Sign This Proposal
            </Button>
          </div>
        </div>
      </Modal>

      <SignatureModal
        isOpen={showSignature}
        onClose={() => setShowSignature(false)}
        onSign={handleSign}
        customerName={customerName}
      />
    </>
  );
};
