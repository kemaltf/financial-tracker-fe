'use client';

import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { openProductSelectorModal } from '@/components/Modals/ProductSelector';
import { useGetStoresQuery } from '@/lib/features/api/features/store-endpoints';
import {
  useCreateVoucherMutation,
  useEditVoucherMutation,
  useLazyGetVoucherQuery,
} from '@/lib/features/api/features/voucher-endpoints';
import { stringToDate } from '@/utils/helpers';
import { useVoucherForm, VoucherSchemaFormValues } from './form';

export default function VoucherForm() {
  const params = useParams();
  const path = usePathname().split('/')[4];
  const id = params?.id as string | undefined;

  const form = useVoucherForm();
  const router = useRouter();

  const [createVoucher] = useCreateVoucherMutation();
  const { data: storesData, isLoading: isLoadingStore } = useGetStoresQuery();
  const dataStore = storesData?.data || [];

  const [editVoucher] = useEditVoucherMutation();
  const [fetchVoucher, { isFetching, isLoading }] = useLazyGetVoucherQuery();

  const handleSubmit = async ({ products, ...values }: VoucherSchemaFormValues) => {
    if (path === 'edit' && id) {
      const result = await editVoucher({
        ...values,
        storeId: Number(values.storeId),
        endDate: stringToDate(values.endDate.toString()) as Date,
        startDate: stringToDate(values.startDate.toString()) as Date,
        productIds: products?.map((product) => Number(product.id)) || [],
        id,
      }).unwrap();
      if (result.status === 'success') {
        router.push('/dashboard/promo/vouchers');
        form.reset();
      }
    } else {
      const result = await createVoucher({
        ...values,
        storeId: Number(values.storeId),
        endDate: stringToDate(values.endDate.toString()) as Date,
        startDate: stringToDate(values.startDate.toString()) as Date,
        productIds: products?.map((product) => Number(product.id)) || [],
      }).unwrap();
      if (result.status === 'success') {
        router.push('/dashboard/promo/vouchers');
        form.reset();
      }
    }
  };

  const openProductModal = () => {
    openProductSelectorModal({
      value: form.values.products || [],
      storeId: Number(form.values.storeId),
      onChange: (products) => {
        form.setFieldValue('products', products);
      },
      size: 'lg',
    });
  };

  useEffect(() => {
    if (id) {
      fetchVoucher({ id: Number(id) }).then((result) => {
        if (result.data?.data) {
          const { data } = result.data;
          form.setValues({
            applyTo: data.applyTo,
            code: data.code,
            discountType: data.discountType,
            discountValue: Number(data.discountValue),
            endDate: stringToDate(data.endDate),
            eventName: data.eventName,
            maxDiscount: Number(data.maxDiscount),
            products: data.products.map((product) => ({
              id: product.id,
              image: product.productImage,
              label: product.name,
              price: product.price,
              sku: product.sku,
              stock: product.stock,
            })),
            startDate: stringToDate(data.startDate),
            storeId: String(data.store.id),
          });
        }
      });
    }
  }, [id, fetchVoucher]);
  return (
    <Container size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid gutter="md">
          <Grid.Col span={12} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <Select
              label="Store"
              placeholder="Select store"
              data={dataStore}
              {...form.getInputProps('storeId')}
              disabled={isLoadingStore}
              searchable
              allowDeselect
              w="100%"
              required
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Event Name"
              placeholder="Masukkan nama event"
              required
              {...form.getInputProps('eventName')}
              disabled={isFetching || isLoading}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Promo Code"
              placeholder="Masukkan kode promo"
              required
              {...form.getInputProps('code')}
              disabled={isFetching || isLoading}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Discount Type"
              placeholder="Pilih tipe diskon"
              required
              data={['PERCENTAGE', 'FIXED']}
              {...form.getInputProps('discountType')}
              disabled={isFetching || isLoading}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Apply To"
              placeholder="Pilih kategori diskon"
              required
              data={['TOTAL', 'PRODUCT']}
              {...form.getInputProps('applyTo')}
              disabled={isFetching || isLoading}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Discount Value"
              required
              placeholder="Masukkan nilai diskon"
              {...form.getInputProps('discountValue')}
              disabled={isFetching || isLoading}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Max Discount"
              required
              placeholder="Masukkan maksimal diskon"
              {...form.getInputProps('maxDiscount')}
              disabled={isFetching || isLoading}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <DatePickerInput
              label="Start Date"
              required
              placeholder="Pilih tanggal mulai"
              {...form.getInputProps('startDate')}
              disabled={isFetching || isLoading}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DatePickerInput
              label="End Date"
              required
              placeholder="Pilih tanggal berakhir"
              {...form.getInputProps('endDate')}
              disabled={isFetching || isLoading}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Button
              onClick={openProductModal}
              disabled={
                form.values.applyTo !== 'PRODUCT' ||
                form.values.storeId === '' ||
                !form.values.storeId
              }
            >
              Tambah Produk
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12 }}>
            {form.values.products &&
              form.values.products?.length > 0 &&
              form.values.products.map((product, index) => (
                <Group key={index}>
                  <div
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <Image
                      src={product?.image || '/placeholder-image.jpg'}
                      alt={product?.label}
                      width={50}
                      height={50}
                    />
                    <Stack gap={0} style={{ marginLeft: '10px' }}>
                      <Text>{product?.label}</Text>
                      <Text size="sm" c="dimmed">
                        SKU: {product?.sku}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Stok: {product?.stock}
                      </Text>
                      <Text size="sm" c="green">
                        Harga: ${product?.price}
                      </Text>
                    </Stack>
                  </div>
                </Group>
              ))}
          </Grid.Col>

          <Grid.Col span={12}>
            <Flex w="100%" justify="end">
              <Button type="submit">Submit</Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </form>
    </Container>
  );
}
