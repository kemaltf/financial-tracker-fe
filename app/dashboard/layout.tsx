'use client';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { useLogoutMutation } from '@/lib/features/api';
import classes from './styles/Layout.module.css';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();

  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation(); // Panggil mutasi logout
  };

  return (
    <AppShell
      header={{
        height: 'var(--app-header-height)',
        offset: false,
      }}
      // header={{ height: 60 }}
      navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      // padding="md"
      classNames={{
        root: classes.root,
        navbar: classes.navbar,
        header: classes.header,
        main: classes.main,
      }}
    >
      <AppShell.Header>
        <Header opened={opened} toggle={toggle} handleLogout={handleLogout} />
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
