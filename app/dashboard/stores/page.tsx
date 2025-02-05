'use client';

import { useRouter } from 'next/navigation';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group, Table, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useDeleteStoreMutation, useGetStoresQuery } from '@/lib/features/api';

function Stores() {
  const { data } = useGetStoresQuery();
  const [deleteStore] = useDeleteStoreMutation();

  const router = useRouter();

  const handleEditClick = (id: string) => {
    router.push(`/dashboard/stores/edit/${id}`);
  };

  const openDeleteModal = (id: string) =>
    modals.openConfirmModal({
      title: 'Delete your profile',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete your store?</Text>,
      labels: { confirm: 'Delete store', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteStore({ id });
      },
    });

  const rows = data?.data.map((item) => (
    <Table.Tr key={item.value}>
      <Table.Td>{item.value}</Table.Td>
      <Table.Td>{item.label}</Table.Td>
      <Table.Td>{item.description}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="light" color="blue" onClick={() => handleEditClick(item.value)}>
            <IconPencil size={18} />
          </ActionIcon>
          <ActionIcon variant="light" color="red" onClick={() => openDeleteModal(item.value)}>
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
            <Table.Th>Label</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
        <Table.Caption>Scroll page to see sticky thead</Table.Caption>
      </Table>
    </>
  );
}

export default Stores;
