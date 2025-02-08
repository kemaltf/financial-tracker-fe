'use client';

import { useRouter } from 'next/navigation';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Container, Group, Stack, Table, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useDeleteAccountMutation, useGetAccountsQuery } from '@/lib/features/api';
import { formatExchage } from '@/utils/helpers';

function FinancialAccounts() {
  const router = useRouter();
  const { data } = useGetAccountsQuery();
  const [deleteAccount] = useDeleteAccountMutation();

  const handleEditClick = (id: number) => {
    router.push(`/dashboard/accounts/edit/${id}`);
  };

  const openDeleteModal = (id: number) =>
    modals.openConfirmModal({
      title: 'Delete Account',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this account?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteAccount({ id: id.toString() });
      },
    });

  const rows = data?.data.map((item, index) => (
    <Table.Tr key={item.id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{item.code}</Table.Td>
      <Table.Td>{item.name}</Table.Td>
      <Table.Td>{item.account.type}</Table.Td>
      <Table.Td>{item.description}</Table.Td>
      <Table.Td>{formatExchage(item.balance, 'id-ID')}</Table.Td>
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
        <Title order={4}>Financial Accounts</Title>
        <Table stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No</Table.Th>
              <Table.Th>Code</Table.Th>
              <Table.Th>Account</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Balance</Table.Th>
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

export default FinancialAccounts;
