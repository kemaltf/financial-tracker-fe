'use client';

import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Box, Button, rem, Select, Stack, TextInput, Title } from '@mantine/core';
import {
  useCreateVariantTypeMutation,
  useEditVariantTypeMutation,
  useGetStoresQuery,
  useLazyGetVariantTypeQuery,
} from '@/lib/features/api';
import { useVariantTypeForm, VariantTypeFormValues } from './form';

const VariantTypeForm = () => {
  const params = useParams();
  const path = usePathname().split('/')[4];
  const id = params?.id as string | undefined;

  const form = useVariantTypeForm();
  const router = useRouter();

  const [createVariantType] = useCreateVariantTypeMutation();
  const { data: dataStore, isLoading: isLoadingStore } = useGetStoresQuery();
  const storesData = dataStore?.data || [];

  const [editVariantType] = useEditVariantTypeMutation();
  const [fetchVarianType, { isFetching, isLoading }] = useLazyGetVariantTypeQuery();

  const handleSubmit = async (values: VariantTypeFormValues) => {
    if (path === 'edit' && id) {
      const result = await editVariantType({
        ...values,
        storeId: Number(values.storeId),
        id,
      }).unwrap();
      if (result.status === 'success') {
        router.push('/dashboard/products/variant-types');
        form.reset();
      }
    } else {
      const result = await createVariantType({
        ...values,
        storeId: Number(values.storeId),
      }).unwrap();
      if (result.status === 'success') {
        router.push('/dashboard/products/variant-types');
        form.reset();
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchVarianType({ id }).then((result) => {
        if (result.data?.data) {
          form.setValues({
            name: result.data.data.name,
            storeId: String(result.data.data.store.id), // Convert to string for Select input
          });
        }
      });
    }
  }, [id, fetchVarianType]);

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} style={{ maxWidth: 400 }}>
      <Stack gap={rem(16)}>
        <Title order={3}>{path === 'edit' ? 'Edit Variant Type' : 'Create Variant Type'}</Title>
        <TextInput
          label="Nama Variant Type"
          placeholder="Masukkan nama variant type"
          {...form.getInputProps('name')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        {/* Select Input untuk Store */}
        <Select
          label="Store"
          placeholder="Select store"
          data={storesData}
          {...form.getInputProps('storeId')}
          disabled={isLoadingStore}
          searchable
          allowDeselect
          w="100%"
          required
        />

        <Button type="submit" disabled={isFetching || isLoading}>
          Simpan
        </Button>
      </Stack>
    </Box>
  );
};

export default VariantTypeForm;
