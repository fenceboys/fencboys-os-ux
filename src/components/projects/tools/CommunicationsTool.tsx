import React from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout, PageHeader } from '../../layout';
import { useData } from '../../../context/DataContext';

export const CommunicationsTool: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, getCustomerById, getActivitiesByProjectId } = useData();

  const project = getProjectById(projectId || '');
  const customer = project ? getCustomerById(project.customerId) : null;
  const activities = getActivitiesByProjectId(projectId || '');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (!projectId || !project) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Project not found</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span>Communications</span>
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
              {customer?.name}
            </span>
          </div>
        }
        subtitle={`${project.address} • ${activities.length} message${activities.length !== 1 ? 's' : ''}`}
        backLink={{ label: 'Back to Project', to: `/projects/${projectId}` }}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No communications yet</h3>
            <p className="text-gray-500">Messages and activity will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{activity.type}</span>
                    <span className="text-sm text-gray-500">{formatDate(activity.createdAt)}</span>
                  </div>
                  <p className="text-gray-600">{activity.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
