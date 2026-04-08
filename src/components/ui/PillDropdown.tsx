import React, { useState, useRef, useEffect } from 'react';

export interface PillDropdownOption {
  value: string;
  label: string;
  color?: 'yellow' | 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'gray' | 'cyan' | 'pink';
}

interface PillDropdownProps {
  value: string;
  options: PillDropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const colorClasses: Record<string, { bg: string; text: string; hoverBg: string; border: string }> = {
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', hoverBg: 'hover:bg-yellow-200', border: 'border-yellow-200' },
  green: { bg: 'bg-green-100', text: 'text-green-800', hoverBg: 'hover:bg-green-200', border: 'border-green-200' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-800', hoverBg: 'hover:bg-blue-200', border: 'border-blue-200' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-800', hoverBg: 'hover:bg-orange-200', border: 'border-orange-200' },
  red: { bg: 'bg-red-100', text: 'text-red-800', hoverBg: 'hover:bg-red-200', border: 'border-red-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-800', hoverBg: 'hover:bg-purple-200', border: 'border-purple-200' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-800', hoverBg: 'hover:bg-gray-200', border: 'border-gray-200' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-800', hoverBg: 'hover:bg-cyan-200', border: 'border-cyan-200' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-800', hoverBg: 'hover:bg-pink-200', border: 'border-pink-200' },
};

export const PillDropdown: React.FC<PillDropdownProps> = ({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);
  const colors = colorClasses[selectedOption?.color || 'gray'];

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs gap-1'
    : 'px-3 py-1.5 text-sm gap-1.5';

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`inline-flex items-center font-medium rounded-full transition-colors whitespace-nowrap ${sizeClasses} ${colors.bg} ${colors.text} ${colors.hoverBg} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {selectedOption?.label || placeholder}
        <svg className={`${size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => {
            const optionColors = colorClasses[option.color || 'gray'];
            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                  option.value === value ? 'bg-gray-50' : ''
                }`}
              >
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${optionColors.bg} ${optionColors.text}`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Preset options for common use cases
export const buildTypeOptions: PillDropdownOption[] = [
  { value: 'new_build', label: 'New Build', color: 'green' },
  { value: 'replacement', label: 'Replacement', color: 'blue' },
  { value: 'repair', label: 'Repair', color: 'orange' },
];

export const leadSourceOptions: PillDropdownOption[] = [
  { value: 'webform', label: 'Webform', color: 'blue' },
  { value: 'email', label: 'Email', color: 'cyan' },
  { value: 'phone', label: 'Phone', color: 'green' },
  { value: 'text', label: 'Text', color: 'purple' },
  { value: 'google_ads', label: 'Google Ads', color: 'yellow' },
  { value: 'meta_ads', label: 'Meta Ads', color: 'pink' },
  { value: 'direct_mail', label: 'Direct Mail', color: 'orange' },
  { value: 'out_of_house', label: 'Out of House', color: 'gray' },
];

// Customer Status options (pre-sale lead journey)
export const customerStatusOptions: PillDropdownOption[] = [
  { value: 'new_lead', label: 'New Lead', color: 'gray' },
  { value: 'contact_attempted', label: 'Contact Attempted', color: 'yellow' },
  { value: 'contacted', label: 'Contacted', color: 'blue' },
  { value: 'repair_scheduled', label: 'Repair Scheduled', color: 'purple' },
  { value: 'quote_scheduled', label: 'Quote Scheduled', color: 'purple' },
  { value: 'building_proposal', label: 'Building Proposal', color: 'yellow' },
  { value: 'proposal_sent', label: 'Proposal Sent', color: 'orange' },
  { value: 'awaiting_deposit', label: 'Awaiting Deposit', color: 'orange' },
  { value: 'won', label: 'Won', color: 'green' },
  { value: 'lost', label: 'Lost', color: 'red' },
];

// Project Status options (post-sale only)
export const projectStatusOptions: PillDropdownOption[] = [
  { value: 'not_started', label: 'Not Started', color: 'gray' },
  { value: 'permit_preparation', label: 'Permit Preparation', color: 'green' },
  { value: 'customer_docs_needed', label: 'Customer Docs Needed', color: 'orange' },
  { value: 'permit_submitted', label: 'Permit Submitted', color: 'green' },
  { value: 'permit_revision_needed', label: 'Permit Revision Needed', color: 'orange' },
  { value: 'permit_resubmitted', label: 'Permit Resubmitted', color: 'green' },
  { value: 'ready_to_order_materials', label: 'Ready to Order Materials', color: 'orange' },
  { value: 'materials_ordered', label: 'Materials Ordered', color: 'orange' },
  { value: 'scheduling_installation', label: 'Scheduling Installation', color: 'purple' },
  { value: 'installation_scheduled', label: 'Installation Scheduled', color: 'purple' },
  { value: 'installation_delayed', label: 'Installation Delayed', color: 'red' },
  { value: 'installation_in_progress', label: 'Installation In Progress', color: 'blue' },
  { value: 'scheduling_walkthrough', label: 'Scheduling Walkthrough', color: 'blue' },
  { value: 'walkthrough_scheduled', label: 'Walkthrough Scheduled', color: 'blue' },
  { value: 'fixes_needed', label: 'Fixes Needed', color: 'orange' },
  { value: 'final_payment_due', label: 'Final Payment Due', color: 'yellow' },
  { value: 'requesting_review', label: 'Requesting Review', color: 'gray' },
  { value: 'complete', label: 'Complete', color: 'green' },
];
