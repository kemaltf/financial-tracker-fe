import React from 'react';
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
import { Product } from '@/lib/features/api';
import { TransactionFormValues } from '../form';

type Props = {
  form: UseFormReturnType<TransactionFormValues>;
  isLoadingProducts: boolean;
  productData: Product[];
};

export const ProductSection = ({ form, isLoadingProducts, productData }: Props) => {
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
                  loading={isLoadingProducts}
                  {...form.getInputProps(`products.${index}.productId`)}
                  onBottomReached={() => console.log('Load more data...💙')}
                  mah={300} // Custom max height
                  textInputProps={{
                    label: `Product ${index + 1}`,
                    placeholder: 'Select product',
                    disabled: isLoadingProducts,
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
                    // height="100%"
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
