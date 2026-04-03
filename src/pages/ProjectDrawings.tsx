import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout, PageHeader } from '../components/layout';
import { useData } from '../context/DataContext';
import { Drawing } from '../types';

export const ProjectDrawings: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, getCustomerById, getDrawingsByProjectId } = useData();
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const project = getProjectById(projectId || '');
  const customer = project ? getCustomerById(project.customerId) : null;
  const drawings = getDrawingsByProjectId(projectId || '');

  const filteredDrawings = drawings.filter(drawing =>
    drawing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
            <span>Drawings</span>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {customer?.name}
            </span>
          </div>
        }
        subtitle={`${project.address} • ${drawings.length} drawing${drawings.length !== 1 ? 's' : ''}`}
        backLink={{ label: 'Back to Project', to: `/projects/${projectId}` }}
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search drawings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* New Drawing Card - Always First */}
          <div
            onClick={() => window.open('/drawing-tool/index.html', '_blank')}
            className="group border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <div className="aspect-[4/3] flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">New Drawing</span>
              <span className="text-xs text-gray-500 mt-1">Create fence layout</span>
            </div>
          </div>

          {/* Existing Drawings */}
          {filteredDrawings.map((drawing) => (
            <div
              key={drawing.id}
              className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => setSelectedDrawing(drawing)}
            >
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-900 text-sm truncate">{drawing.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatDate(drawing.createdAt)}
                  </span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-blue-600 font-medium truncate">{customer?.name}</span>
                </div>
              </div>
              <div className="px-3 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('/drawing-tool/index.html', '_blank');
                    }}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDrawing(drawing);
                    }}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drawing Detail Modal */}
      {selectedDrawing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedDrawing.name}</h3>
                <p className="text-sm text-gray-500">Drawing for {customer?.name}</p>
              </div>
              <button
                onClick={() => setSelectedDrawing(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <span>Created: {formatDate(selectedDrawing.createdAt)}</span>
                <span>Last modified: {formatDate(selectedDrawing.createdAt)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('/drawing-tool/index.html', '_blank')}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Drawing
                </button>
                <button
                  onClick={() => setSelectedDrawing(null)}
                  className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};
