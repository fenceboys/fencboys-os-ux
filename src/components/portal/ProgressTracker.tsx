import React from 'react';
import { ProjectStatus } from '../../types';
import { PROGRESS_TRACKER } from '../../constants/sizing';

interface ProgressTrackerProps {
  status: ProjectStatus;
}

interface Stage {
  id: number;
  name: string;
  subtitle: string;
}

const stages: Stage[] = [
  { id: 1, name: 'Schedule', subtitle: 'Site Visit' },
  { id: 2, name: 'Proposal', subtitle: 'Review & Sign' },
  { id: 3, name: 'Permit', subtitle: 'City Approval' },
  { id: 4, name: 'Materials', subtitle: 'Ordering' },
  { id: 5, name: 'Install Date', subtitle: 'Pick Date' },
  { id: 6, name: 'Installation', subtitle: 'Building' },
  { id: 7, name: 'Complete', subtitle: 'Enjoy!' },
];

// Stage icons
const StageIcon: React.FC<{ stageId: number; isActive: boolean }> = ({ stageId, isActive }) => {
  const color = isActive ? 'text-emerald-600' : 'text-gray-400';

  switch (stageId) {
    case 1: // Schedule - Calendar
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 2: // Proposal - Document
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 3: // Permit - Clipboard
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    case 4: // Materials - Box
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    case 5: // Install Date - Clock
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 6: // Installation - Wrench
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 7: // Complete - Checkmark
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
};

// Maps project status to stage number (1-7)
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

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ status }) => {
  const currentStage = getStageFromStatus(status);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-8">Project Progress</h2>

      {/* Desktop Progress Tracker */}
      <div className="hidden md:block">
        <div className="flex justify-center">
          <div className="relative flex items-start">
            {stages.map((stage, index) => {
              const isCompleted = stage.id < currentStage;
              const isCurrent = stage.id === currentStage;
              const isActive = isCompleted || isCurrent;
              const isLast = index === stages.length - 1;

              return (
                <div key={stage.id} className="flex items-start">
                  {/* Stage column */}
                  <div className="flex flex-col items-center" style={{ width: PROGRESS_TRACKER.normalWidth }}>
                    {/* Circle with icon */}
                    <div
                      className={`
                        w-11 h-11 rounded-full flex items-center justify-center
                        transition-all duration-300 relative z-10
                        ${isActive ? 'bg-emerald-100' : 'bg-gray-100'}
                      `}
                    >
                      <StageIcon stageId={stage.id} isActive={isActive} />
                    </div>

                    {/* Stage name */}
                    <div className={`mt-2 text-sm font-medium text-center ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {stage.name}
                    </div>

                    {/* Subtitle */}
                    <div className={`text-xs text-center ${isActive ? 'text-gray-500' : 'text-gray-300'}`}>
                      {stage.subtitle}
                    </div>

                    {/* Current stage badge */}
                    {isCurrent && (
                      <div className="mt-2 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                        Current Stage
                      </div>
                    )}
                  </div>

                  {/* Connecting line */}
                  {!isLast && (
                    <div
                      className={`h-0.5 mt-5 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`}
                      style={{ width: '40px' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Progress Tracker */}
      <div className="md:hidden">
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const isCompleted = stage.id < currentStage;
            const isCurrent = stage.id === currentStage;
            const isActive = isCompleted || isCurrent;
            const isLast = index === stages.length - 1;

            return (
              <div key={stage.id} className="flex items-start">
                {/* Left column: circle and line */}
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${isActive ? 'bg-emerald-100' : 'bg-gray-100'}
                    `}
                  >
                    <StageIcon stageId={stage.id} isActive={isActive} />
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 h-8 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                  )}
                </div>

                {/* Right column: content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {stage.name}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold uppercase rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <div className={`text-sm ${isActive ? 'text-gray-500' : 'text-gray-300'}`}>
                    {stage.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
