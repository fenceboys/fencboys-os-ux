import React from 'react';
import { Card } from '../ui';
import { User } from '../../types';
import { useData } from '../../context/DataContext';

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
}

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
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Google
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calendly
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QUO
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* User */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-sm">
                      {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{user.email}</span>
                </td>

                {/* Role - Editable with checkboxes */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
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
                </td>

                {/* Status - Editable Dropdown */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <select
                    value={user.status}
                    onChange={(e) => updateUser(user.id, { status: e.target.value as 'active' | 'inactive' })}
                    className={`text-xs font-medium rounded-full px-3 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700 focus:ring-green-500'
                        : 'bg-gray-100 text-gray-600 focus:ring-gray-500'
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>

                {/* Joined */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{formatDate(user.joinedAt)}</span>
                </td>

                {/* Google */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {user.integrations.google.connected ? (
                    <span className="text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Connected
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        // Mock connect - in real app would trigger OAuth
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
                </td>

                {/* Calendly */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {user.integrations.calendly.connected ? (
                    <span className="text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Connected
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        // Mock connect - in real app would trigger OAuth
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
                </td>

                {/* QUO */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <select
                    value={user.integrations.quo.lineType || 'none'}
                    onChange={(e) => handleQuoChange(user, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="none">Not Assigned</option>
                    <option value="main">Main Line</option>
                    <option value="direct">Direct Line</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onEditUser(user)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
