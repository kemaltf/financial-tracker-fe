import React from 'react';
import { Grid, Group, TextInput, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { TransactionFormValues } from '../form';

type Props = {
  form: UseFormReturnType<TransactionFormValues>;
};

export const Address = ({ form }: Props) => {
  return (
    <Grid.Col span={12} p={0}>
      <Group p="apart" mb="xs" justify="space-between">
        <Title order={4}>Address</Title>
      </Group>
      <Grid align="flex-start">
        <Grid.Col span={12}>
          <TextInput
            label="Recipient Name"
            placeholder="Recipient Name"
            {...form.getInputProps('address.recipientName')}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Address Line 1"
            placeholder="Address Line 1"
            {...form.getInputProps('address.addressLine1')}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Address Line 2"
            placeholder="Address Line 2"
            {...form.getInputProps('address.addressLine2')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="City" placeholder="City" {...form.getInputProps('address.city')} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="State" placeholder="State" {...form.getInputProps('address.state')} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Postal Code"
            placeholder="Postal Code"
            {...form.getInputProps('address.postalCode')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Phone Number"
            placeholder="Phone Number"
            {...form.getInputProps('address.phoneNumber')}
          />
        </Grid.Col>
      </Grid>
    </Grid.Col>
  );
};
