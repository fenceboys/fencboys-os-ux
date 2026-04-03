import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className = '' }) => {
  return (
    <aside className={`w-64 flex-shrink-0 ${className}`}>
      {children}
    </aside>
  );
};

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
};

interface CheckboxFilterProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
}

export const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  label,
  checked,
  onChange,
  count,
}) => {
  return (
    <label className="flex items-center py-1 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
      />
      <span className="ml-2 text-sm text-gray-700">{label}</span>
      {count !== undefined && (
        <span className="ml-auto text-xs text-gray-400">{count}</span>
      )}
    </label>
  );
};
