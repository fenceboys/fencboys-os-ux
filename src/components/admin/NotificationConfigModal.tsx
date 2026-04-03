import React, { useState } from 'react';
import { ProjectStatusConfig } from '../../types';
import { Button } from '../ui';

interface NotificationConfigModalProps {
  status: ProjectStatusConfig;
  onSave: (notifications: ProjectStatusConfig['notifications']) => void;
  onClose: () => void;
}

const slackChannels = [
  '#fb-ops',
  '#fb-sales',
  '#fb-general',
  '#fb-installations',
  '#fb-permits',
];

const mergeTags = [
  '{{customer_name}}',
  '{{project_name}}',
  '{{project_address}}',
  '{{old_status}}',
  '{{new_status}}',
  '{{date}}',
  '{{project_url}}',
];

export const NotificationConfigModal: React.FC<NotificationConfigModalProps> = ({
  status,
  onSave,
  onClose,
}) => {
  const [notifications, setNotifications] = useState({ ...status.notifications });

  const handleSlackChange = (field: 'enabled' | 'channel', value: boolean | string) => {
    setNotifications((prev) => ({
      ...prev,
      slack: { ...prev.slack, [field]: value },
    }));
  };

  const handleSmsChange = (field: 'enabled' | 'template', value: boolean | string) => {
    setNotifications((prev) => ({
      ...prev,
      sms: { ...prev.sms, [field]: value },
    }));
  };

  const handleEmailChange = (field: 'enabled' | 'subject' | 'body', value: boolean | string) => {
    setNotifications((prev) => ({
      ...prev,
      email: { ...prev.email, [field]: value },
    }));
  };

  const insertMergeTag = (
    tag: string,
    target: 'sms' | 'emailSubject' | 'emailBody',
    textareaRef?: HTMLTextAreaElement | HTMLInputElement | null
  ) => {
    if (target === 'sms') {
      setNotifications((prev) => ({
        ...prev,
        sms: { ...prev.sms, template: prev.sms.template + tag },
      }));
    } else if (target === 'emailSubject') {
      setNotifications((prev) => ({
        ...prev,
        email: { ...prev.email, subject: prev.email.subject + tag },
      }));
    } else if (target === 'emailBody') {
      setNotifications((prev) => ({
        ...prev,
        email: { ...prev.email, body: prev.email.body + tag },
      }));
    }
  };

  const handleResetDefaults = () => {
    setNotifications({
      slack: { enabled: false, channel: '' },
      sms: { enabled: false, template: '' },
      email: { enabled: false, subject: '', body: '' },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(notifications);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Notification Config: {status.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Slack Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="slack-enabled"
                checked={notifications.slack.enabled}
                onChange={(e) => handleSlackChange('enabled', e.target.checked)}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="slack-enabled" className="text-sm font-medium text-gray-700">
                Send Slack notification
              </label>
            </div>
            {notifications.slack.enabled && (
              <div className="ml-7">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Channel
                </label>
                <select
                  value={notifications.slack.channel}
                  onChange={(e) => handleSlackChange('channel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select channel...</option>
                  {slackChannels.map((channel) => (
                    <option key={channel} value={channel}>
                      {channel}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* SMS Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="sms-enabled"
                checked={notifications.sms.enabled}
                onChange={(e) => handleSmsChange('enabled', e.target.checked)}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="sms-enabled" className="text-sm font-medium text-gray-700">
                Send SMS notification
              </label>
            </div>
            {notifications.sms.enabled && (
              <div className="ml-7 space-y-2">
                {/* Merge Tags */}
                <div className="flex flex-wrap gap-1">
                  {mergeTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => insertMergeTag(tag, 'sms')}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <textarea
                  value={notifications.sms.template}
                  onChange={(e) => handleSmsChange('template', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  rows={3}
                  placeholder="Enter SMS template..."
                />
              </div>
            )}
          </div>

          {/* Email Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="email-enabled"
                checked={notifications.email.enabled}
                onChange={(e) => handleEmailChange('enabled', e.target.checked)}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="email-enabled" className="text-sm font-medium text-gray-700">
                Send Email notification
              </label>
            </div>
            {notifications.email.enabled && (
              <div className="ml-7 space-y-4">
                {/* Subject */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {mergeTags.slice(0, 4).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertMergeTag(tag, 'emailSubject')}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={notifications.email.subject}
                    onChange={(e) => handleEmailChange('subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Email subject..."
                  />
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Body
                  </label>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {mergeTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertMergeTag(tag, 'emailBody')}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={notifications.email.body}
                    onChange={(e) => handleEmailChange('body', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    rows={6}
                    placeholder="Enter email body..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <Button variant="ghost" type="button" onClick={handleResetDefaults}>
              Reset to Defaults
            </Button>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
