import React from 'react';
import { PageLayout } from '../components/layout';
import { CustomerList } from '../components/customers';

export const Customers: React.FC = () => {
  return (
    <PageLayout>
      <CustomerList />
    </PageLayout>
  );
};
