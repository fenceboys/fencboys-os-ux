import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Dropdown, Input, Badge } from '../ui';
import { useData } from '../../context/DataContext';

export const PricingGallery: React.FC = () => {
  const { pricings, projects, getProjectById, assignPricingToProject } = useData();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const projectOptions = [
    { value: '', label: 'Not assigned' },
    ...projects.map(p => ({ value: p.id, label: p.name })),
  ];

  const filteredPricings = pricings.filter(pricing => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const project = pricing.projectId ? getProjectById(pricing.projectId) : null;
    return (
      pricing.name.toLowerCase().includes(query) ||
      pricing.fenceType.toLowerCase().includes(query) ||
      (project?.name.toLowerCase().includes(query))
    );
  });

  const handleAssignToProject = (pricingId: string, projectId: string) => {
    assignPricingToProject(pricingId, projectId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
            <h1 className="text-2xl font-semibold text-gray-900">Pricing Gallery</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all pricing worksheets
            </p>
          </div>
          <Button>+ Create New Pricing</Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <Input
          placeholder="Search pricing..."
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
      {filteredPricings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p>No pricing worksheets found</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPricings.map((pricing) => {
            const project = pricing.projectId ? getProjectById(pricing.projectId) : null;
            return (
              <Card key={pricing.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <Badge color="green">{pricing.fenceType}</Badge>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{pricing.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {project ? project.name : 'Not assigned'}
                </p>
                <p className="text-xl font-semibold text-gray-900 mb-3">
                  {formatCurrency(pricing.total)}
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  {new Date(pricing.createdAt).toLocaleDateString()}
                </p>
                <Dropdown
                  options={projectOptions}
                  value={pricing.projectId || ''}
                  onChange={(value) => handleAssignToProject(pricing.id, value)}
                  placeholder="Assign to project..."
                />
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fence Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPricings.map((pricing) => {
                const project = pricing.projectId ? getProjectById(pricing.projectId) : null;
                return (
                  <tr key={pricing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{pricing.name}</td>
                    <td className="px-6 py-4">
                      <Badge color="green">{pricing.fenceType}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {project ? project.name : 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatCurrency(pricing.total)}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(pricing.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Dropdown
                        options={projectOptions}
                        value={pricing.projectId || ''}
                        onChange={(value) => handleAssignToProject(pricing.id, value)}
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
