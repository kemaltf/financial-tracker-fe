import React, { useEffect, useState } from 'react';
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
import SelectProduct from '@/components/SelectProduct';
import { useGetProductsQuery } from '@/lib/features/api';
import { Product } from '@/lib/features/api/types/product';
import { TransactionFormValues } from '../form';

type Props = {
  form: UseFormReturnType<TransactionFormValues>;
};

export const ProductSection = ({ form }: Props) => {
  const [page, setPage] = useState(1);
  const [productData, setProductData] = useState<Product[]>([]);
  const { data, isLoading } = useGetProductsQuery({
    page,
    limit: 100,
    sortBy: 'price',
    sortDirection: 'DESC',
    storeId: 1,
    filters: {},
  });

  useEffect(() => {
    if (data) {
      setProductData((prevData) => [...prevData, ...data.data.data]);
    }
  }, [data]);

  const fetchNextPage = () => {
    if (data?.data.totalPages === page) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  };

  const removeProduct = (index: number) => {
    form.removeListItem('products', index);
  };
  const addProduct = () => {
    form.insertListItem('products', { productId: '', quantity: 1 });
  };
  const handleProductChange = (value: string): Product | undefined => {
    const product = productData.find((item) => item.value === value) as Product;
    return product;
  };

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
                  data={productData}
                  loading={isLoading}
                  {...form.getInputProps(`products.${index}.productId`)}
                  onBottomReached={fetchNextPage}
                  mah={300} // Custom max height
                  textInputProps={{
                    label: `Product ${index + 1}`,
                    placeholder: 'Select product',
                    disabled: isLoading,
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
