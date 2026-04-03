import React, { useState } from 'react';

interface MockCalendlyWidgetProps {
  salespersonName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  onBooking?: (date: Date, time: string) => void;
}

export const MockCalendlyWidget: React.FC<MockCalendlyWidgetProps> = ({
  salespersonName = 'Cody McCraw',
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  customerAddress = '',
  onBooking
}) => {
  const [step, setStep] = useState<'calendar' | 'details'>('calendar');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Form fields (pre-filled if available)
  const [firstName, setFirstName] = useState(customerName.split(' ')[0] || '');
  const [lastName, setLastName] = useState(customerName.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(customerEmail);
  const [phone, setPhone] = useState(customerPhone);
  const [address, setAddress] = useState(customerAddress);
  const [notes, setNotes] = useState('');

  // Get current month data
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Generate calendar days
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Available times (mock)
  const availableTimes = ['9:00am', '11:00am', '1:00pm', '3:00pm'];

  // Days that are "available" (weekdays after today)
  const isAvailable = (day: number) => {
    if (day <= today.getDate()) return false;
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Not weekend
  };

  const getSelectedDateString = () => {
    if (!selectedDate) return '';
    const date = new Date(currentYear, currentMonth, selectedDate);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const handleSchedule = () => {
    if (selectedDate && selectedTime && onBooking) {
      const bookingDate = new Date(currentYear, currentMonth, selectedDate);
      onBooking(bookingDate, selectedTime);
    }
  };

  // Calendar Step
  if (step === 'calendar') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-xl mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-sm text-gray-500 text-center">{salespersonName}</p>
          <h3 className="text-lg font-bold text-gray-900 text-center">On-Site Fence Consultation</h3>
          <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              2 hr
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Your Home
            </span>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 mb-4 text-center">Select a Date & Time</h4>

          <div className="flex gap-6">
            {/* Calendar */}
            <div className="flex-1">
              {/* Month Navigation */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="font-medium text-gray-900">{monthName}</span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="text-center text-xs text-gray-400 font-medium py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="h-9" />;
                  }

                  const available = isAvailable(day);
                  const isSelected = selectedDate === day;
                  const isToday = day === today.getDate();

                  return (
                    <button
                      key={day}
                      onClick={() => available && setSelectedDate(day)}
                      disabled={!available}
                      className={`
                        h-9 w-9 rounded-full text-sm font-medium flex items-center justify-center mx-auto transition-colors
                        ${isSelected ? 'bg-blue-600 text-white' : ''}
                        ${!isSelected && available ? 'text-gray-900 hover:bg-blue-50' : ''}
                        ${!available ? 'text-gray-300 cursor-not-allowed' : ''}
                        ${isToday && !isSelected ? 'ring-1 ring-blue-600' : ''}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Timezone */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-700">Time zone</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Central Time - US & Canada
                </p>
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="w-44">
                <p className="font-medium text-gray-900 mb-2">
                  {getSelectedDateString()}
                </p>
                <div className="bg-green-50 text-green-700 text-sm py-1 px-3 rounded mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  times you're available
                </div>
                <div className="space-y-2">
                  {availableTimes.map(time => (
                    <div key={time} className="flex gap-2">
                      <button
                        onClick={() => setSelectedTime(selectedTime === time ? null : time)}
                        className={`
                          flex-1 py-2.5 px-4 text-sm font-semibold rounded-md border transition-colors flex items-center justify-center gap-2
                          ${selectedTime === time
                            ? 'bg-gray-600 text-white border-gray-600'
                            : 'text-blue-600 border-blue-200 hover:border-blue-400'}
                        `}
                      >
                        {selectedTime !== time && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                        {time}
                      </button>
                      {selectedTime === time && (
                        <button
                          onClick={() => setStep('details')}
                          className="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-1 text-xs text-gray-400">
          <span>powered by</span>
          <span className="font-semibold text-gray-500">Calendly</span>
        </div>
      </div>
    );
  }

  // Details Step
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <button
          onClick={() => setStep('calendar')}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h3 className="text-xl font-bold text-gray-900">Enter Details</h3>
        <p className="text-sm text-gray-500 mt-1">
          {getSelectedDateString()} at {selectedTime}
        </p>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm the best phone number to reach you at on the day of our appointment. <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-500 text-sm">
              +1
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm the address we will be coming out to.
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Feel free to provide any information you'd like us to know about your project, parking at your location, pets to look out for, etc.
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <button
          onClick={handleSchedule}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
        >
          Schedule Event
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-1 text-xs text-gray-400">
        <span>powered by</span>
        <span className="font-semibold text-gray-500">Calendly</span>
      </div>
    </div>
  );
};
