import React from 'react';
import { Project } from '../../types';
import { useData } from '../../context/DataContext';
import { statuses, preSaleStatuses, postSaleStatuses } from '../../constants/statuses';

interface KanbanBoardProps {
  projects: Project[];
  filterMode: 'all' | 'pre_sale' | 'post_sale';
  onCustomerClick: (customerId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projects,
  filterMode,
  onCustomerClick,
}) => {
  const { getCustomerById, getSalespersonById } = useData();

  const visibleStatuses = filterMode === 'all'
    ? statuses
    : filterMode === 'pre_sale'
    ? preSaleStatuses
    : postSaleStatuses;

  const getProjectsForStatus = (statusId: string) =>
    projects.filter(p => p.status === statusId);

  const borderColorMap: Record<string, string> = {
    yellow: 'border-t-yellow-400',
    green: 'border-t-green-400',
    blue: 'border-t-blue-400',
    orange: 'border-t-orange-400',
    red: 'border-t-red-400',
    purple: 'border-t-purple-400',
    gray: 'border-t-gray-400',
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-4 min-w-max">
        {visibleStatuses.map((status) => {
          const projectsInStatus = getProjectsForStatus(status.id);
          const borderColor = borderColorMap[status.color] || 'border-t-gray-400';

          return (
            <div
              key={status.id}
              className={`w-72 bg-gray-50 rounded-lg border-t-4 ${borderColor}`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{status.label}</span>
                  <span className="text-sm text-gray-500">{projectsInStatus.length}</span>
                </div>
                <span className="text-xs text-gray-400 capitalize">
                  {status.phase.replace('_', '-')}
                </span>
              </div>

              {/* Project Cards */}
              <div className="p-2 space-y-2 min-h-[200px]">
                {projectsInStatus.map((project) => {
                  const customer = getCustomerById(project.customerId);
                  const salesperson = getSalespersonById(project.salespersonId);

                  return (
                    <div
                      key={project.id}
                      onClick={() => onCustomerClick(project.customerId)}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="font-medium text-gray-900 text-sm mb-1">
                        {project.name}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {customer?.name}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          {salesperson?.name || 'Unassigned'}
                        </span>
                        <span className="text-gray-400">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {projectsInStatus.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No projects
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
