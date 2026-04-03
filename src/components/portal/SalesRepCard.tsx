import React from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Salesperson } from '../../types';

interface SalesRepCardProps {
  salesperson: Salesperson;
}

export const SalesRepCard: React.FC<SalesRepCardProps> = ({ salesperson }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Sales Representative</CardTitle>
      </CardHeader>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {salesperson.avatar ? (
            <img
              src={salesperson.avatar}
              alt={salesperson.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {salesperson.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-semibold text-lg">{salesperson.name}</p>
          <p className="text-gray-600 mt-1 break-all">
            <a href={`mailto:${salesperson.email}`} className="text-blue-600 hover:underline">
              {salesperson.email}
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Have questions? Reach out anytime.
          </p>
        </div>
      </div>
    </Card>
  );
};
