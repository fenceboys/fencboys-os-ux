import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconBgColor?: string;
  subtitle?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-blue-100',
  subtitle,
  onClick,
  isActive = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border p-4 transition-all h-full ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${
        isActive
          ? 'border-primary ring-2 ring-primary ring-opacity-20'
          : 'border-gray-200'
      }`}
    >
      <div className="flex items-center h-full">
        {icon && (
          <div className={`${iconBgColor} rounded-lg p-3 mr-4 flex-shrink-0`}>
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 whitespace-nowrap">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};
