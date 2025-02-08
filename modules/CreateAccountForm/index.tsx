'use client';

import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Box, Button, rem, Select, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import TextAreaWithCounter from '@/components/TextAreaCount';
import {
  useCreateAccountMutation,
  useEditAccountMutation,
  useLazyGetAccountQuery,
} from '@/lib/features/api';

const accountTypes = ['ASSET', 'LIABILITY', 'REVENUE', 'EXPENSE', 'EQUITY'];

const AccountForm = () => {
  const params = useParams();
  const path = usePathname().split('/')[3];

  const id = params?.id as string | undefined;
  const router = useRouter();
  const [createAccount] = useCreateAccountMutation();
  const [editAccount] = useEditAccountMutation();

  const form = useForm({
    initialValues: {
      name: '',
      type: '',
      description: '',
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Nama harus diisi'),
      type: (value) => (accountTypes.includes(value) ? null : 'Tipe akun tidak valid'),
      description: (value) => (value.trim().length > 0 ? null : 'Deskripsi harus diisi'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (path === 'edit' && id) {
      console.log('ini values', values);
      const result = await editAccount({ ...values, id }).unwrap();
      if (result.status === 'success') {
        router.push('/dashboard/accounts');
        form.reset();
      }
    } else {
      const result = await createAccount(values).unwrap();
      if (result.status === 'success') {
        router.push('/dashboard/accounts');
        form.reset();
      }
    }
  };

  const [fetchAccount, { isFetching, isLoading }] = useLazyGetAccountQuery();

  useEffect(() => {
    if (id) {
      fetchAccount({ id }).then((result) => {
        if (result.data?.data) {
          form.setValues({
            description: result.data.data.description,
            name: result.data.data.name,
            type: result.data.data.account.type,
          });
        }
      });
    }
  }, [id, fetchAccount]);

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} style={{ maxWidth: 400 }}>
      <Stack gap={rem(16)}>
        <Title order={3}>{id ? 'Edit Account' : 'Create Account'}</Title>

        <TextInput
          label="Nama Akun"
          placeholder="Masukkan nama akun"
          {...form.getInputProps('name')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        <Select
          label="Tipe Akun"
          placeholder="Pilih tipe akun"
          data={accountTypes}
          {...form.getInputProps('type')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        <TextAreaWithCounter
          label="Deskripsi"
          placeholder="Masukkan deskripsi akun"
          {...form.getInputProps('description')}
          onChange={(event) => form.setFieldValue('description', event.currentTarget.value)}
          minRows={4}
          maxRows={10}
          styles={{
            input: {
              paddingBottom: '30px',
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

export default AccountForm;
