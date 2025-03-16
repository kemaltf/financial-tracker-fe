'use client';

import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Image,
  NumberInput,
  rem,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { openProductSelectorModal } from '@/components/Modals/ProductSelector';
import {
  useCreateProductDiscountMutation,
  useEditProductDiscountMutation,
  useLazyGetProductDiscountQuery,
} from '@/lib/features/api/features/product-discount-endpoints';
import { useGetStoresQuery } from '@/lib/features/api/features/store-endpoints';
import { stringToDate } from '@/utils/helpers';
import { ProductDiscountSchemaFormValues, useProductDiscountForm } from './form';

export default function ProductDiscountForm() {
  const params = useParams();
  const path = usePathname().split('/')[4];
  const id = params?.id as string | undefined;

  const form = useProductDiscountForm();
  const router = useRouter();

  const [createProductDiscount] = useCreateProductDiscountMutation();
  const { data: storesData, isLoading: isLoadingStore } = useGetStoresQuery();
  const dataStore = storesData?.data || [];

  const [editProductDiscount] = useEditProductDiscountMutation();
  const [fetchProductDiscount, { isFetching, isLoading }] = useLazyGetProductDiscountQuery();

  const handleSubmit = async ({ products, ...values }: ProductDiscountSchemaFormValues) => {
    if (path === 'edit' && id) {
      const result = await editProductDiscount({
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
      const result = await createProductDiscount({
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

  console.log(form.errors);

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
      fetchProductDiscount({ id: Number(id) }).then((result) => {
        if (result.data?.data) {
          const { data } = result.data;
          form.setValues({
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
  }, [id, fetchProductDiscount]);

  const handleRemoveProduct = (index: number) => {
    form.setFieldValue(
      'products',
      form.values.products?.filter((_, i) => i !== index)
    );
  };

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
            <DateTimePicker
              label="Start Date"
              required
              placeholder="Pilih tanggal mulai"
              {...form.getInputProps('startDate')}
              disabled={isFetching || isLoading}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateTimePicker
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
              disabled={form.values.storeId === '' || !form.values.storeId}
            >
              Tambah Produk
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12 }}>
            {form.values.products &&
              form.values.products.length > 0 &&
              form.values.products.map((product, index) => (
                <Card
                  key={index}
                  pos="relative"
                  mb={rem(5)}
                  p={rem(10)}
                  shadow="sm"
                  withBorder
                  radius="md"
                >
                  <Flex w="100%" display="flex" align="center" gap={rem(10)}>
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
                  </Flex>
                  <ActionIcon
                    color="red.5"
                    onClick={() => handleRemoveProduct(index)}
                    pos="absolute"
                    top={rem(5)}
                    right={rem(5)}
                    size="xs"
                    variant="subtle"
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Card>
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
