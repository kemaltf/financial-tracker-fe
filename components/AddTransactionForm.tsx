'use client';

import React, { useEffect, useMemo } from 'react';
import { z } from 'zod';
import {
  Button,
  Container,
  Grid,
  Group,
  NumberInput,
  Select,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import {
  useGetCustomersQuery,
  useGetStoreQuery,
  useGetTransactionTypesQuery,
  useLazyGetAvailableAccountsQuery,
} from '@/lib/features/api';
import { isNullOrUndefined, isZero } from '@/utils/helpers';

const transactionSchema = z.object({
  transactionTypeId: z.number().min(1, { message: 'Transaction Type ID is required' }),
  amount: z.number().min(0.01, { message: 'Amount must be greater than 0' }),
  note: z.string(),
  debitAccountId: z.number().min(1, { message: 'Debit Account ID is required' }).nullable(),
  creditAccountId: z.number().min(1, { message: 'Credit Account ID is required' }).nullable(),
  customerId: z.number().optional().nullable(),
  debtorId: z.number().optional().nullable(),
  creditorId: z.number().optional().nullable(),
  storeId: z.number().optional().nullable(),
  dueDate: z.date().optional().nullable(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface AddTransactionFormProps {
  onClose: () => void;
}

const initialValues = {
  transactionTypeId: 0,
  amount: 0,
  note: '',
  debitAccountId: null,
  creditAccountId: null,
  customerId: null,
  debtorId: null,
  creditorId: null,
  storeId: null,
  dueDate: null,
};

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onClose }) => {
  const { data: transactionTypes, isLoading: isLoadingTransactionTypes } =
    useGetTransactionTypesQuery();
  const { data: customers, isLoading: isLoadingCustomers } = useGetCustomersQuery({
    role: 'CUSTOMER',
  });
  const { data: debtors, isLoading: isLoadingDebtors } = useGetCustomersQuery({ role: 'DEBTOR' });
  const { data: creditors, isLoading: isLoadingCreditors } = useGetCustomersQuery({
    role: 'CREDITOR',
  });
  const { data: stores, isLoading: isLoadingStores } = useGetStoreQuery();

  const form = useForm<TransactionFormValues>({
    validate: zodResolver(transactionSchema),
    initialValues,
  });

  const [
    fetchAvailableAccounts,
    {
      data: availableAccounts,
      isLoading: isLoadingAvailableAccount,
      reset: resetAvailableAccounts,
    },
  ] = useLazyGetAvailableAccountsQuery();

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    onClose();
  };

  const transactionTypeIsExist =
    !isNullOrUndefined(form.values.transactionTypeId) && !isZero(form.values.transactionTypeId);

  useEffect(() => {
    if (transactionTypeIsExist) {
      fetchAvailableAccounts(form.values.transactionTypeId);
    } else {
      form.reset();
      resetAvailableAccounts();
    }
  }, [form.values.transactionTypeId, fetchAvailableAccounts]);

  const selectedTransactionType = useMemo(
    () =>
      transactionTypeIsExist &&
      transactionTypes?.data.find(
        (type) => type.value === form.values.transactionTypeId.toString() || ''
      ),
    [form.values.transactionTypeId, transactionTypes, transactionTypeIsExist]
  );

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <Select
              label="Transaction Type"
              placeholder="Select transaction type"
              data={transactionTypes?.data || []}
              {...form.getInputProps('transactionTypeId')}
              required
              disabled={isLoadingTransactionTypes}
              searchable
            />
            {selectedTransactionType && (
              <Text size="sm" color="dimmed">
                {selectedTransactionType.description}
              </Text>
            )}
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Debit Account"
              placeholder="Select debit account"
              data={availableAccounts?.data.debitAccounts || []}
              required
              disabled={!availableAccounts || isLoadingAvailableAccount}
              {...form.getInputProps('debitAccountId')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Credit Account"
              placeholder="Select credit account"
              data={availableAccounts?.data.creditAccounts || []}
              required
              disabled={!availableAccounts || isLoadingAvailableAccount}
              {...form.getInputProps('creditAccountId')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <NumberInput
              leftSection="Rp"
              label="Amount (Rupiah)"
              {...form.getInputProps('amount')}
              required
              thousandSeparator
              hideControls
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Textarea
                label="Note"
                placeholder="Note"
                {...form.getInputProps('note')}
                onChange={(event) => form.setFieldValue('note', event.currentTarget.value)}
                autosize
                minRows={4}
                maxRows={10}
                styles={{
                  input: {
                    paddingBottom: '30px', // Tambahkan ruang di bawah untuk counter
                    position: 'relative',
                  },
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px', // Jarak dari bawah
                  right: '12px', // Jarak dari kanan
                  fontSize: '12px', // Ukuran font kecil
                  color: form.values.note.length >= 500 ? 'red' : 'gray', // Warna dinamis
                }}
              >
                {form.values.note.length} / {500}
              </div>
            </div>
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              label="Store"
              placeholder="Select store"
              data={stores?.data || []}
              {...form.getInputProps('storeId')}
              disabled={isLoadingStores}
              searchable
              allowDeselect
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Tooltip label="Add a new customer, debtor, or creditor" withArrow>
              <Button
                variant="outline"
                mt="sm"
                w="100%"
                onClick={() => window.open('/register-financial-party', '_blank')}
              >
                Add New Financial Party
              </Button>
            </Tooltip>
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              label="Customer"
              placeholder="Select customer"
              data={customers?.data || []}
              {...form.getInputProps('customerId')}
              disabled={isLoadingCustomers}
              searchable
              allowDeselect
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Debtors"
              placeholder="Select debtor"
              data={debtors?.data || []}
              {...form.getInputProps('debtorId')}
              disabled={isLoadingDebtors}
              searchable
              allowDeselect
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
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <DateTimePicker
              label="Due date"
              placeholder="Due date"
              {...form.getInputProps('dueDate')}
            />
          </Grid.Col>
        </Grid>
        <Group justify="end" mt="md">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Container>
  );
};

export default AddTransactionForm;
