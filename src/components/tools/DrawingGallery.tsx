import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Dropdown, Input } from '../ui';
import { useData } from '../../context/DataContext';

export const DrawingGallery: React.FC = () => {
  const { drawings, projects, getProjectById, assignDrawingToProject } = useData();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const projectOptions = [
    { value: '', label: 'Not assigned' },
    ...projects.map(p => ({ value: p.id, label: p.name })),
  ];

  const filteredDrawings = drawings.filter(drawing => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const project = drawing.projectId ? getProjectById(drawing.projectId) : null;
    return (
      drawing.name.toLowerCase().includes(query) ||
      (project?.name.toLowerCase().includes(query))
    );
  });

  const handleAssignToProject = (drawingId: string, projectId: string) => {
    assignDrawingToProject(drawingId, projectId);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/tools"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tools
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Drawing Gallery</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all drawings
            </p>
          </div>
          <Button>+ Create New Drawing</Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <Input
          placeholder="Search drawings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Gallery */}
      {filteredDrawings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <p>No drawings found</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrawings.map((drawing) => {
            const project = drawing.projectId ? getProjectById(drawing.projectId) : null;
            return (
              <Card key={drawing.id} padding="none" className="overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <img
                    src={drawing.preview}
                    alt={drawing.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200/E5E7EB/6B7280?text=Drawing';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{drawing.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {project ? project.name : 'Not assigned'}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    {new Date(drawing.createdAt).toLocaleDateString()}
                  </p>
                  <Dropdown
                    options={projectOptions}
                    value={drawing.projectId || ''}
                    onChange={(value) => handleAssignToProject(drawing.id, value)}
                    placeholder="Assign to project..."
                  />
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDrawings.map((drawing) => {
                const project = drawing.projectId ? getProjectById(drawing.projectId) : null;
                return (
                  <tr key={drawing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-20 h-14 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={drawing.preview}
                          alt={drawing.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x56/E5E7EB/6B7280?text=Drawing';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{drawing.name}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {project ? project.name : 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(drawing.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Dropdown
                        options={projectOptions}
                        value={drawing.projectId || ''}
                        onChange={(value) => handleAssignToProject(drawing.id, value)}
                        placeholder="Assign..."
                        className="w-40"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
