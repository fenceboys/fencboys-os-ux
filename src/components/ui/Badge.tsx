import React from 'react';
import { statusColorMap } from '../../styles/theme';

type BadgeColor = 'yellow' | 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'gray',
  className = '',
}) => {
  const colorStyles = statusColorMap[color] || statusColorMap.gray;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorStyles.bg} ${colorStyles.text} ${className}`}>
      {children}
    </span>
  );
};
