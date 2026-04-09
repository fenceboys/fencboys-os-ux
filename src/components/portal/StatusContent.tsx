import React, { useState } from 'react';
import { Project, Salesperson, Customer, CustomerStatus } from '../../types';
import { getUnifiedPortalContent } from '../../constants/portalStatuses';
import { getStatusInfo, isPreSale } from '../../constants/statuses';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { MockCalendlyWidget } from './MockCalendlyWidget';

interface StatusContentProps {
  project: Project;
  salesperson?: Salesperson;
  customer?: Customer;
  onSignProposal?: () => void;
  onPayDeposit?: () => void;
  onUploadDocument?: () => void;
  onPayFinal?: () => void;
  onLeaveReview?: () => void;
  onBookAppointment?: (date: Date, time: string) => void;
  onRescheduleQuote?: () => void;
  onRescheduleInstallation?: () => void;
  onRequestNewQuote?: (hasChanges: boolean) => void;
}

export const StatusContent: React.FC<StatusContentProps> = ({
  project,
  salesperson,
  customer,
  onSignProposal,
  onPayDeposit,
  onUploadDocument,
  onPayFinal,
  onLeaveReview,
  onBookAppointment,
  onRescheduleQuote,
  onRescheduleInstallation,
  onRequestNewQuote,
}) => {
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [showRescheduleQuoteModal, setShowRescheduleQuoteModal] = useState(false);
  const statusInfo = getStatusInfo(project.status);

  // Determine which status to use: customer status for pre-sale, project status for post-sale
  const customerStatus = (customer?.status || 'new_lead') as CustomerStatus;
  const inPreSale = isPreSale(customerStatus);
  // Terminal states (quote_expired, lost) also use customer status for portal content
  const useCustomerStatusForActive = inPreSale || customerStatus === 'quote_expired' || customerStatus === 'lost';
  // The "active status" is what we use to determine portal content
  const activeStatus = useCustomerStatusForActive ? customerStatus : project.status;

  // Handle reschedule for quote
  const handleRescheduleQuote = () => {
    // Simulate Slack message to #fb-sales
    console.log('[Slack API] Sending reschedule request to #fb-sales');
    alert('[Slack Mock] Reschedule request sent to #fb-sales channel');
    if (onRescheduleQuote) onRescheduleQuote();
  };

  // Handle reschedule for installation
  const handleRescheduleInstallation = () => {
    // Simulate Slack message to #fb-install-scheduling
    console.log('[Slack API] Sending reschedule request to #fb-install-scheduling');
    alert('[Slack Mock] Reschedule request sent to #fb-install-scheduling channel');
    if (onRescheduleInstallation) onRescheduleInstallation();
  };

  // Handle new quote request
  const handleNewQuoteRequest = (hasChanges: boolean) => {
    // Simulate Slack message to #fb-sales
    const message = hasChanges
      ? 'Request Quote with Changes'
      : 'Request New Quote - No Changes';
    console.log(`[Slack API] Sending "${message}" to #fb-sales`);
    alert(`[Slack Mock] "${message}" request sent to #fb-sales channel`);
    setShowNewQuoteModal(false);
    if (onRequestNewQuote) onRequestNewQuote(hasChanges);
  };

  // Reusable contact buttons for all statuses
  const renderContactButtons = () => (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <p className="text-sm text-gray-500 mb-3">Questions?</p>
      <div className="flex justify-center gap-3">
        <a
          href="tel:+15125551234"
          className="px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Call
        </a>
        <a
          href="sms:+15125551234"
          className="px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Text
        </a>
        <a
          href={`mailto:${salesperson?.email || 'hello@fenceboys.com'}`}
          className="px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Email
        </a>
      </div>
    </div>
  );

  const content = getUnifiedPortalContent(
    customerStatus,
    project.status,
    salesperson?.name,
    project.salesAppointment,
    project.installationDate,
    project.walkthroughDate
  );

  const renderInteractiveContent = () => {
    if (!content.isInteractive) return null;

    switch (content.interactiveType) {
      case 'calendly_booking':
        return (
          <div className="mt-6">
            <MockCalendlyWidget
              salespersonName={salesperson?.name}
              customerName={customer?.name}
              customerEmail={customer?.email}
              customerPhone={customer?.phone}
              customerAddress={project.address}
              onBooking={onBookAppointment}
            />
          </div>
        );

      case 'proposal_review':
        return (
          <div className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-200 max-w-sm mx-auto">
            <p className="text-sm text-blue-800 mb-4">
              Ready to move forward? Review and sign your proposal to get started.
            </p>
            <button
              onClick={onSignProposal}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Review & Sign Proposal
            </button>
          </div>
        );

      case 'deposit_payment':
        return (
          <div className="mt-8 p-5 bg-green-50 rounded-xl border border-green-200 max-w-sm mx-auto">
            <p className="text-sm text-green-800 mb-4">
              Your deposit secures your spot in our schedule. Pay now to get started.
            </p>
            <button
              onClick={onPayDeposit}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Pay Deposit
            </button>
          </div>
        );

      case 'document_upload':
        return (
          <div className="mt-8 p-5 bg-yellow-50 rounded-xl border border-yellow-200 max-w-sm mx-auto">
            <p className="text-sm text-yellow-800 mb-4">
              {project.documentationNeededDescription || 'Please upload the requested documents to continue with your permit.'}
            </p>
            <button
              onClick={onUploadDocument}
              className="bg-yellow-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
            >
              Upload Documents
            </button>
          </div>
        );

      case 'final_payment':
        return (
          <div className="mt-8 p-5 bg-green-50 rounded-xl border border-green-200 max-w-sm mx-auto">
            <p className="text-sm text-green-800 mb-4">
              Complete your final payment to close out your project.
            </p>
            <button
              onClick={onPayFinal}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Pay Final Balance
            </button>
          </div>
        );

      case 'review_request':
        return (
          <div className="mt-8 p-5 bg-purple-50 rounded-xl border border-purple-200 max-w-sm mx-auto">
            <p className="text-sm text-purple-800 mb-4">
              We'd love to hear about your experience! Your feedback helps us serve future customers better.
            </p>
            <button
              onClick={onLeaveReview}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Leave a Review
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================
  // PRE-SALE STATUS HANDLING (customer.status)
  // When in pre-sale OR terminal states (quote_expired, lost),
  // use customer.status to determine portal content
  // ============================================
  if (useCustomerStatusForActive) {
    // For quote_scheduled, show appointment details
    if (activeStatus === 'quote_scheduled') {
      // Use real date or mock date for demo purposes
      let appointmentDate: Date;
      if (project.salesAppointment) {
        appointmentDate = new Date(project.salesAppointment);
      } else {
        // Mock date: next Tuesday at 10am
        const mockDate = new Date();
        mockDate.setDate(mockDate.getDate() + ((2 - mockDate.getDay() + 7) % 7 || 7));
        mockDate.setHours(10, 0, 0, 0);
        appointmentDate = mockDate;
      }

      return (
        <>
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Your Consultation is Booked</h3>
            <p className="text-gray-500 mb-6">We'll visit your property to discuss your project</p>
            <div className="bg-gray-50 rounded-xl py-6 px-8 mb-6">
              <p className="text-3xl font-bold text-gray-900">
                {appointmentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-xl text-blue-600 font-semibold mt-1">
                {appointmentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </p>
            </div>
            <button
              onClick={() => setShowRescheduleQuoteModal(true)}
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Need to Reschedule?
            </button>
            {renderContactButtons()}
          </div>
          <Modal isOpen={showRescheduleQuoteModal} onClose={() => setShowRescheduleQuoteModal(false)} title="Reschedule Consultation" size="sm">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Need to change your appointment time? We'll notify your sales rep and they'll reach out to find a new time that works for you.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Current appointment:</strong><br />
                  {appointmentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {appointmentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowRescheduleQuoteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowRescheduleQuoteModal(false);
                    handleRescheduleQuote();
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Request Reschedule
                </button>
              </div>
            </div>
          </Modal>
        </>
      );
    }

    // For building_proposal, show "we're working on it" message
    if (activeStatus === 'building_proposal') {
      return (
        <div className="p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4">
            <img src="/fence-boys-logo.jpg" alt="Fence Boys" className="w-full h-full object-contain" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Thanks for Meeting With Us!</h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            We're putting together your custom pricing and proposal based on our site visit.
          </p>
          <div className="bg-gray-50 rounded-xl py-5 px-6 text-left max-w-sm mx-auto">
            <p className="text-sm font-medium text-gray-900 mb-3">What happens next:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Your proposal will appear here when ready
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Review, download, and sign online
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                We'll text & email you when it's ready
              </li>
            </ul>
          </div>
          {renderContactButtons()}
        </div>
      );
    }

    // For proposal_sent, show proposal ready with CTA
    if (activeStatus === 'proposal_sent') {
      return (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Proposal is Ready!</h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            We've put together a custom proposal for your fence project. Review the details and sign to get started.
          </p>
          <div className="bg-gray-50 rounded-xl py-5 px-6 text-left max-w-sm mx-auto mb-6">
            <p className="text-sm font-medium text-gray-900 mb-3">How it works:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">1</span>
                Open your proposal, download it if you want
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">2</span>
                Review the details and sign
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">3</span>
                Once signed, you'll be prompted to pay your deposit
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-4 italic">
              If you requested multiple quotes, please review all and ensure you sign the correct one.
            </p>
          </div>
          <button
            onClick={onSignProposal}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Review & Sign Proposal
          </button>
          {renderContactButtons()}
        </div>
      );
    }

    // For awaiting_deposit, show signed confirmation with deposit CTA
    if (activeStatus === 'awaiting_deposit') {
      return (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Contract Signed!</h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Thank you for signing! Please pay your deposit below and we will get to work.
          </p>
          <div className="bg-gray-50 rounded-xl py-5 px-6 text-left max-w-sm mx-auto mb-6">
            <p className="text-sm font-medium text-gray-900 mb-3">After your deposit:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">1</span>
                We will draft and submit your permit to your local municipality
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">2</span>
                After permits, we order your materials
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">3</span>
                Once materials arrive, we schedule your installation
              </li>
            </ul>
          </div>
          <button
            onClick={onPayDeposit}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Pay Deposit
          </button>
          {renderContactButtons()}
        </div>
      );
    }

    // For quote_expired, show expired notice with request new quote
    if (activeStatus === 'quote_expired') {
      return (
        <>
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Quote Has Expired</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              We can only guarantee the pricing on our quotes for two weeks.
            </p>
            <button
              onClick={() => setShowNewQuoteModal(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Request New Quote
            </button>
            {renderContactButtons()}
          </div>
          <Modal isOpen={showNewQuoteModal} onClose={() => setShowNewQuoteModal(false)} title="Request New Quote" size="sm">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">How would you like to proceed with your new quote?</p>
              <div className="space-y-3">
                <button
                  onClick={() => handleNewQuoteRequest(false)}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">No Changes Needed</p>
                    <p className="text-sm text-gray-500">I want the same quote with updated pricing</p>
                  </div>
                </button>
                <button
                  onClick={() => handleNewQuoteRequest(true)}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Request with Changes</p>
                    <p className="text-sm text-gray-500">I'd like to discuss some changes first</p>
                  </div>
                </button>
              </div>
            </div>
          </Modal>
        </>
      );
    }

    // For lost, show project closed
    if (activeStatus === 'lost') {
      return (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Closed</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            This project has been closed. If you'd like to restart your fence project, please contact us.
          </p>
          {renderContactButtons()}
        </div>
      );
    }

    // For calendly booking statuses (contacted, new_lead, contact_attempted)
    if (content.interactiveType === 'calendly_booking') {
      return (
        <div className="p-6">
          <div className="max-w-xl mx-auto mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">Schedule Your Appointment</h3>
                <p className="text-sm text-gray-600">Pick a time that works for you and we'll come to you</p>
              </div>
            </div>
          </div>
          {renderInteractiveContent()}
          {renderContactButtons()}
        </div>
      );
    }

    // Default pre-sale content
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.title}</h3>
        <p className="text-gray-600 leading-relaxed max-w-md mx-auto">{content.description}</p>
        {renderInteractiveContent()}
        {renderContactButtons()}
      </div>
    );
  }

  // ============================================
  // POST-SALE STATUS HANDLING (project.status)
  // Only reached when customer is NOT in pre-sale
  // ============================================

  // For final_payment_due, show payment CTA
  if (project.status === 'final_payment_due') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Fence is Complete!</h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          Congratulations! Your fence installation is finished. Complete your final payment to close out the project.
        </p>

        {/* CTA Button */}
        <button
          onClick={onPayFinal}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Pay Final Balance
        </button>

        {renderContactButtons()}
      </div>
    );
  }

  // For requesting_review, show review request
  if (project.status === 'requesting_review') {
    return (
      <div className="p-8 text-center">
        {/* Logo */}
        <div className="w-24 h-24 mx-auto mb-4">
          <img
            src="/fence-boys-logo.jpg"
            alt="Fence Boys"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          Your fence project is complete and paid in full. We hope you had a wonderful experience working with Fence Boys. Please consider leaving us a review!
        </p>
        <p className="text-gray-500 italic mb-6">Sincerely, Fence Boys</p>

        {/* CTA Button */}
        <a
          href="https://g.page/r/CdmVFZ_zqIeLEAI/review"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Leave a Review
        </a>

        {renderContactButtons()}
      </div>
    );
  }

  // For complete, show final celebration (warranty box removed per spec)
  if (project.status === 'complete') {
    return (
      <div className="p-8 text-center">
        {/* Logo */}
        <div className="w-24 h-24 mx-auto mb-4">
          <img
            src="/fence-boys-logo.jpg"
            alt="Fence Boys"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Complete!</h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          Thank you for choosing Fence Boys! Enjoy your beautiful new fence.
        </p>

        {renderContactButtons()}
      </div>
    );
  }

  // For installation_delayed, show delay notice
  if (project.status === 'installation_delayed') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Installation Delayed</h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          We're sorry, but we need to reschedule your installation. We'll reach out shortly to find a new date that works for you.
        </p>

        {renderContactButtons()}
      </div>
    );
  }

  // For installation_in_progress, show work in progress
  if (project.status === 'installation_in_progress') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Installation in Progress!</h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          Your fence is being built right now! Our crew is hard at work bringing your project to life.
        </p>

        {/* Progress indicator */}
        <div className="bg-blue-50 rounded-xl py-5 px-6 max-w-sm mx-auto border border-blue-200">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-sm text-blue-800 font-medium text-center">
            Building your fence
          </p>
        </div>

        {renderContactButtons()}
      </div>
    );
  }

  // For scheduling_walkthrough, show installation complete
  if (project.status === 'scheduling_walkthrough') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Installation Complete!</h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          We'll reach out to schedule a walkthrough to make sure everything is up to our standards and yours. You're welcome to join, but it's not required that you're home.
        </p>

        {renderContactButtons()}
      </div>
    );
  }

  // For walkthrough_scheduled, show walkthrough date
  if (project.status === 'walkthrough_scheduled') {
    // Use real date or mock date for demo purposes
    let walkthroughDate: Date;
    if (project.walkthroughDate) {
      walkthroughDate = new Date(project.walkthroughDate);
    } else {
      // Mock date: day after tomorrow
      const mockDate = new Date();
      mockDate.setDate(mockDate.getDate() + 2);
      mockDate.setHours(10, 0, 0, 0);
      walkthroughDate = mockDate;
    }

    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-1">Walkthrough Scheduled</h3>
        <p className="text-gray-500 mb-6">We'll inspect the fence to make sure everything is up to our standards and yours.</p>

        {/* Date - Large Display */}
        <div className="bg-gray-50 rounded-xl py-6 px-8 mb-6">
          <p className="text-3xl font-bold text-gray-900">
            {walkthroughDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          You're welcome to join, but it's not required that you're home.
        </p>

        {renderContactButtons()}
      </div>
    );
  }

  // For fixes_needed, show addressing concerns
  if (project.status === 'fixes_needed') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Addressing Your Concerns</h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          We're working on the items identified during your walkthrough. Your satisfaction is our priority.
        </p>

        {renderContactButtons()}
      </div>
    );
  }

  // For scheduling_installation, show materials arrived
  if (project.status === 'scheduling_installation') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Materials Have Arrived!</h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          Your fence materials are in and ready to go.
        </p>

        {/* Info */}
        <div className="bg-green-50 rounded-xl py-5 px-6 text-center max-w-sm mx-auto border border-green-200">
          <p className="text-base text-green-800 font-medium">
            We'll reach out to schedule your install.
          </p>
        </div>

        {renderContactButtons()}
      </div>
    );
  }

  // For installation_scheduled, show the scheduled date
  if (project.status === 'installation_scheduled') {
    // Use real date or mock date for demo purposes
    let installDate: Date;
    if (project.installationDate) {
      installDate = new Date(project.installationDate);
    } else {
      // Mock date: next Monday
      const mockDate = new Date();
      mockDate.setDate(mockDate.getDate() + ((1 - mockDate.getDay() + 7) % 7 || 7));
      mockDate.setHours(8, 0, 0, 0);
      installDate = mockDate;
    }

    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-1">Installation Scheduled!</h3>
        <p className="text-gray-500 mb-6">Mark your calendar - your new fence is coming</p>

        {/* Date/Time - Large Display */}
        <div className="bg-gray-50 rounded-xl py-6 px-8 mb-6">
          <p className="text-3xl font-bold text-gray-900">
            {installDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* What to expect */}
        <div className="bg-blue-50 rounded-xl py-5 px-6 text-left max-w-sm mx-auto border border-blue-200">
          <p className="text-sm font-medium text-blue-800 mb-3">Before we arrive:</p>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Clear the fence line area
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Ensure gate access for our crew
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Secure pets indoors if possible
            </li>
          </ul>
        </div>

        {/* Reschedule Button */}
        <button
          onClick={handleRescheduleInstallation}
          className="text-sm text-gray-500 hover:text-gray-700 underline mt-4"
        >
          Need to reschedule?
        </button>

        {renderContactButtons()}
      </div>
    );
  }

  // For ready_to_order_materials, show permit approved celebration
  if (project.status === 'ready_to_order_materials') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Permit Approved!</h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          Great news! Your permit has been approved by the city.
        </p>

        {/* What's next */}
        <div className="bg-green-50 rounded-xl py-5 px-6 text-left max-w-sm mx-auto border border-green-200">
          <p className="text-sm font-medium text-green-800 mb-3">What happens next:</p>
          <ul className="space-y-2 text-sm text-green-700">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              We'll order your materials
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Schedule installation when ready
            </li>
          </ul>
        </div>

        {renderContactButtons()}
      </div>
    );
  }

  // For materials_ordered, show materials in transit
  if (project.status === 'materials_ordered') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Materials Ordered</h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          Your fence materials have been ordered. We'll reach out once they arrive to schedule your installation.
        </p>

        {renderContactButtons()}
      </div>
    );
  }

  // For permit_submitted, show waiting for city
  if (project.status === 'permit_submitted') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Permit Submitted</h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          Your permit application has been submitted to the city. We're waiting for their review and approval.
        </p>

        {/* Timeline info */}
        <div className="bg-gray-50 rounded-xl py-5 px-6 text-left max-w-sm mx-auto">
          <p className="text-sm font-medium text-gray-900 mb-3">What to expect:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              We'll notify you of any updates
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Once approved, we'll order materials
            </li>
          </ul>
        </div>

        {renderContactButtons()}
      </div>
    );
  }

  // For permit_revision_needed, show we're making revisions
  if (project.status === 'permit_revision_needed') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Making Revisions</h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          The city has requested some changes to your permit application. Our team is working on the updates.
        </p>

        {/* Info */}
        <div className="bg-orange-50 rounded-xl py-5 px-6 text-left max-w-sm mx-auto border border-orange-200">
          <p className="text-sm font-medium text-orange-800 mb-2">Don't worry, this is normal!</p>
          <p className="text-sm text-orange-700">
            Minor revisions are common. We'll resubmit as soon as the changes are complete.
          </p>
        </div>

        {renderContactButtons()}
      </div>
    );
  }

  // For permit_resubmitted, show waiting again
  if (project.status === 'permit_resubmitted') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Permit Resubmitted</h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          We've made the requested changes and resubmitted your permit. Waiting for final approval from the city.
        </p>

        {/* Info */}
        <div className="bg-gray-50 rounded-xl py-5 px-6 text-left max-w-sm mx-auto">
          <p className="text-sm font-medium text-gray-900 mb-3">Almost there:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Revisions completed
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Application resubmitted
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Awaiting final approval
            </li>
          </ul>
        </div>

        {renderContactButtons()}
      </div>
    );
  }

  // For customer_docs_needed, show document upload request
  if (project.status === 'customer_docs_needed') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Documents Needed</h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          {project.documentationNeededDescription || 'We need some additional documents from you to complete your permit application.'}
        </p>

        {/* Info */}
        <div className="bg-yellow-50 rounded-xl py-5 px-6 text-center max-w-sm mx-auto mb-6 border border-yellow-200">
          <p className="text-sm text-yellow-800">
            Someone on the Fence Boys team will reach out to let you know what we need.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onUploadDocument}
          className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Documents
        </button>

        {renderContactButtons()}
      </div>
    );
  }

  // For permit_preparation, show we're working on permit docs
  if (project.status === 'permit_preparation') {
    return (
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Preparing Your Permit</h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          We're putting together all the necessary documents to submit your permit application to the city.
        </p>

        {renderContactButtons()}
      </div>
    );
  }

  // Default post-sale fallback
  return (
    <div className="p-8 text-center">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.title}</h3>
      <p className="text-gray-600 leading-relaxed max-w-md mx-auto">{content.description}</p>
      {renderInteractiveContent()}
      {renderContactButtons()}
    </div>
  );
};
