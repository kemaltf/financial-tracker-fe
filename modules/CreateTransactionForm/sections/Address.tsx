import React from 'react';
import { TransactionFormValues } from '..';
import { Divider, Grid, TextInput, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

type Props = {
  form: UseFormReturnType<TransactionFormValues>;
};

export const Address = ({ form }: Props) => {
  return (
    <>
      <Divider my="md" w="100%" />
      <Title order={4} px="8px">
        Address
      </Title>
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
    </>
  );
};
