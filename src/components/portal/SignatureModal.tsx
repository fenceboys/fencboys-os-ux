import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signature: string) => void;
  customerName: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSign,
  customerName,
}) => {
  const [typedName, setTypedName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSign = () => {
    setError('');

    if (!typedName.trim()) {
      setError('Please type your name to sign');
      return;
    }

    if (!agreed) {
      setError('Please confirm you agree to the terms');
      return;
    }

    onSign(typedName.trim());
    setTypedName('');
    setAgreed(false);
  };

  const handleClose = () => {
    setTypedName('');
    setAgreed(false);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign Your Proposal" size="md">
      <div className="space-y-6">
        <div>
          <p className="text-gray-600 text-sm">
            Type your full name below to electronically sign your fence proposal.
            This signature is legally binding.
          </p>
        </div>

        {/* Signature Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type your full name
          </label>
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder={customerName}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>

        {/* Signature Preview */}
        {typedName && (
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Signature Preview</p>
            <p
              className="text-3xl text-gray-800"
              style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
            >
              {typedName}
            </p>
          </div>
        )}

        {/* Agreement Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agree-terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="agree-terms" className="text-sm text-gray-600">
            I have reviewed the proposal and agree to the terms and conditions.
            I understand that this electronic signature is legally binding.
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSign}
            className="flex-1"
            disabled={!typedName.trim() || !agreed}
          >
            Sign Proposal
          </Button>
        </div>
      </div>
    </Modal>
  );
};
