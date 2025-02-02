import { useEffect, useMemo } from 'react';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconBuildingBank,
  IconCash,
  IconCoin,
  IconCreditCard,
  IconExchange,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react';
import { Group, SimpleGrid, Text } from '@mantine/core';
import { useTransactionHistory } from '@/hooks/use-transaction-history-query';
import { useLazyGetFinancialSummaryQuery } from '@/lib/features/api';
import { formatExchage } from '@/utils/helpers';
import { CardWithIcon } from './CardWithIcon';

export function FinancialSummary() {
  const { filter } = useTransactionHistory();

  const [trigger, { data, isFetching }] = useLazyGetFinancialSummaryQuery();

  const dataResult = data?.data;

  useEffect(() => {
    trigger({ endMonth: filter.endMonth, startMonth: filter.startMonth });
  }, []);

  const cardMemo = useMemo(() => {
    const dataList = [
      {
        title: 'Total Income',
        value: dataResult?.totalIncome,
        change: `${dataResult?.totalIncomeChange}%`,
        increased: (dataResult?.totalIncomeChange ?? 0) > 0,
        icon: <IconCoin size={24} color="var(--mantine-color-blue-7)" />,
        describe: 'Shows the overall income and its percentage change over time.',
      },
      {
        title: 'Total Expense',
        value: dataResult?.totalExpense,
        change: `${dataResult?.totalExpenseChange}%`,
        increased: (dataResult?.totalExpenseChange ?? 0) > 0,
        icon: <IconCreditCard size={24} color="var(--mantine-color-blue-7)" />,
        describe: 'Displays the total expenses along with the percentage change.',
      },
      {
        title: 'Total Debt',
        value: dataResult?.totalDebt,
        change: `${dataResult?.totalDebtChange}%`,
        increased: (dataResult?.totalDebtChange ?? 0) > 0,
        icon: <IconTrendingDown size={24} color="var(--mantine-color-blue-7)" />,
        describe:
          'Represents the current total debt and the percentage change compared to the previous period.',
      },
      {
        title: 'Total Receivables',
        value: dataResult?.totalReceivables,
        change: `${dataResult?.totalReceivablesChange}%`,
        increased: (dataResult?.totalReceivablesChange ?? 0) > 0,
        icon: <IconTrendingUp size={24} color="var(--mantine-color-blue-7)" />,
        describe: 'Indicates the total amount receivable and its percentage change.',
      },
      {
        title: 'Total Investment',
        value: dataResult?.totalInvestment,
        change: `${dataResult?.totalInvestmentChange}%`,
        increased: (dataResult?.totalInvestmentChange ?? 0) > 0,
        icon: <IconBuildingBank size={24} color="var(--mantine-color-blue-7)" />,
        describe: 'Shows the total investments made and the percentage change over time.',
      },
      {
        title: 'Total Withdrawal',
        value: dataResult?.totalWithdrawal,
        change: `${dataResult?.totalWithdrawalChange}%`,
        increased: (dataResult?.totalWithdrawalChange ?? 0) > 0,
        icon: <IconCash size={24} color="var(--mantine-color-blue-7)" />,
        describe: 'Displays the total withdrawals and their percentage change.',
      },
      {
        title: 'Total Transfer',
        value: dataResult?.totalTransfer,
        change: `${dataResult?.totalTransferChange}%`,
        increased: (dataResult?.totalTransferChange ?? 0) > 0,
        icon: <IconExchange size={24} color="var(--mantine-color-blue-7)" />,
        describe: 'Represents the total amount transferred and the percentage change.',
      },
      {
        title: 'Total Receivables Income',
        value: dataResult?.totalReceivablesIncome,
        change: `${dataResult?.totalReceivablesIncomeChange}%`,
        increased: (dataResult?.totalReceivablesIncomeChange ?? 0) > 0,
        icon: <IconCoin size={24} color="var(--mantine-color-blue-7)" />,
        describe: 'Shows the income from receivables and the percentage change over time.',
      },
      {
        title: 'Total Receivables Expense',
        value: dataResult?.totalReceivablesExpense,
        change: `${dataResult?.totalReceivablesExpenseChange}%`,
        increased: (dataResult?.totalReceivablesExpenseChange ?? 0) > 0,
        icon: <IconCreditCard size={24} color="var(--mantine-color-blue-7)" />,
        describe: 'Represents the expenses related to receivables and the percentage change.',
      },
      {
        title: 'Profit/Loss',
        value: dataResult?.profitLoss,
        change: `${dataResult?.profitLossChange}%`,
        increased: (dataResult?.profitLoss ?? 0) > 0,
        icon: <IconCoin size={24} color="var(--mantine-color-blue-7)" />,
        describe: 'Displays the net profit or loss and its percentage change.',
      },
    ];

    return dataList.map((item, index) => (
      <CardWithIcon
        key={index}
        icon={item.icon}
        title={item.title}
        isLoading={isFetching || !dataResult}
        value={formatExchage(item.value || 0, 'id-ID')}
        label={item.describe}
      >
        <Group gap="xs">
          {item.increased ? (
            <IconArrowUpRight size={16} color="green" />
          ) : (
            <IconArrowDownRight size={16} color="red" />
          )}
          <Text c={item.increased ? 'green' : 'red'}>{item.change}</Text>
          <Text size="xs" c="dimmed">
            {item.increased ? 'increased' : 'decreased'} vs last month
          </Text>
        </Group>
      </CardWithIcon>
    ));
  }, [data]);

  return (
    <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
      {cardMemo}
    </SimpleGrid>
  );
}
