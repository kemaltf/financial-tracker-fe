'use client';

import { IconPlus } from '@tabler/icons-react';
import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Group,
  Menu,
  ScrollArea,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { useDeviceType } from '@/hooks/use-device-size';
import { useLogoutMutation } from '@/lib/features/api';
import AddTransactionForm from '@/modules/CreateTransactionForm';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const { isMobile } = useDeviceType();
  const modals = useModals();

  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation(); // Panggil mutasi logout
  };

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
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
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
          <Group>
            <Tooltip label="Create Transaction" withArrow position="top">
              <ActionIcon
                onClick={openAddTransactionModal}
                size="lg"
                variant="filled"
                radius="100%"
              >
                <IconPlus size={20} />
              </ActionIcon>
            </Tooltip>
            <Menu width={200} position="bottom-end">
              <Menu.Target>
                <Avatar src="/placeholder-image.jpg" alt="User Avatar" radius="xl" />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => {}}>Profile</Menu.Item>
                <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
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
