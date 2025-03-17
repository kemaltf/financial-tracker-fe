import React, { useEffect } from 'react';
import { Grid, Group, Select, TextInput, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import {
  useGetCountriesQuery,
  useLazyGetCitiesQuery,
  useLazyGetProvicesQuery,
  useLazyGetSubdistrictQuery,
} from '@/lib/features/api/features/shipment-endpoints';
import { TransactionFormValues } from '../form';

type Props = {
  form: UseFormReturnType<TransactionFormValues>;
};

export const Address = ({ form }: Props) => {
  const { data } = useGetCountriesQuery();
  const [fetchProvinces, { data: dataProvice, isFetching: isFetchingProvinces }] =
    useLazyGetProvicesQuery();
  const [fetchCities, { data: dataCities, isFetching: isFetchingCities }] = useLazyGetCitiesQuery();
  const [fetchSubdistrict, { data: dataSubdistrict, isFetching: isFetchingSubdistrict }] =
    useLazyGetSubdistrictQuery();

  const countryData = data?.data;
  const provinceData = dataProvice?.data;
  const cityData = dataCities?.data;
  const subdistrictData = dataSubdistrict?.data;

  const { address } = form.values;

  useEffect(() => {
    if (address?.country === '0') {
      fetchProvinces();
    }
  }, [fetchProvinces, address?.country]);

  useEffect(() => {
    if (address?.country === '0') {
      if (address?.state && address?.state !== '') {
        fetchCities({ provinceId: address.state });
      }
    }
  }, [fetchCities, address?.state, address?.country]);

  useEffect(() => {
    if (address?.country === '0') {
      if (address?.city && address?.city !== '') {
        fetchSubdistrict({ cityId: address.city });
      }
    }
  }, [fetchSubdistrict, address?.city, address?.country]);

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
          <Select
            searchable
            data={countryData}
            label="Country"
            placeholder="Country"
            {...form.getInputProps('address.country')}
            onChange={(value) => {
              form.setValues((value) => ({
                address: {
                  ...value.address,
                  state: '',
                  city: '',
                  subdistrict: '',
                },
              }));
              form.getInputProps('address.country').onChange(value);
            }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          {address?.country === '0' ? (
            <Select
              searchable
              data={provinceData}
              label="State/Province"
              placeholder="State"
              autoComplete="off"
              {...form.getInputProps('address.state')}
              onChange={(value) => {
                form.setValues((value) => ({
                  address: {
                    ...value.address,
                    city: '',
                    subdistrict: '',
                  },
                }));
                form.getInputProps('address.state').onChange(value);
              }}
              disabled={isFetchingProvinces || !address?.country}
            />
          ) : (
            <TextInput
              label="State/Province"
              placeholder="State/Province"
              {...form.getInputProps('address.state')}
            />
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          {address?.country === '0' ? (
            <Select
              searchable
              data={cityData}
              label="City"
              placeholder="City"
              disabled={isFetchingCities || !address?.state || address.state === ''}
              {...form.getInputProps('address.city')}
              onChange={(value) => {
                form.setValues((value) => ({
                  address: {
                    ...value.address,
                    subdistrict: '',
                  },
                }));
                form.getInputProps('address.city').onChange(value);
              }}
            />
          ) : (
            <TextInput label="City" placeholder="City" {...form.getInputProps('address.city')} />
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          {address?.country === '0' ? (
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
          ) : (
            <TextInput
              label="Subdistrict"
              placeholder="Subdistrict"
              {...form.getInputProps('address.subdistrict')}
            />
          )}
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
