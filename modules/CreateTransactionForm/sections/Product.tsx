import React, { useEffect } from 'react';
import { IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Image,
  NumberInput,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import SelectProduct, { SelectProductType } from '@/components/SelectProduct';
import { useLazyGetProductsOptionQuery } from '@/lib/features/api';
import { Product } from '@/lib/features/api/types/product';
import { TransactionFormValues } from '../form';

type Props = {
  form: UseFormReturnType<TransactionFormValues>;
};

export const ProductSection = ({ form }: Props) => {
  const storeId = Number(form.values.storeId);

  const [trigger, { data, isFetching }] = useLazyGetProductsOptionQuery();
  const dataProducts = data?.data?.data || [];

  const flattenProducts = (products: Product[]): SelectProductType =>
    products.flatMap((product) => [
      {
        ...product,
        value: product.id.toString(),
        image: product.image || '',
        disabled: product.variant ? product.variant.length > 0 : false, // Disabled jika ada variant
      },
      ...(product.variant || []).map((variant) => ({
        ...variant,
        value: `${product.id}-${variant.id}`, // Format baru untuk value variant
        image: variant?.image || '',
        disabled: false,
      })),
    ]);

  const allOptions = flattenProducts(dataProducts);
  console.log(allOptions);

  const fetchNextPage = () => {
    if (dataProducts.length === 0) {
      return;
    }

    if (data?.data.totalPages && data.data.currentPage + 1 > data.data.totalPages && !isFetching) {
      return;
    }

    trigger({
      page: data!.data.currentPage + 1,
      limit: 5,
      sortBy: 'price',
      sortDirection: 'DESC',
      storeId, // Gunakan storeId dari form
      filters: {},
    });
  };

  const removeProduct = (index: number) => {
    form.removeListItem('products', index);
  };
  const addProduct = () => {
    form.insertListItem('products', { productId: '', quantity: 1 });
  };
  const handleProductChange = (value: string): Product | undefined => {
    const product = allOptions.find((item) => item.value === value) as Product;
    return product;
  };

  useEffect(() => {
    trigger({
      page: 1,
      limit: 5,
      sortBy: 'price',
      sortDirection: 'DESC',
      storeId, // Gunakan storeId dari form
      filters: {},
    });
  }, []);

  return (
    <Grid.Col span={12} p={0}>
      <Group p="apart" mb="xs" justify="space-between">
        <Title order={4}>Products</Title>
        <Button onClick={addProduct} variant="subtle" size="xs" p={0}>
          + Add Product
        </Button>
      </Group>
      {form.values.products?.map((product, index) => {
        const productDetails = handleProductChange(product.productId);
        const selectedProductIds = form.values.products?.map((p) => p.productId);

        return (
          <div key={`${product.productId}-${index}`}>
            <Grid align="flex-start">
              <Grid.Col span={{ base: 8, md: 9 }}>
                <SelectProduct
                  data={allOptions || []}
                  loading={isFetching}
                  {...form.getInputProps(`products.${index}.productId`)}
                  onBottomReached={fetchNextPage}
                  mah={300} // Custom max height
                  textInputProps={{
                    label: `Product ${index + 1}`,
                    placeholder: 'Select product',
                    disabled: isFetching,
                  }}
                  containerProps={{
                    disabled: false,
                    variant: 'filled',
                  }}
                  optionProps={{
                    disabled: false,
                    value: 'value',
                  }}
                  searchable
                  selectedProductIds={selectedProductIds} // Pass selected product IDs
                />
              </Grid.Col>
              <Grid.Col span={{ base: 2.5, md: 2 }}>
                <NumberInput
                  label="Qty"
                  {...form.getInputProps(`products.${index}.quantity`)}
                  required
                  min={1}
                  hideControls
                  w="100%"
                />
              </Grid.Col>
              <Grid.Col span={1} pt="35px">
                <ActionIcon color="red" onClick={() => removeProduct(index)} w={30} h={30}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Grid.Col>
            </Grid>
            {productDetails && (
              <Group>
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
                    src={productDetails?.image || '/placeholder-image.jpg'}
                    alt={productDetails?.label}
                    width={50}
                    height={50}
                  />
                  <Stack gap={0} style={{ marginLeft: '10px' }}>
                    <Text>{productDetails?.label}</Text>
                    <Text size="sm" c="dimmed">
                      SKU: {productDetails?.sku}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Stok: {productDetails?.stock}
                    </Text>
                    <Text size="sm" c="green">
                      Harga: ${productDetails?.price}
                    </Text>
                  </Stack>
                </div>
              </Group>
            )}
          </div>
        );
      })}
    </Grid.Col>
  );
};
