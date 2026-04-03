import React from 'react';
import { PortalHeader } from './PortalHeader';

interface PortalLayoutProps {
  children: React.ReactNode;
  customerName: string;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children, customerName }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PortalHeader customerName={customerName} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Fence Boys. All rights reserved.</p>
          <p className="mt-1">Questions? Contact your sales representative.</p>
        </div>
      </footer>
    </div>
  );
};
