import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout, PageHeader } from '../../layout';
import { useData } from '../../../context/DataContext';
import { Activity } from '../../../types';

type TabType = 'status_changes' | 'calls' | 'voicemails' | 'texts' | 'emails';

// Map activity types to friendly labels
const activityTypeLabels: Record<string, string> = {
  status_change: 'Status Change',
  note_added: 'Note Added',
  message_inbound: 'Inbound Message',
  message_outbound: 'Outbound Message',
  proposal_sent: 'Proposal Sent',
  proposal_signed: 'Proposal Signed',
  payment_received: 'Payment Received',
  call_recording: 'Call Recording',
  voicemail: 'Voicemail',
  text_inbound: 'Text Received',
  text_outbound: 'Text Sent',
  email_inbound: 'Email Received',
  email_outbound: 'Email Sent',
};

// Get icon for each activity type
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'status_change':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case 'note_added':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    case 'call_recording':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      );
    case 'voicemail':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      );
    case 'text_inbound':
    case 'text_outbound':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'email_inbound':
    case 'email_outbound':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'proposal_sent':
    case 'proposal_signed':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'payment_received':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

// Get background color for each activity type
const getActivityColor = (type: string) => {
  switch (type) {
    case 'status_change':
      return { bg: 'bg-purple-100', text: 'text-purple-600' };
    case 'note_added':
      return { bg: 'bg-yellow-100', text: 'text-yellow-600' };
    case 'call_recording':
      return { bg: 'bg-green-100', text: 'text-green-600' };
    case 'voicemail':
      return { bg: 'bg-orange-100', text: 'text-orange-600' };
    case 'text_inbound':
      return { bg: 'bg-blue-100', text: 'text-blue-600' };
    case 'text_outbound':
      return { bg: 'bg-cyan-100', text: 'text-cyan-600' };
    case 'email_inbound':
      return { bg: 'bg-indigo-100', text: 'text-indigo-600' };
    case 'email_outbound':
      return { bg: 'bg-violet-100', text: 'text-violet-600' };
    case 'proposal_sent':
    case 'proposal_signed':
      return { bg: 'bg-emerald-100', text: 'text-emerald-600' };
    case 'payment_received':
      return { bg: 'bg-green-100', text: 'text-green-600' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600' };
  }
};

export const CommunicationsTool: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, getCustomerById, getActivitiesByProjectId } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('status_changes');

  const project = getProjectById(projectId || '');
  const customer = project ? getCustomerById(project.customerId) : null;
  const activities = getActivitiesByProjectId(projectId || '');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter activities based on active tab
  const getFilteredActivities = (): Activity[] => {
    switch (activeTab) {
      case 'status_changes':
        return activities.filter(a =>
          ['status_change', 'note_added', 'proposal_sent', 'proposal_signed', 'payment_received'].includes(a.type)
        );
      case 'calls':
        return activities.filter(a => a.type === 'call_recording');
      case 'voicemails':
        return activities.filter(a => a.type === 'voicemail');
      case 'texts':
        return activities.filter(a =>
          ['text_inbound', 'text_outbound', 'message_inbound', 'message_outbound'].includes(a.type)
        );
      case 'emails':
        return activities.filter(a => ['email_inbound', 'email_outbound'].includes(a.type));
      default:
        return activities;
    }
  };

  const filteredActivities = getFilteredActivities();

  // Count items for each tab
  const statusCount = activities.filter(a =>
    ['status_change', 'note_added', 'proposal_sent', 'proposal_signed', 'payment_received'].includes(a.type)
  ).length;
  const callCount = activities.filter(a => a.type === 'call_recording').length;
  const voicemailCount = activities.filter(a => a.type === 'voicemail').length;
  const textCount = activities.filter(a =>
    ['text_inbound', 'text_outbound', 'message_inbound', 'message_outbound'].includes(a.type)
  ).length;
  const emailCount = activities.filter(a => ['email_inbound', 'email_outbound'].includes(a.type)).length;

  const tabs: { id: TabType; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: 'status_changes',
      label: 'Status Changes',
      count: statusCount,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      id: 'calls',
      label: 'Call Recordings',
      count: callCount,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      id: 'voicemails',
      label: 'Voicemails',
      count: voicemailCount,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      id: 'texts',
      label: 'Texts',
      count: textCount,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: 'emails',
      label: 'Emails',
      count: emailCount,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  if (!projectId || !project) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Project not found</p>
        </div>
      </PageLayout>
    );
  }

  const renderEmptyState = () => {
    const emptyMessages: Record<TabType, { title: string; subtitle: string }> = {
      status_changes: { title: 'No status changes yet', subtitle: 'Status updates will appear here as the project progresses.' },
      calls: { title: 'No call recordings', subtitle: 'Call recordings from QUO will appear here.' },
      voicemails: { title: 'No voicemails', subtitle: 'Voicemails from QUO will appear here.' },
      texts: { title: 'No text messages', subtitle: 'Texts from QUO will appear here.' },
      emails: { title: 'No emails', subtitle: 'Emails from Gmail will appear here.' },
    };

    const msg = emptyMessages[activeTab];

    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {tabs.find(t => t.id === activeTab)?.icon && (
            <div className="text-gray-400 scale-150">
              {tabs.find(t => t.id === activeTab)?.icon}
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{msg.title}</h3>
        <p className="text-gray-500">{msg.subtitle}</p>
      </div>
    );
  };

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span>Communications</span>
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
              {customer?.name}
            </span>
          </div>
        }
        subtitle={`${project.address} • ${activities.length} total activities`}
        backLink={{ label: 'Back to Project', to: `/projects/${projectId}` }}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {filteredActivities.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => {
                const colors = getActivityColor(activity.type);
                return (
                  <div key={activity.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0 ${colors.text}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">
                          {activityTypeLabels[activity.type] || activity.type}
                        </span>
                        <span className="text-sm text-gray-500">{formatDate(activity.createdAt)}</span>
                      </div>
                      <p className="text-gray-600">{activity.content}</p>
                      {activity.duration && (
                        <p className="text-sm text-gray-400 mt-1">
                          Duration: {formatDuration(activity.duration)}
                        </p>
                      )}
                      {activity.from && (
                        <p className="text-sm text-gray-400 mt-1">
                          From: {activity.from}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
