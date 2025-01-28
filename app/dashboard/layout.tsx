'use client';

import React, { useState } from 'react';
import { AppShell, Burger, Button, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AddTransactionForm from '@/components/AddTransactionForm';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" align="center">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="lg" fw={500}>
              Financial Tracker
            </Text>
          </Group>
          <Button onClick={() => setModalOpened(true)}>+ Add Transaction</Button>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Text>Dashboard</Text>
        <Text>Transaction History</Text>
        <Text>Financial Summary</Text>
        <Text>Account Balances</Text>
        <Text>Budget Overview</Text>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Add New Transaction">
        <AddTransactionForm onClose={() => setModalOpened(false)} />
      </Modal>
    </AppShell>
  );
};

export default DashboardLayout;
