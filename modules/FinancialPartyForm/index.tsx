'use client';

import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Box, Button, rem, Select, Stack, TextInput, Title } from '@mantine/core';
import {
  useCreateFinancialPartyMutation,
  useEditFinancialPartyMutation,
  useLazyGetFinancialPartyQuery,
} from '@/lib/features/api';
import { CreateFinancialPartyType, useFinancialPartyForm } from './form';

const ROLE_OPTIONS = [
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'DEBTOR', label: 'Debtor' },
  { value: 'CREDITOR', label: 'Creditor' },
];

const FinancialPartyForm = () => {
  const params = useParams(); // Ambil ID dari URL
  const path = usePathname().split('/')[3];

  const id = params?.id as string | undefined;
  const form = useFinancialPartyForm();
  const router = useRouter();
  const [createFinancialParty] = useCreateFinancialPartyMutation();
  const [editFinancialParty] = useEditFinancialPartyMutation();

  const [fetchFinancialParty, { isFetching, isLoading }] = useLazyGetFinancialPartyQuery();

  const handleSubmit = async (values: CreateFinancialPartyType) => {
    if (path === 'edit' && id) {
      const result = await editFinancialParty({ ...values, id }).unwrap();
      if (result.status === 'success') {
        router.push(`/dashboard/financial-party/${values.role.toLowerCase()}`);
        form.reset();
      }
    } else {
      const result = await createFinancialParty(values).unwrap();
      if (result.status === 'success') {
        router.push(`/dashboard/financial-party/${values.role.toLowerCase()}`);
        form.reset();
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchFinancialParty({ id }).then((result) => {
        if (result.data?.data) {
          form.setValues({
            addressLine1: result.data.data.addressLine1,
            addressLine2: result.data.data?.addressLine2,
            city: result.data.data.city,
            email: result.data.data.email,
            name: result.data.data.name,
            phone: result.data.data.phone,
            postalCode: result.data.data.postalCode,
            role: result.data.data.role,
            state: result.data.data.state,
          });
        }
      });
    }
  }, [id, fetchFinancialParty]);

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} style={{ maxWidth: 400 }}>
      <Stack gap={rem(16)}>
        <Title order={3}>{id ? 'Edit' : 'Create'} Financial Party</Title>

        <TextInput
          label="Nama"
          placeholder="Masukkan nama"
          {...form.getInputProps('name')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        <TextInput
          label="Email"
          placeholder="Masukkan email"
          {...form.getInputProps('email')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        <TextInput
          label="Telepon"
          placeholder="Masukkan nomor telepon"
          {...form.getInputProps('phone')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        <TextInput
          label="Alamat 1"
          placeholder="Masukkan alamat"
          {...form.getInputProps('addressLine1')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        <TextInput
          label="Alamat 2"
          placeholder="Opsional"
          {...form.getInputProps('addressLine2')}
          disabled={isFetching || isLoading}
        />

        <TextInput
          label="Kota"
          placeholder="Masukkan kota"
          {...form.getInputProps('city')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        <TextInput
          label="Provinsi"
          placeholder="Masukkan provinsi"
          {...form.getInputProps('state')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        <TextInput
          label="Kode Pos"
          placeholder="Masukkan kode pos"
          {...form.getInputProps('postalCode')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        <Select
          label="Role"
          placeholder="Pilih role"
          data={ROLE_OPTIONS}
          {...form.getInputProps('role')}
          withAsterisk
          disabled={isFetching || isLoading}
        />

        <Button type="submit" disabled={isFetching || isLoading}>
          Simpan
        </Button>
      </Stack>
    </Box>
  );
};

export default FinancialPartyForm;
