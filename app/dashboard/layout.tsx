'use client';

import { AppShell, Burger, Button, Group, ScrollArea, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { useDeviceType } from '@/hooks/use-device-size';
import AddTransactionForm from '@/modules/CreateTransactionForm';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const { isMobile } = useDeviceType();
  const modals = useModals();

  const openAddTransactionModal = () => {
    modals.openModal({
      title: 'Add New Transaction',
      size: isMobile ? '100%' : '70%',
      radius: 'md',
      scrollAreaComponent: ScrollArea.Autosize,
      children: <AddTransactionForm onClose={() => modals.closeAll()} />,
    });
  };
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
          <Button onClick={openAddTransactionModal}>+ Add Transaction</Button>
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
    </AppShell>
  );
};

export default DashboardLayout;
