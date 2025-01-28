'use client';

import React from 'react';
import { z } from 'zod';
import { Button, Grid, Group, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useGetTransactionTypesQuery } from '@/lib/features/api';

const transactionSchema = z.object({
  transactionTypeId: z.number().min(1, { message: 'Transaction Type ID is required' }),
  amount: z.number().min(0.01, { message: 'Amount must be greater than 0' }),
  note: z.string().optional(),
  debitAccountId: z.number().min(1, { message: 'Debit Account ID is required' }),
  creditAccountId: z.number().min(1, { message: 'Credit Account ID is required' }),
  customerId: z.number().optional(),
  debtorId: z.number().optional(),
  creditorId: z.number().optional(),
  storeId: z.number().optional(),
  dueDate: z.date().optional(),
});

interface AddTransactionFormProps {
  onClose: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onClose }) => {
  const { data, error, isLoading } = useGetTransactionTypesQuery();

  const form = useForm({
    validate: zodResolver(transactionSchema),
    initialValues: {
      transactionTypeId: 0,
      amount: 0,
      note: '',
      debitAccountId: 0,
      creditAccountId: 0,
      customerId: undefined,
      debtorId: undefined,
      creditorId: undefined,
      storeId: undefined,
      dueDate: undefined,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    onClose();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Grid>
        <Grid.Col span={12}>
          <Select
            label="Transaction Type"
            placeholder="Select transaction type"
            data={data?.data || []}
            {...form.getInputProps('transactionTypeId')}
            required
            disabled={isLoading}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <NumberInput label="Amount" {...form.getInputProps('amount')} required />
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
        <Grid.Col span={6}>
          <NumberInput
            label="Debit Account ID"
            {...form.getInputProps('debitAccountId')}
            required
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label="Credit Account ID"
            {...form.getInputProps('creditAccountId')}
            required
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput label="Customer ID" {...form.getInputProps('customerId')} />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput label="Debtor ID" {...form.getInputProps('debtorId')} />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput label="Creditor ID" {...form.getInputProps('creditorId')} />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput label="Store ID" {...form.getInputProps('storeId')} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Due Date" {...form.getInputProps('dueDate')} />
        </Grid.Col>
      </Grid>
      <Group justify="end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};

export default AddTransactionForm;
