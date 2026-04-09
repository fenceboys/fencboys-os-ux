import React from 'react';
import { Table, Dropdown } from '../ui';
import { PillDropdown, PillDropdownOption } from '../ui/PillDropdown';
import { User } from '../../types';
import { useData } from '../../context/DataContext';

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
}

// Status options for user account status
const userStatusOptions: PillDropdownOption[] = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
];

// QUO line options
const quoOptions = [
  { value: 'none', label: 'Not Assigned' },
  { value: 'main', label: 'Main Line' },
  { value: 'direct', label: 'Direct Line' },
];

export const UserTable: React.FC<UserTableProps> = ({ users, onEditUser }) => {
  const { updateUser } = useData();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleQuoChange = (user: User, lineType: string) => {
    updateUser(user.id, {
      integrations: {
        ...user.integrations,
        quo: lineType === 'none'
          ? {}
          : { lineType: lineType as 'main' | 'direct', lineId: lineType === 'main' ? 'main' : `direct_${user.id}` },
      },
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table<User>
        columns={[
          {
            key: 'name',
            header: 'User',
            render: (user) => (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-sm">
                  {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span className="ml-3 font-medium text-gray-900">{user.name}</span>
              </div>
            ),
          },
          {
            key: 'email',
            header: 'Email',
            render: (user) => (
              <span className="text-gray-600">{user.email}</span>
            ),
          },
          {
            key: 'roles',
            header: 'Role',
            render: (user) => (
              <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={user.roles.includes('admin')}
                    onChange={(e) => {
                      const newRoles = e.target.checked
                        ? [...user.roles, 'admin']
                        : user.roles.filter(r => r !== 'admin');
                      updateUser(user.id, { roles: newRoles as ('admin' | 'salesperson')[] });
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-600">Admin</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={user.roles.includes('salesperson')}
                    onChange={(e) => {
                      const newRoles = e.target.checked
                        ? [...user.roles, 'salesperson']
                        : user.roles.filter(r => r !== 'salesperson');
                      updateUser(user.id, { roles: newRoles as ('admin' | 'salesperson')[] });
                    }}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-xs text-gray-600">Sales</span>
                </label>
              </div>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (user) => (
              <div onClick={(e) => e.stopPropagation()}>
                <PillDropdown
                  options={userStatusOptions}
                  value={user.status}
                  onChange={(value) => updateUser(user.id, { status: value as 'active' | 'inactive' })}
                  size="sm"
                />
              </div>
            ),
          },
          {
            key: 'joinedAt',
            header: 'Joined',
            render: (user) => (
              <span className="text-gray-600">{formatDate(user.joinedAt)}</span>
            ),
          },
          {
            key: 'google',
            header: 'Google',
            render: (user) => (
              <div onClick={(e) => e.stopPropagation()}>
                {user.integrations.google.connected ? (
                  <span className="text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Connected
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      updateUser(user.id, {
                        integrations: {
                          ...user.integrations,
                          google: { connected: true, email: user.email },
                        },
                      });
                    }}
                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            ),
          },
          {
            key: 'calendly',
            header: 'Calendly',
            render: (user) => (
              <div onClick={(e) => e.stopPropagation()}>
                {user.integrations.calendly.connected ? (
                  <span className="text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Connected
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      updateUser(user.id, {
                        integrations: {
                          ...user.integrations,
                          calendly: { connected: true },
                        },
                      });
                    }}
                    className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            ),
          },
          {
            key: 'quo',
            header: 'QUO',
            render: (user) => (
              <div onClick={(e) => e.stopPropagation()} style={{ minWidth: '140px' }}>
                <Dropdown
                  options={quoOptions}
                  value={user.integrations.quo.lineType || 'none'}
                  onChange={(value) => handleQuoChange(user, value)}
                  placeholder="Select..."
                />
              </div>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (user) => (
              <div onClick={(e) => e.stopPropagation()} className="text-right">
                <button
                  onClick={() => onEditUser(user)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
              </div>
            ),
          },
        ]}
        data={users}
        emptyMessage="No users found"
      />
    </div>
  );
};
