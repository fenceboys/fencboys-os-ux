import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { ProjectStatus, CustomerStatus, ProjectStatusConfig, CustomerStatusConfig } from '../../types';
import { colors } from '../../styles/theme';

interface StatusDropdownProps {
  value: ProjectStatus | CustomerStatus;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  statusType?: 'project' | 'customer';
  disabled?: boolean;
  disabledReason?: string;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  value,
  options,
  onChange,
  size = 'md',
  statusType = 'project',
  disabled = false,
  disabledReason,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { projectStatusConfigs, customerStatusConfigs } = useData();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get status config by name from the appropriate config list
  const getStatusConfigByName = (statusName: string): ProjectStatusConfig | CustomerStatusConfig | undefined => {
    if (statusType === 'customer') {
      return customerStatusConfigs.find(s => s.name === statusName);
    }
    return projectStatusConfigs.find(s => s.name === statusName);
  };

  // Find the current option to get its label (which matches the config name)
  const currentOption = options.find(o => o.value === value);
  const currentStatusConfig = currentOption ? getStatusConfigByName(currentOption.label) : undefined;

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs gap-1'
    : 'px-3 py-1.5 text-sm gap-1.5';

  const iconSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';

  // Default colors if no config found (from theme)
  const defaultBg = colors.statusGray;
  const defaultText = colors.statusGrayText;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        title={disabled ? disabledReason : undefined}
        className={`inline-flex items-center font-medium rounded-full transition-opacity whitespace-nowrap ${sizeClasses} ${
          disabled
            ? 'cursor-not-allowed opacity-60'
            : 'cursor-pointer hover:opacity-80'
        }`}
        style={{
          backgroundColor: currentStatusConfig?.bgColor || defaultBg,
          color: currentStatusConfig?.textColor || defaultText,
        }}
      >
        {currentStatusConfig?.name || value}
        {!disabled && (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => {
            const optionConfig = getStatusConfigByName(option.label);
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
                  className="inline-block w-2 h-2 min-w-[8px] min-h-[8px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: optionConfig?.textColor || defaultText }}
                ></span>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
