'use client';

import React, { useEffect } from 'react';
import { Container, Grid } from '@mantine/core';
import { FinancialSummary } from '@/components/FinancialSummary';
import { TransactionHistory } from '@/components/TransactionHistory/index';
import { useTransactionHistory } from '@/hooks/use-transaction-history-query';

const DashboardPage = () => {
  const { clearFilter } = useTransactionHistory();

  // CLEAN UP WHEN DISMOUNTED
  useEffect(() => {
    return () => {
      clearFilter();
    };
  }, []);

  return (
    <Container p={0}>
      <Grid>
        <Grid.Col span={12} mb="md">
          <FinancialSummary />
        </Grid.Col>
        <Grid.Col span={12}>
          <TransactionHistory />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
