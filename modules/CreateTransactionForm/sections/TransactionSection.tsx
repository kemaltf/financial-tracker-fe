import React, { useEffect, useMemo } from 'react';
import { Grid, Group, NumberInput, Select, Text, Textarea, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useGetTransactionTypesQuery, useLazyGetAvailableAccountsQuery } from '@/lib/features/api';
import { isNullOrUndefined, isZero } from '@/utils/helpers';
import { TransactionFormValues } from '../form';

type Props = {
  form: UseFormReturnType<TransactionFormValues>;
};

export const TransactionSection = ({ form }: Props) => {
  const { data: transactionTypes, isLoading: isLoadingTransactionTypes } =
    useGetTransactionTypesQuery();

  const transactionTypesData = transactionTypes?.data || [];

  const [
    fetchAvailableAccounts,
    {
      data: availableAccounts,
      isLoading: isLoadingAvailableAccount,
      reset: resetAvailableAccounts,
    },
  ] = useLazyGetAvailableAccountsQuery();

  const debitAccountsData = availableAccounts?.data.debitAccounts || [];
  const creditAccountsData = availableAccounts?.data.creditAccounts || [];

  useEffect(() => {
    if (transactionTypeIsExist) {
      fetchAvailableAccounts(Number(form.values.transactionTypeId));
    } else {
      form.reset();
      resetAvailableAccounts();
    }
  }, [form.values.transactionTypeId, fetchAvailableAccounts]);

  const transactionTypeIsExist =
    !isNullOrUndefined(form.values.transactionTypeId) && !isZero(form.values.transactionTypeId);

  const selectedTransactionType = useMemo(
    () =>
      transactionTypeIsExist
        ? transactionTypes?.data.find(
            (type) => type.value === form.values.transactionTypeId.toString() || ''
          )
        : undefined,
    [form.values.transactionTypeId, transactionTypes, transactionTypeIsExist]
  );
  return (
    <Grid.Col span={12} p={0}>
      <Group p="apart" mb="xs" justify="space-between">
        <Title order={4}>Transaction Detail</Title>
      </Group>
      <Grid>
        <Grid.Col span={12}>
          <Select
            label="Transaction Type"
            placeholder="Select transaction type"
            data={transactionTypesData}
            {...form.getInputProps('transactionTypeId')}
            required
            disabled={isLoadingTransactionTypes}
            searchable
          />
          {selectedTransactionType && (
            <Text size="sm" c="dimmed">
              {selectedTransactionType.description}
            </Text>
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Debit Account"
            placeholder="Select debit account"
            data={debitAccountsData}
            required
            disabled={!availableAccounts || isLoadingAvailableAccount}
            {...form.getInputProps('debitAccountId')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Credit Account"
            placeholder="Select credit account"
            data={creditAccountsData}
            required
            disabled={!availableAccounts || isLoadingAvailableAccount}
            {...form.getInputProps('creditAccountId')}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <NumberInput
            leftSection="Rp"
            label="Amount (Rupiah)"
            placeholder="10,000,000"
            {...form.getInputProps('amount')}
            required
            thousandSeparator
            hideControls
            allowNegative={false}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <div style={{ position: 'relative', width: '100%', minHeight: '130px' }}>
            <Textarea
              label="Note"
              placeholder="Note"
              {...form.getInputProps('note')}
              onChange={(event) => form.setFieldValue('note', event.currentTarget.value)}
              minRows={4}
              maxRows={10}
              styles={{
                input: {
                  paddingBottom: '30px', // Tambahkan ruang di bawah untuk counter
                  position: 'relative',
                },
              }}
              withAsterisk
            />
            <div
              style={{
                position: 'absolute',
                bottom: '30px', // Jarak dari bawah
                right: '12px', // Jarak dari kanan
                fontSize: '12px', // Ukuran font kecil
                color: form.values.note.length >= 500 ? 'red' : 'gray', // Warna dinamis
              }}
            >
              {form.values.note.length} / {500}
            </div>
          </div>
        </Grid.Col>
      </Grid>
    </Grid.Col>
  );
};
