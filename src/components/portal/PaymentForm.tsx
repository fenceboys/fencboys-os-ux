import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface PaymentFormProps {
  amount: number;
  label: string;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  label,
  onPaymentComplete,
  onCancel,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid card number');
      return;
    }
    if (!expiry || expiry.length < 5) {
      setError('Please enter a valid expiry date');
      return;
    }
    if (!cvc || cvc.length < 3) {
      setError('Please enter a valid CVC');
      return;
    }
    if (!name.trim()) {
      setError('Please enter the cardholder name');
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setProcessing(false);
    onPaymentComplete();
  };

  return (
    <div className="space-y-6">
      {/* Amount display */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute right-3 top-2.5 flex gap-1">
              <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                <rect width="32" height="20" rx="2" fill="#1A1F71" />
                <path d="M12.5 14.5L14 5.5H16.5L15 14.5H12.5Z" fill="white" />
                <path d="M21.5 5.7C21 5.5 20.2 5.3 19.2 5.3C16.7 5.3 15 6.5 15 8.2C15 9.5 16.2 10.2 17.1 10.6C18 11 18.3 11.3 18.3 11.7C18.3 12.3 17.6 12.6 16.9 12.6C15.9 12.6 15.4 12.5 14.6 12.1L14.3 12L14 14C14.6 14.3 15.7 14.5 16.8 14.5C19.5 14.5 21.1 13.3 21.1 11.5C21.1 10.5 20.5 9.7 19.2 9.1C18.4 8.7 17.9 8.4 17.9 8C17.9 7.6 18.3 7.2 19.2 7.2C19.9 7.2 20.5 7.3 21 7.5L21.2 7.6L21.5 5.7Z" fill="white" />
              </svg>
              <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                <rect width="32" height="20" rx="2" fill="#EB001B" fillOpacity="0.1" />
                <circle cx="12" cy="10" r="6" fill="#EB001B" />
                <circle cx="20" cy="10" r="6" fill="#F79E1B" />
                <path d="M16 5.5C17.5 6.7 18.5 8.2 18.5 10C18.5 11.8 17.5 13.3 16 14.5C14.5 13.3 13.5 11.8 13.5 10C13.5 8.2 14.5 6.7 16 5.5Z" fill="#FF5F00" />
              </svg>
            </div>
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              maxLength={5}
              placeholder="MM/YY"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              placeholder="123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              `Pay $${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
            )}
          </Button>
        </div>
      </form>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Payments secured by Stripe</span>
      </div>
    </div>
  );
};
