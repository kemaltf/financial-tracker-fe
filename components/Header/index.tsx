import { IconNotification, IconPlus, IconSearch, IconSettings } from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Box,
  Burger,
  Divider,
  Flex,
  Group,
  Menu,
  ScrollArea,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useDeviceType } from '@/hooks/use-device-size';
import AddTransactionForm from '@/modules/CreateTransactionForm';
import classes from './styles/Header.module.css';

interface Props {
  opened: boolean;
  toggle: () => void;
  handleLogout: () => void;
}

export default function Header({ opened, toggle, handleLogout }: Props) {
  const modals = useModals();
  const { isMobile } = useDeviceType();
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
    <Flex h="100%" gap={10} w="100%" direction={{ base: 'row', md: 'column' }} align="center">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group className={classes.wrapper}>
        <Text visibleFrom="md" className={classes.title} fz={24} fw={800}>
          Welcome back
        </Text>
        <Flex align="center" gap={24}>
          <TextInput
            visibleFrom="md"
            radius="md"
            w={260}
            leftSection={<IconSearch size={14} />}
            placeholder="Search"
            classNames={{
              input: classes.searchInput,
            }}
          />

          <Group>
            <Flex align="center" gap={8}>
              <Menu width={200} position="bottom-end">
                <Menu.Target>
                  <Flex align="center" gap={10}>
                    <Flex pos="relative">
                      <Avatar size={34} src="/placeholder-image.jpg" alt="it's me" />
                      <Box
                        w={12}
                        h={12}
                        bg="green.4"
                        style={{
                          borderRadius: '50%',
                          border: '2px solid black',
                        }}
                        pos="absolute"
                        bottom={-2}
                        right={-2}
                      />
                    </Flex>
                    <Text className={classes.username} lts={-0.4} fz={12} fw={700}>
                      Shin Thant
                    </Text>
                  </Flex>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => {}}>Profile</Menu.Item>
                  <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>

            <Flex align="center" gap={8}>
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
            </Flex>

            <Flex align="center" gap={8}>
              <ActionIcon className={classes.actionIcon} size={30} radius="xl" variant="subtle">
                <IconNotification size={16} />
              </ActionIcon>
              <ActionIcon className={classes.actionIcon} size={30} radius="xl" variant="subtle">
                <IconSettings size={16} />
              </ActionIcon>
            </Flex>
          </Group>
        </Flex>
      </Group>
      <Divider visibleFrom="md" w="100%" />
    </Flex>
  );
}
