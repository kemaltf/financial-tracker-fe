'use client';

import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Box, Button, Grid, rem, Select, Stack, TextInput, Title } from '@mantine/core';
import TextAreaWithCounter from '@/components/TextAreaCount';
import {
  useLazyGetCitiesQuery,
  useLazyGetProvicesQuery,
  useLazyGetSubdistrictQuery,
} from '@/lib/features/api/features/shipment-endpoints';
import {
  useCreateStoreMutation,
  useEditStoreMutation,
  useLazyGetStoreQuery,
} from '@/lib/features/api/features/store-endpoints';
import { StoreFormValues, useStoreForm } from '@/modules/StoreForm/form';

const StoreForm = () => {
  const params = useParams(); // Ambil ID dari URL
  const path = usePathname().split('/')[3];

  const id = params?.id as string | undefined;
  const form = useStoreForm();
  const router = useRouter();
  const [createStore] = useCreateStoreMutation();
  const [editStore] = useEditStoreMutation();
  const [fetchProvinces, { data: dataProvice, isFetching: isFetchingProvinces }] =
    useLazyGetProvicesQuery();
  const [fetchCities, { data: dataCities, isFetching: isFetchingCities }] = useLazyGetCitiesQuery();
  const [fetchSubdistrict, { data: dataSubdistrict, isFetching: isFetchingSubdistrict }] =
    useLazyGetSubdistrictQuery();

  const provinceData = dataProvice?.data;
  const cityData = dataCities?.data;
  const subdistrictData = dataSubdistrict?.data;

  const { address } = form.values;

  const handleSubmit = async (values: StoreFormValues) => {
    if (path === 'edit' && id) {
      const result = await editStore({
        description: values.description,
        name: values.name,
        addressLine1: values.address.addressLine1?.trim() || '',
        addressLine2: values.address.addressLine2?.trim() || '',
        city: cityData?.find((value) => value.value === values.address.city)?.label || '',
        state: provinceData?.find((value) => value.value === values.address.state)?.label || '',
        postalCode: values.address.postalCode?.trim() || '',
        phoneNumber: values.address.phoneNumber?.trim() || '',
        subdistrict:
          subdistrictData?.find((value) => value.value === values.address.subdistrict)?.label || '',
        id,
      }).unwrap();
      if (result.status === 'success') {
        router.push('/dashboard/stores');
        form.reset();
      }
    } else {
      const result = await createStore({
        description: values.description,
        name: values.name,
        addressLine1: values.address.addressLine1?.trim() || '',
        addressLine2: values.address.addressLine2?.trim() || '',
        city: cityData?.find((value) => value.value === values.address.city)?.label || '',
        state: provinceData?.find((value) => value.value === values.address.state)?.label || '',
        postalCode: values.address.postalCode?.trim() || '',
        phoneNumber: values.address.phoneNumber?.trim() || '',
        subdistrict:
          subdistrictData?.find((value) => value.value === values.address.subdistrict)?.label || '',
      }).unwrap();
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
            address: {
              addressLine1: result.data.data.addressLine1,
              addressLine2: result.data.data.addressLine2 || '',
              city: result.data.data.city, // Ubah ini
              phoneNumber: result.data.data.phoneNumber,
              postalCode: result.data.data.postalCode,
              state: provinceData?.find((p) => p.label === result.data?.data.state)?.value || '', // Sesuaikan dengan format Select
              subdistrict: result.data.data.subdistrict, // Ubah ini
            },
          });
        }
      });
    }
  }, [id, fetchStore, provinceData]); // Tambahkan provinceData agar memicu pembaruan saat data tersedia

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  useEffect(() => {
    if (address?.state) {
      fetchCities({ provinceId: address.state }).then((result) => {
        const matchedCity = result.data?.data.find((c) => c.label === address.city);
        form.setFieldValue('address.city', matchedCity?.value || '');
      });
    }
  }, [address?.state, fetchCities]);

  useEffect(() => {
    if (address?.city) {
      fetchSubdistrict({ cityId: address.city }).then((result) => {
        const matchedSubdistrict = result.data?.data.find((s) => s.label === address.subdistrict);
        form.setFieldValue('address.subdistrict', matchedSubdistrict?.value || '');
      });
    }
  }, [address?.city, fetchSubdistrict]);

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

        <Grid>
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
            <Select
              searchable
              data={provinceData}
              label="State/Province"
              placeholder="State"
              autoComplete="off"
              {...form.getInputProps('address.state')}
              onChange={(value) => {
                form.setFieldValue('address.city', '');
                form.setFieldValue('address.subdistrict', '');
                form.getInputProps('address.state').onChange(value);
              }}
              disabled={isFetchingProvinces}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              searchable
              data={cityData}
              label="City"
              placeholder="City"
              disabled={isFetchingCities || !address?.state || address.state === ''}
              {...form.getInputProps('address.city')}
              onChange={(value) => {
                form.setFieldValue('address.subdistrict', '');
                form.getInputProps('address.city').onChange(value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              searchable
              data={subdistrictData}
              label="Subdistrict"
              placeholder="Subdistrict"
              disabled={
                isFetchingSubdistrict || !address?.state || !address?.city || address.state === ''
              }
              {...form.getInputProps('address.subdistrict')}
            />
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

        <Button type="submit" disabled={isFetching || isLoading}>
          Simpan
        </Button>
      </Stack>
    </Box>
  );
};

export default StoreForm;
