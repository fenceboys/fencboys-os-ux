/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        background: '#F8F9FA',
        card: '#FFFFFF',
        'text-primary': '#1F2937',
        'text-muted': '#6B7280',
        border: '#E5E7EB',
        'status-yellow': '#FEF3C7',
        'status-yellow-text': '#92400E',
        'status-green': '#D1FAE5',
        'status-green-text': '#065F46',
        'status-blue': '#DBEAFE',
        'status-blue-text': '#1E40AF',
        'status-orange': '#FFEDD5',
        'status-orange-text': '#9A3412',
        'status-red': '#FEE2E2',
        'status-red-text': '#991B1B',
        'status-purple': '#EDE9FE',
        'status-purple-text': '#6B21A8',
        'status-gray': '#F3F4F6',
        'status-gray-text': '#374151',
      },
    },
  },
  plugins: [],
}
