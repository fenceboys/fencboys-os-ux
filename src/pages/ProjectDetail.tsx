import React from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout, PageHeader } from '../components/layout';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <PageLayout>
      <PageHeader title="Project Details" subtitle={`Project ID: ${id}`} />
      <div className="text-gray-500">Project details content coming soon...</div>
    </PageLayout>
  );
};
