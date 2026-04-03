import React, { useState } from 'react';
import { PageLayout } from '../components/layout';
import { SalesDashboard, AdminDashboard } from '../components/dashboard';

type DashboardView = 'sales' | 'admin';

export const Dashboard: React.FC = () => {
  const [view, setView] = useState<DashboardView>('sales');

  return (
    <PageLayout>
      {/* Dashboard View Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setView('sales')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            view === 'sales'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Sales Dashboard
        </button>
        <button
          onClick={() => setView('admin')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            view === 'admin'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Admin Dashboard
        </button>
      </div>

      {view === 'sales' ? <SalesDashboard /> : <AdminDashboard />}
    </PageLayout>
  );
};
