import React from 'react';

export type PortalTabType = 'status' | 'documents' | 'communication';

interface Tab {
  id: PortalTabType;
  label: string;
}

const tabs: Tab[] = [
  { id: 'status', label: 'Current Status' },
  { id: 'documents', label: 'Documents' },
  { id: 'communication', label: 'Communication' },
];

interface PortalTabsProps {
  activeTab: PortalTabType;
  onTabChange: (tab: PortalTabType) => void;
}

export const PortalTabs: React.FC<PortalTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <nav className="-mb-px flex justify-center space-x-4 sm:space-x-8 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-3 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
              ${activeTab === tab.id
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
