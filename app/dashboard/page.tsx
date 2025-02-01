'use client';

import React from 'react';
import { Container, Grid } from '@mantine/core';
import { TransactionHistory } from '@/components/TransactionHistory';
import InfoCard from '../../components/InfoCard';

const DashboardPage = () => {
  return (
    <Container p={0}>
      <Grid>
        <Grid.Col span={12}>
          <InfoCard
            title="Financial Summary"
            data={[
              { label: 'Total Income', value: '$5000' },
              { label: 'Total Expenses', value: '$3000' },
              { label: 'Net Savings', value: '$2000' },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <InfoCard
            title="Account Balances"
            data={[
              { label: 'Checking Account', value: '$2000' },
              { label: 'Savings Account', value: '$3000' },
              { label: 'Credit Card', value: '-$500' },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <InfoCard
            title="Budget Overview"
            data={[
              { label: 'Monthly Budget', value: '$4000' },
              { label: 'Spent', value: '$3000' },
              { label: 'Remaining', value: '$1000' },
            ]}
          />
        </Grid.Col>
      </Grid>

      <TransactionHistory />
      {/* <BarChart
        h={300}
        data={transactionData}
        dataKey="month"
        series={[
          { name: 'Smartphones', color: 'violet.6' },
          { name: 'Laptops', color: 'blue.6' },
          { name: 'Tablets', color: 'teal.6' },
        ]}
        tickLine="y"
      /> */}
    </Container>
  );
};

export default DashboardPage;
