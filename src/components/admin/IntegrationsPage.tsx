import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../layout';

interface IntegrationStatus {
  stripe: boolean;
  quoMainLine: boolean;
  slack: boolean;
}

export const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus>({
    stripe: true,
    quoMainLine: true,
    slack: false,
  });

  return (
    <PageLayout>
      <PageHeader
        title="Integrations"
        subtitle="Manage system-wide integrations"
        backLink={{ label: 'Admin Settings', to: '/admin' }}
        icon={
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        }
      />

      <div className="space-y-6">
        {/* Stripe Integration */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-medium text-gray-900">Stripe</h2>
                <p className="text-xs text-gray-500">Payment processing for invoices and deposits</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {integrations.stripe ? (
                <>
                  <span className="text-green-600 flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Connected
                  </span>
                  <button
                    onClick={() => setIntegrations(prev => ({ ...prev, stripe: false }))}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIntegrations(prev => ({ ...prev, stripe: true }))}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  Connect Stripe
                </button>
              )}
            </div>
          </div>
        </div>

        {/* QUO Main Line Integration */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-medium text-gray-900">QUO Main Line</h2>
                <p className="text-xs text-gray-500">Primary business phone line for inbound leads</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {integrations.quoMainLine ? (
                <>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">(614) 555-0100</span>
                    <p className="text-xs text-green-600">Connected</p>
                  </div>
                  <button
                    onClick={() => setIntegrations(prev => ({ ...prev, quoMainLine: false }))}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIntegrations(prev => ({ ...prev, quoMainLine: true }))}
                  className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  Connect QUO
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Slack Integration */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-medium text-gray-900">Slack</h2>
                <p className="text-xs text-gray-500">Team notifications and alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {integrations.slack ? (
                <>
                  <span className="text-green-600 flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Connected
                  </span>
                  <button
                    onClick={() => setIntegrations(prev => ({ ...prev, slack: false }))}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIntegrations(prev => ({ ...prev, slack: true }))}
                  className="px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  Connect Slack
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-900">User-specific integrations</p>
              <p className="text-xs text-blue-700 mt-1">
                Individual user integrations (Calendly, Google Calendar, QUO Direct Lines) are configured in each user's personal Settings page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
