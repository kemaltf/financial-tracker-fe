import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconAmbulance,
  IconCategory,
  IconCode,
  IconFolder,
  IconHome2,
  IconMessageCircle,
  IconMessageQuestion,
  IconMinus,
  IconSelector,
  IconSettings,
  IconSettings2,
  IconTrash,
} from '@tabler/icons-react';
import {
  Badge,
  Collapse,
  Divider,
  Flex,
  Menu,
  rem,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './styles/Navbar.module.css';

export default function Navbar() {
  return (
    <Stack h="100%" gap={20} px="md" py="lg">
      <Flex gap={8} w="100%" align="center">
        <IconHome2 size={50} color="black" />
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton w="100%">
              <Flex w="100%" justify="space-between" align="center">
                <Flex direction="column" align="start" gap={2}>
                  <Text className={classes.team}>Untitled UI Team</Text>
                  <Text fz={10} fw={400} c="gray">
                    shinthantequi@gmail.com
                  </Text>
                </Flex>

                <IconSelector size={18} />
              </Flex>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
              Settings
            </Menu.Item>
            <Menu.Item
              leftSection={<IconMessageCircle style={{ width: rem(14), height: rem(14) }} />}
            >
              Messages
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>

            <Menu.Item
              color="red"
              leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
            >
              Delete my account
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      <ScrollArea h="100%">
        <Flex h="100%" gap={4} direction="column" align="start">
          {navlinks.map((navlink) => {
            return navlink.files.length > 0 ? (
              <Folder key={navlink.id} {...navlink} />
            ) : (
              <Flex w="100%" direction="column" align="start" key={navlink.id}>
                <NavLink {...navlink} />
                {navlink.hasBorderBottom && <Divider my={10} w="100%" />}
              </Flex>
            );
          })}
        </Flex>
      </ScrollArea>

      <Flex w="100%" direction="column" align="start" gap={6}>
        {others.map((otherLink) => (
          <NavLink key={otherLink.id} {...otherLink} />
        ))}
      </Flex>
    </Stack>
  );
}

const NavLink = ({ title, icon: Icon, link }: NavLink) => {
  const pathname = usePathname();
  return (
    <Link
      data-active={pathname === link}
      className={classes.navlink}
      href={link}
      style={{ textDecoration: 'none' }}
    >
      <Icon size={20} />
      <Text className={classes.title} lts={-0.5}>
        {title}
      </Text>
    </Link>
  );
};

const Folder = ({ title, icon: Icon, files }: NavLink) => {
  const [opened, { toggle }] = useDisclosure(true);
  return (
    <Flex direction="column" align="start" w="100%">
      <UnstyledButton
        h={36.15}
        style={{
          justifyContent: 'space-between',
        }}
        w="100%"
        className={classes.navlink}
        onClick={toggle}
      >
        <Flex align="center" gap={10}>
          <Icon size={20} />
          <Text className={classes.title} lts={-0.5}>
            {title}
          </Text>
        </Flex>
        {opened && <IconMinus />}
      </UnstyledButton>
      <Collapse w="100%" pl={30} in={opened}>
        <Flex w="100%" py={14} direction="column" align="start" gap={10}>
          {files.map((file) => (
            <Link
              key={file.id}
              className={classes.subNavLink}
              href={file.link}
              style={{ textDecoration: 'none' }}
            >
              <Text lts={-0.5}>{file.name}</Text>
              <Badge radius={6} className={classes.noti} px={6}>
                {file.noti}
              </Badge>
            </Link>
          ))}
        </Flex>
      </Collapse>
    </Flex>
  );
};

type NavLink = (typeof navlinks)[number];

const navlinks = [
  {
    id: 1,
    icon: IconHome2,
    title: 'Home',
    link: '/insight-grid',
    files: [],
  },
  {
    id: 2,
    icon: IconCode,
    title: 'My projects',
    link: '/insight-grid/dashboard',
    files: [],
    hasBorderBottom: true,
  },
  {
    id: 3,
    icon: IconFolder,
    title: 'Folders',
    link: '/insight-grid/dashboard',
    files: [
      {
        id: 1,
        name: 'View all',
        link: '/insight-grid/dashboard/view-all',
        noti: 48,
      },
      {
        id: 2,
        name: 'Recent',
        link: '/insight-grid/dashboard/recent',
        noti: 6,
      },
      {
        id: 3,
        name: 'Favourites',
        link: '/insight-grid/dashboard/favourite',
        noti: 4,
      },
      {
        id: 4,
        name: 'Shared',
        link: '/insight-grid/dashboard/shared',
        noti: 22,
      },
      {
        id: 5,
        name: 'Achived',
        link: '/insight-grid/dashboard/achieved',
        noti: 14,
      },
    ],
  },
  {
    id: 4,
    icon: IconCategory,
    title: 'All files',
    link: '/insight-grid/all-files',
    files: [],
  },
  {
    id: 5,
    icon: IconAmbulance,
    title: 'Team Members',
    link: '/insight-grid/team-members',
    files: [],
  },
];

const others: NavLink[] = [
  {
    id: 11,
    title: 'Support',
    link: '/insight-grid/support',
    files: [],
    icon: IconMessageQuestion,
  },
  {
    id: 12,
    title: 'Setting',
    link: '/insight-grid/setting',
    files: [],
    icon: IconSettings2,
  },
];
