import React, { useState, useRef, useEffect } from 'react';
import { getStatusInfo, getCustomerStatusInfo } from '../../constants/statuses';
import { ProjectStatus, CustomerStatus } from '../../types';

interface StatusDropdownProps {
  value: ProjectStatus | CustomerStatus;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
}

const colorClasses: Record<string, { bg: string; text: string; hoverBg: string }> = {
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', hoverBg: 'hover:bg-yellow-200' },
  green: { bg: 'bg-green-100', text: 'text-green-800', hoverBg: 'hover:bg-green-200' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-800', hoverBg: 'hover:bg-blue-200' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-800', hoverBg: 'hover:bg-orange-200' },
  red: { bg: 'bg-red-100', text: 'text-red-800', hoverBg: 'hover:bg-red-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-800', hoverBg: 'hover:bg-purple-200' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-800', hoverBg: 'hover:bg-gray-200' },
};

// Helper to get status info for both project and customer statuses
const getAnyStatusInfo = (value: string) => {
  return getStatusInfo(value as ProjectStatus) || getCustomerStatusInfo(value as CustomerStatus);
};

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  value,
  options,
  onChange,
  size = 'md',
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

  const currentStatus = getAnyStatusInfo(value);
  const colors = colorClasses[currentStatus?.color || 'gray'];

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs gap-1'
    : 'px-3 py-1.5 text-sm gap-1.5';

  const iconSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center font-medium rounded-full transition-colors cursor-pointer whitespace-nowrap ${sizeClasses} ${colors.bg} ${colors.text} ${colors.hoverBg}`}
      >
        {currentStatus?.label || value}
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => {
            const optionStatus = getAnyStatusInfo(option.value);
            const optionColors = colorClasses[optionStatus?.color || 'gray'];
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
                <span className={`inline-block w-2 h-2 rounded-full ${optionColors.bg} ${optionColors.text}`} style={{ backgroundColor: 'currentColor' }}></span>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
