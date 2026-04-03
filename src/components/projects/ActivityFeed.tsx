import React from 'react';
import { Button } from '../ui';
import { useData } from '../../context/DataContext';

interface ActivityFeedProps {
  projectId: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ projectId }) => {
  const { getActivitiesByProjectId } = useData();

  const activities = getActivitiesByProjectId(projectId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return (
          <div className="bg-blue-100 rounded-full p-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        );
      case 'message_inbound':
        return (
          <div className="bg-green-100 rounded-full p-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
      case 'message_outbound':
        return (
          <div className="bg-purple-100 rounded-full p-2">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        );
      case 'proposal_sent':
        return (
          <div className="bg-yellow-100 rounded-full p-2">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'proposal_signed':
        return (
          <div className="bg-green-100 rounded-full p-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'payment_received':
        return (
          <div className="bg-green-100 rounded-full p-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-full p-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {activities.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No activity yet</p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start space-x-3 ${
              activity.type === 'message_inbound' ? 'border-l-4 border-blue-400 pl-3' : ''
            }`}
          >
            {getActivityIcon(activity.type)}
            <div className="flex-1 min-w-0">
              {activity.from && (
                <p className="text-xs font-medium text-blue-600 uppercase mb-1">
                  From {activity.from}
                </p>
              )}
              <p className="text-sm text-gray-900">{activity.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(activity.createdAt).toLocaleString()}
              </p>
              {activity.type === 'message_inbound' && (
                <div className="mt-2 flex space-x-2">
                  <Button variant="outline" size="sm">
                    Reply SMS
                  </Button>
                  <Button variant="outline" size="sm">
                    Reply Email
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
