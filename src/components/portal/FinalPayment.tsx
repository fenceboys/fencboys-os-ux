import React from 'react';
import { Modal } from '../ui/Modal';
import { PaymentForm } from './PaymentForm';

interface FinalPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  finalAmount: number;
  onPaymentComplete: () => void;
}

export const FinalPayment: React.FC<FinalPaymentProps> = ({
  isOpen,
  onClose,
  finalAmount,
  onPaymentComplete,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Final Payment" size="md">
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium text-green-800">Project Complete!</p>
            <p className="text-sm text-green-700 mt-1">
              Your fence has been installed. Submit your final payment to close out the project.
            </p>
          </div>
        </div>
      </div>

      <PaymentForm
        amount={finalAmount}
        label="Final Balance Due"
        onPaymentComplete={onPaymentComplete}
        onCancel={onClose}
      />
    </Modal>
  );
};
