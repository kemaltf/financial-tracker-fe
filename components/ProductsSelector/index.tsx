import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Stack, Table } from '@mantine/core';
import { useLazyGetProductsOptionQuery } from '@/lib/features/api/features/product-endpoints';

export type ProductSelector = {
  id: number;
  image: string;
  label: string;
  price: number;
  sku: string;
  stock: number;
};

type Props = {
  value?: ProductSelector[];
  onChange?: (selectedProducts: ProductSelector[]) => void;
  onClose: () => void;
  storeId: number;
};

export function ProductsSelector({ value = [], onChange, onClose, storeId }: Props) {
  const [trigger, { data, isFetching }] = useLazyGetProductsOptionQuery();

  const dataProducts = data?.data?.data || [];

  // State menyimpan array ProductSelector, bukan hanya id
  const [selected, setSelected] = useState<ProductSelector[]>(value || []);

  const toggleSelection = (product: ProductSelector) => {
    setSelected((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      return isSelected ? prev.filter((p) => p.id !== product.id) : [...prev, product];
    });
  };

  // ✅ Confirm button mengupdate ke parent
  const handleConfirm = () => {
    onChange?.(selected);
    onClose();
  };

  useEffect(() => {
    trigger({
      page: 1,
      limit: 5,
      sortBy: 'price',
      sortDirection: 'DESC',
      storeId: Number(storeId), // Gunakan storeId dari form
      filters: {},
      paginationMode: 'infiniteScroll',
    });
  }, [storeId]);

  return (
    <Stack>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{}</Table.Th>
            <Table.Th>Produk</Table.Th>
            <Table.Th>SKU</Table.Th>
            <Table.Th>Stok</Table.Th>
            <Table.Th>Harga</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {dataProducts.map((product) => {
            const isChecked = selected.some((p) => p.id === product.id);
            return (
              <Table.Tr key={product.id}>
                <Table.Td>
                  <Checkbox
                    checked={isChecked}
                    onChange={() =>
                      toggleSelection({
                        id: product.id,
                        image: product.image || '',
                        label: product.label,
                        price: product.price,
                        sku: product.sku,
                        stock: product.stock,
                      })
                    }
                  />
                </Table.Td>
                <Table.Td>{product.label}</Table.Td>
                <Table.Td>{product.sku}</Table.Td>
                <Table.Td>{product.stock}</Table.Td>
                <Table.Td>Rp {product.price.toLocaleString()}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      <Flex w="100%" justify="end">
        <Button onClick={handleConfirm} disabled={isFetching}>
          {isFetching ? 'Memuat...' : 'Tambahkan'}
        </Button>
      </Flex>
    </Stack>
  );
}
