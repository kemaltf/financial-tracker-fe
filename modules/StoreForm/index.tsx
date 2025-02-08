'use client';

import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Box, Button, rem, Stack, TextInput, Title } from '@mantine/core';
import TextAreaWithCounter from '@/components/TextAreaCount';
import {
  useCreateStoreMutation,
  useEditStoreMutation,
  useLazyGetStoreQuery,
} from '@/lib/features/api';
import { StoreFormValues, useStoreForm } from '@/modules/StoreForm/form';

const StoreForm = () => {
  const params = useParams(); // Ambil ID dari URL
  const path = usePathname().split('/')[3];

  const id = params?.id as string | undefined;
  const form = useStoreForm();
  const router = useRouter();
  const [createStore] = useCreateStoreMutation();
  const [editStore] = useEditStoreMutation();

  const handleSubmit = async (values: StoreFormValues) => {
    if (path === 'edit' && id) {
      const result = await editStore({ ...values, id }).unwrap();
      if (result.status === 'success') {
        router.push('/dashboard/stores');
        form.reset();
      }
    } else {
      const result = await createStore(values).unwrap();
      if (result.status === 'success') {
        router.push('/dashboard/stores');
        form.reset();
      }
    }
  };

  const [fetchStore, { isFetching, isLoading }] = useLazyGetStoreQuery();

  useEffect(() => {
    if (id) {
      fetchStore({ id }).then((result) => {
        if (result.data?.data) {
          form.setValues({
            name: result.data.data.name,
            description: result.data.data.description,
          });
        }
      });
    }
  }, [id, fetchStore]);

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} style={{ maxWidth: 400 }}>
      <Stack gap={rem(16)}>
        <Title order={3}>Create Store</Title>
        <TextInput
          label="Nama Store"
          placeholder="Masukkan nama store"
          {...form.getInputProps('name')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        <TextAreaWithCounter
          label="Deskripsi"
          placeholder="Masukkan deskripsi store"
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
        <Button type="submit" disabled={isFetching || isLoading}>
          Simpan
        </Button>
      </Stack>
    </Box>
  );
};

export default StoreForm;
