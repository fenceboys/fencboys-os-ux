import React from 'react';
import { ProjectStatus } from '../../types';

interface CompactProgressTrackerProps {
  status: ProjectStatus;
}

interface Stage {
  id: number;
  name: string;
}

const stages: Stage[] = [
  { id: 1, name: 'On-Site Appointment' },
  { id: 2, name: 'Proposal' },
  { id: 3, name: 'Permit' },
  { id: 4, name: 'Materials' },
  { id: 5, name: 'Install Date' },
  { id: 6, name: 'Installation' },
  { id: 7, name: 'Complete' },
];

const getStageFromStatus = (status: ProjectStatus): number => {
  switch (status) {
    case 'new_lead':
    case 'quote_scheduled':
      return 1;
    case 'building_proposal':
    case 'proposal_sent':
    case 'awaiting_deposit':
      return 2;
    case 'permit_preparation':
    case 'customer_docs_needed':
    case 'permit_submitted':
    case 'permit_revision_needed':
    case 'permit_resubmitted':
      return 3;
    case 'ready_to_order_materials':
    case 'materials_ordered':
      return 4;
    case 'scheduling_installation':
    case 'installation_scheduled':
      return 5;
    case 'installation_delayed':
    case 'installation_in_progress':
    case 'scheduling_walkthrough':
    case 'walkthrough_scheduled':
    case 'fixes_needed':
      return 6;
    case 'final_payment_due':
    case 'requesting_review':
    case 'complete':
      return 7;
    case 'lost':
    case 'quote_expired':
      return 2;
    default:
      return 1;
  }
};

const getSubStatus = (status: ProjectStatus): string | null => {
  switch (status) {
    // Stage 1
    case 'new_lead':
      return 'Book Visit';
    case 'quote_scheduled':
      return 'Visit Scheduled';
    // Stage 2
    case 'building_proposal':
      return 'Building Quote';
    case 'proposal_sent':
      return 'Review & Sign';
    case 'awaiting_deposit':
      return 'Pay Deposit';
    // Stage 3
    case 'permit_preparation':
      return 'Preparing Docs';
    case 'customer_docs_needed':
      return 'Upload Docs';
    case 'permit_submitted':
      return 'Pending Approval';
    case 'permit_revision_needed':
      return 'Revising';
    case 'permit_resubmitted':
      return 'Pending Approval';
    // Stage 4
    case 'ready_to_order_materials':
      return 'Ordering';
    case 'materials_ordered':
      return 'In Transit';
    // Stage 5
    case 'scheduling_installation':
      return 'Time to Schedule';
    case 'installation_scheduled':
      return 'Date Set';
    // Stage 6
    case 'installation_delayed':
      return 'Delayed';
    case 'installation_in_progress':
      return 'In Progress';
    case 'scheduling_walkthrough':
      return 'Schedule Walkthrough';
    case 'walkthrough_scheduled':
      return 'Walkthrough Set';
    case 'fixes_needed':
      return 'Fixing Issues';
    // Stage 7
    case 'final_payment_due':
      return 'Pay Final';
    case 'requesting_review':
      return 'Leave Review';
    case 'complete':
      return 'Enjoy!';
    default:
      return null;
  }
};

export const CompactProgressTracker: React.FC<CompactProgressTrackerProps> = ({ status }) => {
  const currentStage = getStageFromStatus(status);
  const subStatus = getSubStatus(status);
  const isLoss = status === 'lost' || status === 'quote_expired';

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Pulse animation styles */}
      <style>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        .pulse-active {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Circles and connecting lines */}
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => {
            const isCompleted = stage.id < currentStage;
            const isCurrent = stage.id === currentStage;
            const isActive = isCompleted || isCurrent;
            const isLast = index === stages.length - 1;
            // For loss status, first 2 bubbles are red
            const isLossBubble = isLoss && stage.id <= 2;

            return (
              <React.Fragment key={stage.id}>
                <div
                  className={`
                    w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all flex-shrink-0
                    ${isLossBubble ? 'bg-red-500 text-white' : ''}
                    ${!isLossBubble && isCompleted ? 'bg-green-500 text-white' : ''}
                    ${!isLossBubble && isCurrent ? 'bg-blue-500 text-white pulse-active' : ''}
                    ${!isLossBubble && !isActive ? 'bg-gray-100 text-gray-400' : ''}
                  `}
                >
                  {isLossBubble ? (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : isCompleted ? (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stage.id
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`flex-1 h-1.5 mx-3 rounded-full ${isLoss && index === 0 ? 'bg-red-500' : isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Labels row */}
        <div className="flex justify-between mt-3">
          {stages.map((stage) => {
            const isCompleted = stage.id < currentStage;
            const isCurrent = stage.id === currentStage;
            const isLossBubble = isLoss && stage.id <= 2;

            return (
              <div key={stage.id} className="flex flex-col items-center" style={{ width: '56px' }}>
                <span className={`text-sm font-medium text-center ${isLossBubble ? 'text-red-600' : isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  {stage.name}
                </span>
                {isCurrent && subStatus && !isLoss && (
                  <span className="text-xs mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium whitespace-nowrap">
                    {subStatus}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
