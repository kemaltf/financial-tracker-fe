'use client';

import { useRouter } from 'next/navigation';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group, Table, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useDeleteVariantTypeMutation, useGetVariantTypesQuery } from '@/lib/features/api';

function Categories() {
  const { data } = useGetVariantTypesQuery();
  const [deleteVariantType] = useDeleteVariantTypeMutation();

  const router = useRouter();

  const handleEditClick = (id: number) => {
    router.push(`/dashboard/products/variant-types/edit/${id}`);
  };

  const openDeleteModal = (id: number) =>
    modals.openConfirmModal({
      title: 'Delete Variant Type',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this variant type?</Text>,
      labels: { confirm: 'Delete variant type', cancel: "No, don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteVariantType({ id: String(id) });
      },
    });

  const rows = data?.data.map((category) => (
    <Table.Tr key={category.id}>
      <Table.Td>{category.id}</Table.Td>
      <Table.Td>{category.name}</Table.Td>
      <Table.Td>{category.store?.name}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="light" color="blue" onClick={() => handleEditClick(category.id)}>
            <IconPencil size={18} />
          </ActionIcon>
          <ActionIcon variant="light" color="red" onClick={() => openDeleteModal(category.id)}>
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
            <Table.Th>Name</Table.Th>
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

export default Categories;
