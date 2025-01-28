'use client';

import React from 'react';
import { z } from 'zod';
import { Button, Group, NumberInput, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';

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
      <NumberInput
        label="Transaction Type ID"
        {...form.getInputProps('transactionTypeId')}
        required
      />
      <NumberInput label="Amount" {...form.getInputProps('amount')} required />
      <TextInput label="Note" {...form.getInputProps('note')} />
      <NumberInput label="Debit Account ID" {...form.getInputProps('debitAccountId')} required />
      <NumberInput label="Credit Account ID" {...form.getInputProps('creditAccountId')} required />
      <NumberInput label="Customer ID" {...form.getInputProps('customerId')} />
      <NumberInput label="Debtor ID" {...form.getInputProps('debtorId')} />
      <NumberInput label="Creditor ID" {...form.getInputProps('creditorId')} />
      <NumberInput label="Store ID" {...form.getInputProps('storeId')} />
      <TextInput label="Due Date" {...form.getInputProps('dueDate')} />
      <Group justify="end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};

export default AddTransactionForm;
