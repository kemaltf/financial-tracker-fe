/* eslint-disable react/self-closing-comp */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconChevronUp, IconPencil, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Container,
  Group,
  Image,
  rem,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { usePagination } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import {
  useDeleteProductMutation,
  useGetProductsOptionQuery,
} from '@/lib/features/api/features/product-endpoints';
import { formatExchage } from '@/utils/helpers';

function Products() {
  const router = useRouter();

  // State untuk pagination
  const pagination = usePagination({ total: 10, initialPage: 1 });

  const limit = 1;
  // Ambil data produk dengan pagination
  const { data, refetch } = useGetProductsOptionQuery({
    page: pagination.active,
    limit,
    sortBy: 'price',
    sortDirection: 'DESC',
    storeId: 1, // TODO: Ambil dari storeId yang dinamis
    filters: {},
    paginationMode: 'pagination',
  });

  const [deleteProduct] = useDeleteProductMutation();
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const handleEditClick = (id: number) => {
    router.push(`/dashboard/products/edit/${id}`);
  };

  const openDeleteModal = (id: number) =>
    modals.openConfirmModal({
      title: 'Delete Account',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this account?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteProduct({ id: id.toString() });
      },
    });

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const rows = data?.data.data.flatMap((item, index) => {
    const isExpanded = expandedRows.includes(item.id);
    return [
      <Table.Tr key={item.id}>
        <Table.Td>
          {(item?.variant?.length || 0) > 0 && (
            <ActionIcon onClick={() => toggleExpand(item.id)} variant="subtle">
              {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            </ActionIcon>
          )}
        </Table.Td>
        <Table.Td>{(pagination.active - 1) * limit + index + 1}</Table.Td>
        <Table.Td style={{ width: rem(50) }}>
          <Stack p={0} m={0} gap="sm" h="100%" w="100%" style={{ aspectRatio: '1 / 1' }}>
            <Image
              src={item.image || '/placeholder-image.jpg'}
              alt={item.label}
              width={50}
              height={50}
              style={{ objectFit: 'cover', borderRadius: '4px' }}
            />
          </Stack>
        </Table.Td>
        <Table.Td>{item.label}</Table.Td>
        <Table.Td>{item.sku}</Table.Td>
        <Table.Td>{item.stock}</Table.Td>
        <Table.Td>{formatExchage(item.price, 'id-ID')}</Table.Td>
        <Table.Td>
          <Group gap="xs">
            <ActionIcon variant="light" color="blue" onClick={() => handleEditClick(item.id)}>
              <IconPencil size={18} />
            </ActionIcon>
            <ActionIcon variant="light" color="red" onClick={() => openDeleteModal(item.id)}>
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>,
      isExpanded &&
        item?.variant?.map((variant) => (
          <Table.Tr key={variant.value} style={{ backgroundColor: '#f9f9f9' }}>
            <Table.Td></Table.Td>
            <Table.Td></Table.Td>
            <Table.Td>
              <Stack p={0} m={0} gap="sm" h="100%" w="100%" style={{ aspectRatio: '1 / 1' }}>
                <Image
                  src={variant.image || '/placeholder-image.jpg'}
                  alt={variant.label}
                  width={50}
                  height={50}
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                />
              </Stack>
            </Table.Td>
            <Table.Td>{variant.label}</Table.Td>
            <Table.Td>{variant.sku}</Table.Td>
            <Table.Td>{variant.stock}</Table.Td>
            <Table.Td>{formatExchage(variant.price, 'id-ID')}</Table.Td>
            <Table.Td></Table.Td>
          </Table.Tr>
        )),
    ];
  });

  // Total halaman dari API
  const totalPages = data?.data.totalPages || 1;
  console.log('totalPages', totalPages);

  useEffect(() => {
    refetch();
  }, [pagination.active, refetch]);

  return (
    <Container>
      <Stack>
        <Title order={4}>Financial Accounts</Title>
        <Table stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th></Table.Th>
              <Table.Th>No</Table.Th>
              <Table.Th>Image</Table.Th>
              <Table.Th>Product</Table.Th>
              <Table.Th>SKU</Table.Th>
              <Table.Th>Stock</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
          <Table.Caption>Scroll page to see sticky thead</Table.Caption>
        </Table>

        {/* Pagination Controls */}
        <Group p="right">
          <Button variant="default" disabled={pagination.active <= 1} onClick={pagination.previous}>
            Previous
          </Button>
          <Text>
            Page {pagination.active} of {totalPages}
          </Text>
          <Button
            variant="default"
            disabled={pagination.active >= totalPages}
            onClick={pagination.next}
          >
            Next
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

export default Products;
