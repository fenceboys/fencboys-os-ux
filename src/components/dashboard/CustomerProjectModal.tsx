import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Badge } from '../ui';
import { useData } from '../../context/DataContext';
import { getStatusInfo } from '../../constants/statuses';
import { useMemo } from 'react';

interface CustomerProjectModalProps {
  customerId: string | null;
  onClose: () => void;
}

export const CustomerProjectModal: React.FC<CustomerProjectModalProps> = ({
  customerId,
  onClose,
}) => {
  const navigate = useNavigate();
  const { getCustomerById, getProjectsByCustomerId, getSalespersonById, requestTypeConfigs } = useData();

  const getRequestTypeLabel = useMemo(() => (requestType: string) => {
    const config = requestTypeConfigs.find(t => t.value === requestType && t.isActive);
    return config?.name || requestType;
  }, [requestTypeConfigs]);

  if (!customerId) return null;

  const customer = getCustomerById(customerId);
  const projects = getProjectsByCustomerId(customerId);

  if (!customer) return null;

  const salesperson = getSalespersonById(customer.salespersonId);

  const handleViewCustomer = () => {
    onClose();
    navigate(`/customers/${customerId}`);
  };

  const handleViewProject = (projectId: string) => {
    onClose();
    navigate(`/projects/${projectId}`);
  };

  return (
    <Modal
      isOpen={!!customerId}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <span>{customer.name}</span>
          <button
            onClick={handleViewCustomer}
            className="text-sm font-normal text-blue-600 hover:text-blue-700 hover:underline"
          >
            View Profile →
          </button>
        </div>
      }
      size="md"
    >
      <div className="space-y-4">
        {/* Customer Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Phone</span>
              <p className="font-medium text-gray-900">{customer.phone}</p>
            </div>
            <div>
              <span className="text-gray-500">Email</span>
              <p className="font-medium text-gray-900 truncate">{customer.email}</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Address</span>
              <p className="font-medium text-gray-900">
                {customer.address}, {customer.city}, {customer.state} {customer.zip}
              </p>
            </div>
            {salesperson && (
              <div>
                <span className="text-gray-500">Salesperson</span>
                <p className="font-medium text-gray-900">{salesperson.name}</p>
              </div>
            )}
            <div>
              <span className="text-gray-500">Request Type</span>
              <p className="font-medium text-gray-900">{getRequestTypeLabel(customer.requestType)}</p>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Projects ({projects.length})
          </h4>

          {projects.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No projects yet</p>
          ) : projects.length === 1 ? (
            // Single project - show details and direct button
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{projects[0].name}</p>
                  <p className="text-sm text-gray-500 mt-1">{projects[0].address}</p>
                </div>
                {(() => {
                  const status = getStatusInfo(projects[0].status);
                  return status ? (
                    <Badge color={status.color}>{status.label}</Badge>
                  ) : null;
                })()}
              </div>
              <Button
                className="w-full mt-3"
                onClick={() => handleViewProject(projects[0].id)}
              >
                View Project
              </Button>
            </div>
          ) : (
            // Multiple projects - show list to pick from
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {projects.map((project) => {
                const status = getStatusInfo(project.status);
                return (
                  <div
                    key={project.id}
                    onClick={() => handleViewProject(project.id)}
                    className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{project.name}</p>
                        <p className="text-sm text-gray-500">{project.address}</p>
                      </div>
                      {status && (
                        <Badge color={status.color}>{status.label}</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        {projects.length === 0 && (
          <div className="pt-2 border-t border-gray-200">
            <Button className="w-full" onClick={handleViewCustomer}>
              + New Project
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
