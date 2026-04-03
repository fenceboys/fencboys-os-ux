import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageLayout, PageHeader } from '../components/layout';
import { Card } from '../components/ui';

export const Placeholder: React.FC = () => {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop() || 'Page';

  return (
    <PageLayout>
      <PageHeader
        title={pageName.charAt(0).toUpperCase() + pageName.slice(1)}
        subtitle="This page is under construction"
      />
      <Card>
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-500">
            This feature is currently under development and will be available soon.
          </p>
        </div>
      </Card>
    </PageLayout>
  );
};
