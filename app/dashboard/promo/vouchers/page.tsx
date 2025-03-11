'use client';

import { useRouter } from 'next/navigation';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group, Table, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  useDeleteVoucherMutation,
  useGetVouchersQuery,
} from '@/lib/features/api/features/voucher-endpoints';

function Vouchers() {
  const { data } = useGetVouchersQuery();
  const [deleteVoucher] = useDeleteVoucherMutation();
  const router = useRouter();

  const handleEditClick = (id: number) => {
    router.push(`/dashboard/promo/vouchers/edit/${id}`);
  };

  const openDeleteModal = (id: number) =>
    modals.openConfirmModal({
      title: 'Delete Voucher',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this voucher?</Text>,
      labels: { confirm: 'Delete voucher', cancel: "No, don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteVoucher({ id });
      },
    });

  const rows = data?.data.map((voucher) => (
    <Table.Tr key={voucher.id}>
      <Table.Td>{voucher.id}</Table.Td>
      <Table.Td>{voucher.eventName}</Table.Td>
      <Table.Td>{voucher.code}</Table.Td>
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
    </Table.Tr>
  ));

  return (
    <>
      <Table stickyHeader stickyHeaderOffset={60}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Event Name</Table.Th>
            <Table.Th>Code</Table.Th>
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

export default Vouchers;
