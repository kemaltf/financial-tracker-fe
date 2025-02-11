'use client';

import { useRouter } from 'next/navigation';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Container, Group, Stack, Table, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useDeleteFinancialPartyMutation, useGetFinancialPartiesQuery } from '@/lib/features/api';

function Customer() {
  const { data } = useGetFinancialPartiesQuery({ role: 'CUSTOMER' });
  const [deleteImage] = useDeleteFinancialPartyMutation();
  const router = useRouter();

  const handleEditClick = (id: number) => {
    router.push(`/dashboard/financial-party/edit/${id}`);
  };

  const openDeleteModal = (id: number) => {
    modals.openConfirmModal({
      title: 'Confirm Delete',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this image?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteImage({ id: id.toString() }).unwrap(); // Tunggu sampai selesai
          modals.closeAll(); // Tutup semua modal setelah sukses
        } catch (error) {
          notifications.show({
            title: 'Delete Failed',
            message: 'Failed to delete image:',
          });
        }
      },
    });
  };

  const rows = data?.data.map((item, index) => (
    <Table.Tr key={item.id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{item.name}</Table.Td>
      <Table.Td>{item.email}</Table.Td>
      <Table.Td>{item.phone}</Table.Td>
      <Table.Td>{`${item.addressLine1}, ${item.addressLine1}`}</Table.Td>
      <Table.Td>{item.city}</Table.Td>
      <Table.Td>{item.state}</Table.Td>
      <Table.Td>{item.postalCode}</Table.Td>
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
    </Table.Tr>
  ));

  return (
    <Container>
      <Stack>
        <Title order={4}>Customer Manager</Title>
        <Table stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Address</Table.Th>
              <Table.Th>City</Table.Th>
              <Table.Th>State</Table.Th>
              <Table.Th>Postal Code</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
          <Table.Caption>Scroll page to see sticky thead</Table.Caption>
        </Table>
      </Stack>
    </Container>
  );
}

export default Customer;
