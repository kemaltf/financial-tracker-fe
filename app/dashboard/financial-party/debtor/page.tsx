'use client';

import { useRouter } from 'next/navigation';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Container, Group, Stack, Table, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useDeleteFinancialPartyMutation, useGetFinancialPartiesQuery } from '@/lib/features/api';

function Creditor() {
  const { data } = useGetFinancialPartiesQuery({ role: 'DEBTOR' });
  const [deleteDebtor] = useDeleteFinancialPartyMutation();
  const router = useRouter();

  const handleEditClick = (id: number) => {
    router.push(`/dashboard/financial-party/edit/${id}`);
  };

  const openDeleteModal = (id: number) =>
    modals.openConfirmModal({
      title: 'Delete debtor',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete your debtor?</Text>,
      labels: { confirm: 'Delete debtor', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteDebtor({ id: id.toString() });
      },
    });

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
        <Title order={4}>Debtor Manager</Title>
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

export default Creditor;
