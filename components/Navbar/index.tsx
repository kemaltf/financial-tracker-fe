import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconBrandMinecraft,
  IconBuildingStore,
  IconHome2,
  IconImageInPicture,
  IconMessageCircle,
  IconMessageQuestion,
  IconMinus,
  IconMoneybag,
  IconReport,
  IconSelector,
  IconSettings,
  IconSettings2,
  IconTransactionBitcoin,
  IconTrash,
  IconUsers,
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
              {file?.noti && (
                <Badge radius={6} className={classes.noti} px={6}>
                  {file.noti}
                </Badge>
              )}
            </Link>
          ))}
        </Flex>
      </Collapse>
    </Flex>
  );
};

interface FileItem {
  id: number;
  name: string;
  link: string;
  noti?: number;
}

interface NavLink {
  id: number;
  icon: any;
  title: string;
  link: string;
  files: FileItem[];
  hasBorderBottom?: boolean;
}

// https://tabler.io/icons
const navlinks: NavLink[] = [
  {
    id: 1,
    icon: IconHome2,
    title: 'Home',
    link: '/dashboard',
    files: [],
    hasBorderBottom: true,
  },

  {
    id: 3,
    icon: IconBuildingStore,
    title: 'Stores',
    link: '/dashboard/stores',
    files: [
      {
        id: 1,
        name: '+ Create new store',
        link: '/dashboard/stores/create',
        // noti: 1,
      },
      {
        id: 2,
        name: 'Store management',
        link: '/dashboard/stores',
        // noti: 1,
      },
    ],
  },
  {
    id: 4,
    icon: IconBrandMinecraft,
    title: 'Products',
    link: '/dashboard/products',
    files: [
      {
        id: 1,
        name: 'Product management',
        link: '/dashboard/products',
        // noti: 1,
      },
      {
        id: 2,
        name: '+ Create new product',
        link: '/dashboard/products/create',
        // noti: 1,
      },
      {
        id: 3,
        name: 'Category',
        link: '/dashboard/products/categories',
        // noti: 1,
      },
      {
        id: 4,
        name: 'Variant Type',
        link: '/dashboard/products/variant-types',
        // noti: 1,
      },
    ],
  },
  {
    id: 5,
    icon: IconImageInPicture,
    title: 'Images',
    link: '/dashboard/images',
    files: [
      {
        id: 1,
        name: 'Image management',
        link: '/dashboard/images',
        // noti: 1,
      },
      {
        id: 2,
        name: '+ Upload new images',
        link: '/dashboard/images/upload',
        // noti: 1,
      },
    ],
  },
  {
    id: 6,
    icon: IconUsers,
    title: 'Financial Party',
    link: '/dashboard/financial-party',
    files: [
      {
        id: 1,
        name: 'Customer',
        link: '/dashboard/financial-party/customer',
        // noti: 1,
      },
      {
        id: 2,
        name: 'Debtor',
        link: '/dashboard/financial-party/debtor',
        // noti: 1,
      },
      {
        id: 3,
        name: 'Creditor',
        link: '/dashboard/financial-party/creditor',
        // noti: 1,
      },
      {
        id: 4,
        name: 'Create Financial Party',
        link: '/dashboard/financial-party/create',
        // noti: 1,
      },
    ],
  },
  {
    id: 7,
    icon: IconMoneybag,
    title: 'Accounts',
    link: '/dashboard/accounts',
    files: [
      {
        id: 1,
        name: 'Account Management',
        link: '/dashboard/accounts',
        // noti: 1,
      },
      {
        id: 2,
        name: 'Debtor',
        link: '/dashboard/accounts/create',
        // noti: 1,
      },
    ],
  },
  {
    id: 8,
    icon: IconTransactionBitcoin,
    title: 'Transactions',
    link: '/dashboard/transactions',
    files: [
      {
        id: 1,
        name: 'Transaction history',
        link: '/dashboard/transactions',
        // noti: 1,
      },
      {
        id: 2,
        name: '+ Create transaction type',
        link: '/dashboard/transactions/types',
        // noti: 1,
      },
    ],
  },
  {
    id: 9,
    icon: IconReport,
    title: 'Reports',
    link: '/dashboard/reports',
    files: [
      {
        id: 1,
        name: 'Financial Summary',
        link: '/dashboard/reports/summary',
        // noti: 1,
      },
      {
        id: 2,
        name: 'Ledger',
        link: '/dashboard/transactions/ledger',
        // noti: 1,
      },
      {
        id: 3,
        name: 'Trial Balance',
        link: '/dashboard/transactions/trial-balance',
        // noti: 1,
      },
      {
        id: 4,
        name: 'Income Statement',
        link: '/dashboard/transactions/income-statement',
        // noti: 1,
      },
      {
        id: 5,
        name: 'Balance Sheet',
        link: '/dashboard/transactions/balance-sheet',
        // noti: 1,
      },
      {
        id: 6,
        name: 'Cash Flow',
        link: '/dashboard/transactions/cash-flow',
        // noti: 1,
      },
      {
        id: 7,
        name: 'Monthly Trends',
        link: '/dashboard/transactions/monthly-trends',
        // noti: 1,
      },
    ],
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
