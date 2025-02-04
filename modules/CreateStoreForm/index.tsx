'use client';

import { useRouter } from 'next/navigation';
import { Box, Button, TextInput, Title } from '@mantine/core';
import TextAreaWithCounter from '@/components/TextAreaCount';
import { useCreateStoreMutation } from '@/lib/features/api';
import { StoreFormValues, useStoreForm } from '@/modules/CreateStoreForm/form';

const CreateTransactionForm = () => {
  const form = useStoreForm();
  const router = useRouter();
  const [createStore] = useCreateStoreMutation();

  const handleSubmit = async (values: StoreFormValues) => {
    console.log(values);
    const result = await createStore(values).unwrap();
    if (result.status === 'success') {
      router.push('/dashboard/stores');
      form.reset();
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} style={{ maxWidth: 400 }}>
      <Title order={3}>Create Store</Title>
      <TextInput
        label="Nama Store"
        placeholder="Masukkan nama store"
        {...form.getInputProps('name')}
        withAsterisk
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
        withAsterisk
      />

      <Button type="submit" mt="md">
        Simpan
      </Button>
    </Box>
  );
};

export default CreateTransactionForm;
