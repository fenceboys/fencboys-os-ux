import React from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Customer } from '../../types';

interface CustomerInfoCardProps {
  customer: Customer;
}

export const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ customer }) => {
  const fullAddress = `${customer.address}, ${customer.city}, ${customer.state} ${customer.zip}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Information</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Customer Name</label>
          <p className="text-gray-900 font-medium">{customer.name}</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Project Address</label>
          <p className="text-gray-900">{fullAddress}</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Phone</label>
          <p className="text-gray-900">
            <a href={`tel:${customer.phone}`} className="text-blue-600 hover:underline">
              {customer.phone}
            </a>
          </p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
          <p className="text-gray-900">
            <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
              {customer.email}
            </a>
          </p>
        </div>
      </div>
    </Card>
  );
};
