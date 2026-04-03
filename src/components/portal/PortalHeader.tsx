import React from 'react';

interface PortalHeaderProps {
  customerName: string;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ customerName }) => {
  return (
    <header className="bg-[#2563EB] text-white">
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Mobile: Stack vertically */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center flex-shrink-0">
              <span className="text-[#2563EB] font-bold text-sm">FB</span>
            </div>
            <span className="font-bold text-lg">Fence Boys</span>
          </div>
          <div className="sm:text-right">
            <h1 className="font-semibold text-base sm:text-lg truncate">
              {customerName} – Fence Project
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
