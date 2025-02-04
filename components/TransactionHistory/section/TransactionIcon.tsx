// transactionIcons.tsx
import { JSX } from 'react';
import { IconBuildingBank, IconCash, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

export const transactionIcons: Record<string, JSX.Element> = {
  Pemasukan: <IconTrendingUp size={24} color="green" />,
  Pengeluaran: <IconTrendingDown size={24} color="red" />,
  Hutang: <IconBuildingBank size={24} color="yellow" />,
  Piutang: <IconBuildingBank size={24} color="blue" />,
  'Tanam Modal': <IconCash size={24} color="purple" />,
  'Tarik Modal': <IconCash size={24} color="orange" />,
  Transfer: <IconTrendingUp size={24} color="gray" />,
  'Pemasukan Piutang': <IconTrendingUp size={24} color="green" />,
  'Pengeluaran Piutang': <IconTrendingDown size={24} color="red" />,
};
