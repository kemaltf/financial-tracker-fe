import React from 'react';
import { Button, Grid, Group, Select, Title, Tooltip } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useGetFinancialPartyOptQuery } from '@/lib/features/api';
import { TransactionFormValues } from '../form';

type Props = {
  form: UseFormReturnType<TransactionFormValues>;
};

export const CustomerSection = ({ form }: Props) => {
  const { data, isLoading } = useGetFinancialPartyOptQuery({
    role: 'CUSTOMER',
  });

  const customerData = data?.data || [];

  return (
    <Grid.Col span={12} p={0}>
      <Group p="apart" mb="xs" justify="space-between">
        <Title order={4}>Customer</Title>
        <Tooltip label="Add a new customer, debtor, or creditor" withArrow>
          <Button
            onClick={() => window.open('/register-financial-party', '_blank')}
            variant="subtle"
            size="xs"
            p={0}
          >
            + Create New Customer
          </Button>
        </Tooltip>
      </Group>
      <Grid align="flex-start">
        <Grid.Col span={12}>
          <Select
            label="Customer"
            placeholder="Select customer"
            data={customerData}
            {...form.getInputProps('customerId')}
            disabled={isLoading}
            searchable
            allowDeselect
          />
        </Grid.Col>
      </Grid>
    </Grid.Col>
  );
};
