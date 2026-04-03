import React, { useState } from 'react';
import { PageLayout } from '../components/layout';
import { SalesDashboard, AdminDashboard } from '../components/dashboard';

type DashboardView = 'sales' | 'admin';

export const Dashboard: React.FC = () => {
  const [view, setView] = useState<DashboardView>('sales');

  return (
    <PageLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {view === 'sales' ? 'Sales Dashboard' : 'Admin Dashboard'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {view === 'sales'
              ? 'Track your sales pipeline and appointments'
              : 'Overview of all projects and operations'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('sales')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              view === 'sales'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sales
          </button>
          <button
            onClick={() => setView('admin')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              view === 'admin'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {view === 'sales' ? <SalesDashboard /> : <AdminDashboard />}
    </PageLayout>
  );
};
