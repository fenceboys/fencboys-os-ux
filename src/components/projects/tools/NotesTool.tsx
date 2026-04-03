import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout, PageHeader } from '../../layout';
import { useData } from '../../../context/DataContext';
import { ProjectSpecsForm } from './ProjectSpecsForm';
import { FreeNotesPanel } from './FreeNotesPanel';

type TabType = 'specs' | 'notes';

export const NotesTool: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, getCustomerById } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('specs');

  const project = getProjectById(projectId || '');
  const customer = project ? getCustomerById(project.customerId) : null;

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
            <span>Notes</span>
            <span className="px-2.5 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-full">
              {customer?.name}
            </span>
          </div>
        }
        subtitle={project.address}
        backLink={{ label: 'Back to Project', to: `/projects/${projectId}` }}
      />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'specs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Project Specs
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Free Notes
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'specs' ? (
            <ProjectSpecsForm projectId={projectId} />
          ) : (
            <FreeNotesPanel projectId={projectId} />
          )}
        </div>
      </div>
    </PageLayout>
  );
};
