import React, { useState, useRef, useEffect } from 'react';
import { colors } from '../../styles/theme';

export interface StatusPillOption {
  value: string;
  label: string;
  bgColor?: string;
  textColor?: string;
}

interface StatusPillDropdownProps {
  status: string;
  options: StatusPillOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export const StatusPillDropdown: React.FC<StatusPillDropdownProps> = ({
  status,
  options,
  onChange,
  disabled = false,
  disabledReason,
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

  const selectedOption = options.find(o => o.value === status);
  const bgColor = selectedOption?.bgColor || colors.statusGray;
  const textColor = selectedOption?.textColor || colors.statusGrayText;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        title={disabled ? disabledReason : undefined}
        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
          disabled ? 'cursor-not-allowed opacity-60' : 'hover:opacity-80'
        }`}
        style={{ backgroundColor: bgColor, color: textColor, borderColor: bgColor }}
      >
        {selectedOption?.label || status}
        {!disabled && (
          <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-20 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                option.value === status ? 'bg-gray-50' : ''
              }`}
            >
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: option.bgColor || colors.statusGray }}
              />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
