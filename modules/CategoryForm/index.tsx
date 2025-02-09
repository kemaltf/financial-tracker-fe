'use client';

import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Box, Button, rem, Select, Stack, TextInput, Title } from '@mantine/core';
import TextAreaWithCounter from '@/components/TextAreaCount';
import {
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useGetStoresQuery,
  useLazyGetCategoryQuery,
} from '@/lib/features/api';
import { CategoryFormValues, useCategoryForm } from './form';

// import { CategoryFormValues, useCategoryForm } from '@/modules/CreateCategoryForm/form';

const CategoryForm = () => {
  const params = useParams();
  const path = usePathname().split('/')[4];
  console.log(path);
  const id = params?.id as string | undefined;

  console.log(id);
  const form = useCategoryForm();
  const router = useRouter();

  const [createCategory] = useCreateCategoryMutation();
  const { data: dataStore, isLoading: isLoadingStore } = useGetStoresQuery();
  const storesData = dataStore?.data || [];

  const [editCategory] = useEditCategoryMutation();
  const [fetchCategory, { isFetching, isLoading }] = useLazyGetCategoryQuery();

  const handleSubmit = async (values: CategoryFormValues) => {
    if (path === 'edit' && id) {
      const result = await editCategory({
        ...values,
        storeId: Number(values.storeId),
        id,
      }).unwrap();
      if (result.status === 'success') {
        router.push('/dashboard/products/categories');
        form.reset();
      }
    } else {
      const result = await createCategory({ ...values, storeId: Number(values.storeId) }).unwrap();
      if (result.status === 'success') {
        router.push('/dashboard/products/categories');
        form.reset();
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchCategory({ id }).then((result) => {
        if (result.data?.data) {
          form.setValues({
            name: result.data.data.name,
            description: result.data.data.description,
            storeId: String(result.data.data.store.id), // Convert to string for Select input
          });
        }
      });
    }
  }, [id, fetchCategory]);

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} style={{ maxWidth: 400 }}>
      <Stack gap={rem(16)}>
        <Title order={3}>{path === 'edit' ? 'Edit Category' : 'Create Category'}</Title>
        <TextInput
          label="Nama Kategori"
          placeholder="Masukkan nama kategori"
          {...form.getInputProps('name')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        <TextAreaWithCounter
          label="Deskripsi"
          placeholder="Masukkan deskripsi kategori"
          {...form.getInputProps('description')}
          onChange={(event) => form.setFieldValue('description', event.currentTarget.value)}
          minRows={4}
          maxRows={10}
          styles={{
            input: {
              paddingBottom: '30px', // Tambahkan ruang di bawah untuk counter
              position: 'relative',
            },
          }}
          disabled={isFetching || isLoading}
          withAsterisk
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

export default CategoryForm;
