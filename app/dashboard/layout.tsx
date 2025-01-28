'use client';

import React, { useState } from 'react';
import { AppShell, Burger, Button, Group, Modal, ScrollArea, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import AddTransactionForm from '@/components/AddTransactionForm';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, setModalOpened] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

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
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Add New Transaction"
        size="70%" // Adjust size based on screen size
        scrollAreaComponent={ScrollArea.Autosize}
        fullScreen={isMobile} // Make fullscreen on mobile
        radius="md"
      >
        <ScrollArea
          styles={{
            root: {
              maxWidth: '100%',
              '&:hover': {
                overflowY: 'auto',
                overflowX: 'hidden',
              },
              overflowX: 'hidden',
            },
          }}
        >
          <AddTransactionForm onClose={() => setModalOpened(false)} />
        </ScrollArea>
      </Modal>
    </AppShell>
  );
};

export default DashboardLayout;
