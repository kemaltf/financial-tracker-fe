import {
  IconBrandMinecraft,
  IconBuildingStore,
  IconCategory,
  IconHome2,
  IconImageInPicture,
  IconMessageQuestion,
  IconMoneybag,
  IconReport,
  IconSettings2,
  IconTransactionBitcoin,
  IconUsers,
} from '@tabler/icons-react';

export interface FileItem {
  name: string;
  link: string;
  noti?: number;
}

export interface NavLinkType {
  icon: any;
  title: string;
  link: string;
  files: FileItem[];
  hasBorderBottom?: boolean;
}
// https://tabler.io/icons
export const navlinks: NavLinkType[] = [
  {
    icon: IconHome2,
    title: 'Home',
    link: '/dashboard',
    files: [],
    hasBorderBottom: true,
  },

  {
    icon: IconBuildingStore,
    title: 'Stores',
    link: '/dashboard/stores',
    files: [
      {
        name: '+ Create new store',
        link: '/dashboard/stores/create',
        // noti: 1,
      },
      {
        name: 'Store management',
        link: '/dashboard/stores',
        // noti: 1,
      },
    ],
  },
  {
    icon: IconCategory,
    title: 'Product Categories',
    link: '/dashboard/categoies',
    files: [
      {
        name: '+ Create new category',
        link: '/dashboard/products/categories/create',
        // noti: 1,
      },
      {
        name: 'Category',
        link: '/dashboard/products/categories',
        // noti: 1,
      },
    ],
  },
  {
    icon: IconBrandMinecraft,
    title: 'Products',
    link: '/dashboard/products',
    files: [
      {
        name: '+ Create new product',
        link: '/dashboard/products/create',
        // noti: 1,
      },
      {
        name: 'Product management',
        link: '/dashboard/products',
        // noti: 1,
      },

      {
        name: 'Variant Type',
        link: '/dashboard/products/variant-types',
        // noti: 1,
      },
    ],
  },
  {
    icon: IconImageInPicture,
    title: 'Images',
    link: '/dashboard/images',
    files: [
      {
        name: 'Image management',
        link: '/dashboard/images',
        // noti: 1,
      },
      {
        name: '+ Upload new images',
        link: '/dashboard/images/upload',
        // noti: 1,
      },
    ],
  },
  {
    icon: IconUsers,
    title: 'Financial Party',
    link: '/dashboard/financial-party',
    files: [
      {
        name: '+ Create Financial Party',
        link: '/dashboard/financial-party/create',
        // noti: 1,
      },
      {
        name: 'Customer',
        link: '/dashboard/financial-party/customer',
        // noti: 1,
      },
      {
        name: 'Debtor',
        link: '/dashboard/financial-party/debtor',
        // noti: 1,
      },
      {
        name: 'Creditor',
        link: '/dashboard/financial-party/creditor',
        // noti: 1,
      },
    ],
  },
  {
    icon: IconMoneybag,
    title: 'Accounts',
    link: '/dashboard/accounts',
    files: [
      {
        name: '+ Create new account',
        link: '/dashboard/accounts/create',
        // noti: 1,
      },
      {
        name: 'Account Management',
        link: '/dashboard/accounts',
        // noti: 1,
      },
    ],
  },
  {
    icon: IconTransactionBitcoin,
    title: 'Transactions',
    link: '/dashboard/transactions',
    files: [
      {
        name: 'Transaction history',
        link: '/dashboard/transactions',
        // noti: 1,
      },
      {
        name: '+ Create transaction type',
        link: '/dashboard/transactions/types',
        // noti: 1,
      },
    ],
  },
  {
    icon: IconReport,
    title: 'Reports',
    link: '/dashboard/reports',
    files: [
      {
        name: 'Financial Summary',
        link: '/dashboard/reports/summary',
        // noti: 1,
      },
      {
        name: 'Ledger',
        link: '/dashboard/transactions/ledger',
        // noti: 1,
      },
      {
        name: 'Trial Balance',
        link: '/dashboard/transactions/trial-balance',
        // noti: 1,
      },
      {
        name: 'Income Statement',
        link: '/dashboard/transactions/income-statement',
        // noti: 1,
      },
      {
        name: 'Balance Sheet',
        link: '/dashboard/transactions/balance-sheet',
        // noti: 1,
      },
      {
        name: 'Cash Flow',
        link: '/dashboard/transactions/cash-flow',
        // noti: 1,
      },
      {
        name: 'Monthly Trends',
        link: '/dashboard/transactions/monthly-trends',
        // noti: 1,
      },
    ],
  },
];

export const others: NavLinkType[] = [
  {
    title: 'Support',
    link: '/insight-grid/support',
    files: [],
    icon: IconMessageQuestion,
  },
  {
    title: 'Setting',
    link: '/insight-grid/setting',
    files: [],
    icon: IconSettings2,
  },
];
