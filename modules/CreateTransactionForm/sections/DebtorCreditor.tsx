import React from 'react';
import { Button, Grid, Group, Select, Title, Tooltip } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import { useGetFinancialPartyOptQuery } from '@/lib/features/api';
import { TransactionFormValues } from '../form';

type Props = {
  form: UseFormReturnType<TransactionFormValues>;
};

export const DebtorCreditor = ({ form }: Props) => {
  const { data: debtors, isLoading: isLoadingDebtors } = useGetFinancialPartyOptQuery({
    role: 'DEBTOR',
  });
  const { data: creditors, isLoading: isLoadingCreditors } = useGetFinancialPartyOptQuery({
    role: 'CREDITOR',
  });
  return (
    <Grid.Col span={12} p={0}>
      <Group p="apart" mb="xs" justify="space-between">
        <Title order={4}>Debtor And Creditor</Title>
        <Tooltip label="Add a new customer, debtor, or creditor" withArrow>
          <Button
            onClick={() => window.open('/register-financial-party', '_blank')}
            variant="subtle"
            size="xs"
            p={0}
          >
            + Create New
          </Button>
        </Tooltip>
      </Group>
      <Grid align="flex-start">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Debtors"
            placeholder="Select debtor"
            data={debtors?.data || []}
            {...form.getInputProps('debtorId')}
            disabled={isLoadingDebtors}
            searchable
            allowDeselect
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Creditor"
            placeholder="Select creditor"
            data={creditors?.data || []}
            {...form.getInputProps('creditorId')}
            disabled={isLoadingCreditors}
            searchable
            allowDeselect
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DateTimePicker
            label="Due date"
            placeholder="Due date"
            withAsterisk
            {...form.getInputProps('dueDate')}
          />
        </Grid.Col>
      </Grid>
    </Grid.Col>
  );
};
