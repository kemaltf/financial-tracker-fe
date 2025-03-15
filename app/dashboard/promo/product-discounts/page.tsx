/* eslint-disable react/self-closing-comp */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconChevronUp, IconPencil, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group, Image, rem, Stack, Table, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  useDeleteProductDiscountMutation,
  useGetProductDiscountsQuery,
} from '@/lib/features/api/features/product-discount-endpoints';
import { formatExchage } from '@/utils/helpers';

function ProductDiscounts() {
  const { data } = useGetProductDiscountsQuery();
  const [deleteProductDiscount] = useDeleteProductDiscountMutation();
  const router = useRouter();

  // State untuk menyimpan ID voucher yang diperluas
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const handleEditClick = (id: number) => {
    router.push(`/dashboard/promo/product-discount/edit/${id}`);
  };

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const openDeleteModal = (id: number) =>
    modals.openConfirmModal({
      title: 'Delete Voucher',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this voucher?</Text>,
      labels: { confirm: 'Delete voucher', cancel: "No, don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteProductDiscount({ id });
      },
    });

  const rows = data?.data.map((voucher) => {
    const isExpanded = expandedRows.includes(voucher.id);
    return [
      <Table.Tr key={voucher.id}>
        <Table.Td>
          {(voucher?.products?.length || 0) > 0 && (
            <ActionIcon onClick={() => toggleExpand(voucher.id)} variant="subtle">
              {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            </ActionIcon>
          )}
        </Table.Td>
        <Table.Td>{voucher.id}</Table.Td>
        <Table.Td>{voucher.eventName}</Table.Td>
        <Table.Td>{voucher.discountType}</Table.Td>
        <Table.Td>{voucher.discountValue}%</Table.Td>
        <Table.Td>{voucher.maxDiscount}</Table.Td>
        <Table.Td>{new Date(voucher.startDate).toLocaleDateString()}</Table.Td>
        <Table.Td>{new Date(voucher.endDate).toLocaleDateString()}</Table.Td>
        <Table.Td>{voucher.isActive ? 'Active' : 'Inactive'}</Table.Td>
        <Table.Td>{voucher.store?.name}</Table.Td>
        <Table.Td>
          <Group gap="xs">
            <ActionIcon variant="light" color="blue" onClick={() => handleEditClick(voucher.id)}>
              <IconPencil size={18} />
            </ActionIcon>
            <ActionIcon variant="light" color="red" onClick={() => openDeleteModal(voucher.id)}>
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>,
      isExpanded && (
        <Table.Tr key={`expanded${voucher.id}`}>
          <Table.Td colSpan={11} style={{ backgroundColor: '#f9f9f9' }}>
            <Table>
              <Table.Tbody>
                {voucher?.products?.map((product) => (
                  <Table.Tr key={product.id}>
                    <Table.Td w="50px">
                      <Stack p={0} m={0} gap="sm" w="50px" style={{ aspectRatio: '1 / 1' }}>
                        <Image
                          src={product?.image || '/placeholder-image.jpg'}
                          alt={product.name}
                          width={50}
                          height={50}
                          style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={rem(10)} c="var(--mantine-color-gray-7)">
                        <Text fz="xs">Name: {product.name}</Text>
                        <Text fz="xs">SKU: {product.sku}</Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      {' '}
                      <Stack
                        gap={rem(10)}
                        c="var(--mantine-color-gray-7)"
                        display="flex"
                        align="end"
                      >
                        <Text fz="xs">Stock: {product.stock}</Text>
                        <Text fz="xs">Price: {formatExchage(product.price, 'id-ID')}</Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.Td>
        </Table.Tr>
      ),
    ];
  });

  return (
    <>
      <Table stickyHeader stickyHeaderOffset={60}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>ID</Table.Th>
            <Table.Th>Event Name</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Discount</Table.Th>
            <Table.Th>Max Discount</Table.Th>
            <Table.Th>Start Date</Table.Th>
            <Table.Th>End Date</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Store</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
        <Table.Caption>Scroll page to see sticky thead</Table.Caption>
      </Table>
    </>
  );
}

export default ProductDiscounts;
