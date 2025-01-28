'use client';

import React from 'react';
import { BarChart } from '@mantine/charts';
import { Container, Grid } from '@mantine/core';
import InfoCard from '../../components/InfoCard';

// import { TransactionGraph } from '../../components/TransactionGraph';

const DashboardPage = () => {
  const transactionData = [
    { month: 'January', Smartphones: 1200, Laptops: 900, Tablets: 200 },
    { month: 'February', Smartphones: 1900, Laptops: 1200, Tablets: 400 },
    { month: 'March', Smartphones: 400, Laptops: 1000, Tablets: 200 },
    { month: 'April', Smartphones: 1000, Laptops: 200, Tablets: 800 },
    { month: 'May', Smartphones: 800, Laptops: 1400, Tablets: 1200 },
    { month: 'June', Smartphones: 750, Laptops: 600, Tablets: 1000 },
  ];

  return (
    <Container>
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
        <Grid.Col span={12}>
          <InfoCard
            title="Transaction History"
            data={[
              { label: '2023-10-01', value: 'Salary: $5000' },
              { label: '2023-10-05', value: 'Groceries: -$200' },
              { label: '2023-10-10', value: 'Rent: -$1000' },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={12}></Grid.Col>
      </Grid>
      <BarChart
        h={300}
        data={transactionData}
        dataKey="month"
        series={[
          { name: 'Smartphones', color: 'violet.6' },
          { name: 'Laptops', color: 'blue.6' },
          { name: 'Tablets', color: 'teal.6' },
        ]}
        tickLine="y"
      />
    </Container>
  );
};

export default DashboardPage;
