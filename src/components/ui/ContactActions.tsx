import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useData } from '../../context/DataContext';

interface ContactActionsProps {
  phone: string;
  email: string;
  customerName?: string;
  size?: 'sm' | 'md';
  className?: string;
}

type LineType = 'main' | 'personal';

export const ContactActions: React.FC<ContactActionsProps> = ({
  phone,
  email,
  customerName,
  size = 'md',
  className = '',
}) => {
  const { users } = useData();
  const [showLineModal, setShowLineModal] = useState(false);
  const [actionType, setActionType] = useState<'call' | 'text' | null>(null);

  // Get current signed-in user (in mockup, we'll use the first active user)
  const currentUser = users.find(u => u.status === 'active');

  const handleCallClick = () => {
    setActionType('call');
    setShowLineModal(true);
  };

  const handleTextClick = () => {
    setActionType('text');
    setShowLineModal(true);
  };

  const handleLineSelect = (lineType: LineType) => {
    // Simulate QUO API call
    const lineLabel = lineType === 'main' ? 'Main Line' : 'Personal Line';
    console.log(`[QUO API] ${actionType === 'call' ? 'Calling' : 'Texting'} ${phone} via ${lineLabel}`);

    // In a real implementation, this would trigger QUO API
    // For mockup, show alert
    alert(`[QUO API Mock]\n${actionType === 'call' ? 'Initiating call' : 'Opening text'} to ${customerName || phone}\nUsing: ${lineLabel}\nUser: ${currentUser?.name || 'Unknown'}`);

    setShowLineModal(false);
    setActionType(null);
  };

  const handleEmailClick = () => {
    // Simulate Gmail API - opens Gmail compose
    const gmailEmail = currentUser?.integrations?.google?.email || currentUser?.email;
    console.log(`[Gmail API] Composing email to ${email} from ${gmailEmail}`);

    // Open Gmail compose in new tab
    const subject = customerName ? `Regarding your project - ${customerName}` : '';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}`;
    window.open(gmailUrl, '_blank');
  };

  const buttonSize = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <>
      <div className={`flex items-center gap-1 ${className}`}>
        {/* Call Button */}
        <button
          onClick={handleCallClick}
          className={`inline-flex items-center gap-1 ${buttonSize} font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-full transition-colors`}
          title={`Call ${phone}`}
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call
        </button>

        {/* Text Button */}
        <button
          onClick={handleTextClick}
          className={`inline-flex items-center gap-1 ${buttonSize} font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors`}
          title={`Text ${phone}`}
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Text
        </button>

        {/* Email Button */}
        <button
          onClick={handleEmailClick}
          className={`inline-flex items-center gap-1 ${buttonSize} font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors`}
          title={`Email ${email}`}
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </button>
      </div>

      {/* Line Selection Modal */}
      <Modal
        isOpen={showLineModal}
        onClose={() => {
          setShowLineModal(false);
          setActionType(null);
        }}
        title={`Select Line for ${actionType === 'call' ? 'Call' : 'Text'}`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose which line to use for {actionType === 'call' ? 'calling' : 'texting'} {customerName || phone}:
          </p>

          <div className="space-y-2">
            <button
              onClick={() => handleLineSelect('main')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Main Line</p>
                <p className="text-sm text-gray-500">Company phone number</p>
              </div>
            </button>

            <button
              onClick={() => handleLineSelect('personal')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Personal Line</p>
                <p className="text-sm text-gray-500">Your QUO direct line</p>
              </div>
            </button>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Signed in as: <span className="font-medium">{currentUser?.name || 'Unknown'}</span>
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
