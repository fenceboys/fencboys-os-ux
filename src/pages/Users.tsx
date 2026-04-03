import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../components/layout';
import { Button } from '../components/ui';
import { useData } from '../context/DataContext';
import { UserTable } from '../components/users/UserTable';
import { InviteUserModal } from '../components/users/InviteUserModal';
import { EditUserModal } from '../components/users/EditUserModal';
import { User } from '../types';

type FilterTab = 'all' | 'admin' | 'salesperson';

export const Users: React.FC = () => {
  const { users } = useData();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Count users by role
  const counts = {
    all: users.length,
    admin: users.filter((u) => u.roles.includes('admin')).length,
    salesperson: users.filter((u) => u.roles.includes('salesperson')).length,
  };

  // Filter users by active tab
  const filteredUsers = users.filter((user) => {
    if (activeTab === 'all') return true;
    return user.roles.includes(activeTab);
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'admin', label: 'Admins' },
    { key: 'salesperson', label: 'Salespeople' },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="User Management"
        subtitle={`${users.length} team member${users.length !== 1 ? 's' : ''}`}
        icon={
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
        actions={
          <Button variant="primary" onClick={() => setShowInviteModal(true)}>
            + Invite User
          </Button>
        }
      />

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4 py-2 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.key
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <UserTable users={filteredUsers} onEditUser={setEditingUser} />

      {/* Invite User Modal */}
      {showInviteModal && (
        <InviteUserModal onClose={() => setShowInviteModal(false)} />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} />
      )}
    </PageLayout>
  );
};
