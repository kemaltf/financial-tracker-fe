import React from 'react';
import { Button, Divider, Grid, Group, Select, Title, Tooltip } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useGetStoresQuery } from '@/lib/features/api';
import { TransactionFormValues } from '../form';

type Props = {
  form: UseFormReturnType<TransactionFormValues>;
};
export function StoreData({ form }: Props) {
  const { data, isLoading } = useGetStoresQuery();

  const storesData = data?.data || [];

  return (
    <Grid.Col span={12} p={0}>
      <Group p="apart" mb="xs" justify="space-between">
        <Title order={4}>Store</Title>
        <Tooltip label="Add a new store" withArrow>
          <Button
            onClick={() => window.open('/register-financial-party', '_blank')}
            variant="subtle"
            size="xs"
            p={0}
          >
            + Create New store
          </Button>
        </Tooltip>
      </Group>
      <Grid>
        <Grid.Col span={12} style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Select
            label="Store"
            placeholder="Select store"
            data={storesData}
            {...form.getInputProps('storeId')}
            disabled={isLoading}
            searchable
            allowDeselect
            w="100%"
            required
          />
        </Grid.Col>

        <Divider my="md" w="100%" />
      </Grid>
    </Grid.Col>
  );
}
