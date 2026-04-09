import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../components/layout';
import { useData } from '../context/DataContext';

interface IntegrationStatus {
  calendly: boolean;
  googleCalendar: boolean;
  quoDirectLine: boolean;
}

export const Settings: React.FC = () => {
  const { users } = useData();
  const currentUser = users[0]; // For now, assume first user is logged in

  // Profile state
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('(555) 123-4567');

  // Integration status
  const [integrations, setIntegrations] = useState<IntegrationStatus>({
    calendly: true,
    googleCalendar: false,
    quoDirectLine: true,
  });

  const integrationItems = [
    {
      key: 'calendly' as const,
      name: 'Calendly',
      description: 'Appointment scheduling',
      color: 'purple',
    },
    {
      key: 'googleCalendar' as const,
      name: 'Google Calendar',
      description: 'Calendar sync',
      color: 'blue',
    },
    {
      key: 'quoDirectLine' as const,
      name: 'QUO Direct Line',
      description: 'Personal direct phone line',
      color: 'emerald',
    },
  ];

  const getButtonColors = (color: string) => {
    const colors: Record<string, string> = {
      purple: 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100',
      blue: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100',
      emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    };
    return colors[color] || colors.blue;
  };

  return (
    <PageLayout>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and integrations"
        icon={
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      />

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-medium text-gray-900">Profile</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  disabled
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  disabled
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Integrations Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-medium text-gray-900">Integrations</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {integrationItems.map((item) => (
                <tr key={item.key} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{item.description}</span>
                  </td>
                  <td className="px-6 py-4">
                    {integrations[item.key] ? (
                      <span className="text-green-600 flex items-center text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Connected
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Not connected</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {integrations[item.key] ? (
                      <button
                        onClick={() => setIntegrations(prev => ({ ...prev, [item.key]: false }))}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => setIntegrations(prev => ({ ...prev, [item.key]: true }))}
                        className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${getButtonColors(item.color)}`}
                      >
                        Connect
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-medium text-gray-900">Account</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Sign out of your account</p>
                <p className="text-xs text-gray-500 mt-0.5">You will need to sign back in to access the app</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
