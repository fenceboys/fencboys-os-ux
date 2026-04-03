import React from 'react';
import { Modal } from '../ui/Modal';
import { PaymentForm } from './PaymentForm';

interface DepositPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  depositAmount: number;
  onPaymentComplete: () => void;
}

export const DepositPayment: React.FC<DepositPaymentProps> = ({
  isOpen,
  onClose,
  depositAmount,
  onPaymentComplete,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pay Your Deposit" size="md">
      <PaymentForm
        amount={depositAmount}
        label="Deposit Amount"
        onPaymentComplete={onPaymentComplete}
        onCancel={onClose}
      />
    </Modal>
  );
};
