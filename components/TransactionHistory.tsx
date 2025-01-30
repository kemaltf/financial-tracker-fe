import dayjs from 'dayjs';
import { JSX, useEffect, useState } from 'react';
import { IconBuildingBank, IconCash, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Avatar, Card, Grid, Loader, ScrollArea, Tabs, Text } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useGetTransactionsQuery } from '@/lib/features/api';
import { formatRupiah } from '@/utils/helpers';
import TransactionHistoryCSS from './TransactionHistory.module.css';

const transactionIcons: Record<string, JSX.Element> = {
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

const getLast12Months = () => {
  return Array.from({ length: 12 })
    .map((_, i) => {
      const date = dayjs().subtract(i, 'month');
      return { label: date.format('MMMM'), value: date.format('YYYY-MM') };
    })
    .reverse();
};

export default function TransactionHistory() {
  // TABS
  const [activeTab, setActiveTab] = useState<string>(getLast12Months()[0].value);

  // INFINITE SCROLL PAGINATION
  const [page, setPage] = useState(1);
  const months = getLast12Months();

  const { ref, entry } = useIntersection({ threshold: 1 });

  const { data, isFetching } = useGetTransactionsQuery({
    startMonth: dayjs(activeTab).startOf('month').format('YYYY-MM-DD'),
    endMonth: dayjs(activeTab).endOf('month').format('YYYY-MM-DD'),
    limit: 10,
  });
  const dataTransactions = data?.data?.data || [];

  useEffect(() => {
    if (
      entry?.isIntersecting &&
      !isFetching &&
      data?.data.totalPages &&
      data.data.totalPages > page
    ) {
      setPage((prev) => prev + 1);
    }
  }, [entry, isFetching, data]);

  return (
    <Card shadow="sm" padding="lg" radius="md">
      <h2>Transaction History</h2>

      <Tabs value={activeTab} onChange={(val: string | null) => setActiveTab(val || '')}>
        <ScrollArea scrollbarSize={6}>
          <Tabs.List className={TransactionHistoryCSS.scrollbarHide}>
            {months.map((month) => (
              <Tabs.Tab key={month.value} value={month.value}>
                {month.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </ScrollArea>

        {months.map((month) => (
          <Tabs.Panel key={month.value} value={month.value} pt="md">
            <ScrollArea h={400}>
              {isFetching && dataTransactions.length === 0 ? (
                <Loader size="sm" color="blue" />
              ) : dataTransactions.length === 0 ? (
                <Text ta="center" c="gray" fw="500">
                  No transactions
                </Text>
              ) : (
                dataTransactions.map((txn) => (
                  <Card key={txn.id} withBorder padding="sm" mb="xs">
                    <Text fw="100" c="gray" fz="xs" pb="sm">
                      {txn.createdAt}
                    </Text>

                    <Grid>
                      <Grid.Col
                        span={1}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Avatar size="sm" radius="md">
                          {transactionIcons[txn.transactionType] || <IconCash size={24} />}
                        </Avatar>
                      </Grid.Col>

                      <Grid.Col span={8}>
                        <Text fw="500">{txn.transactionType}</Text>
                        <Text fz="xs" c="gray">
                          {txn.note || '-'}
                        </Text>
                        <Text fz="xs" c="gray">
                          {txn.store} - {txn.user}
                        </Text>
                        <Text fz="xs" c="gray">
                          Debit dari {txn.debit.account} Kredit ke {txn.credit.account}
                        </Text>
                      </Grid.Col>

                      <Grid.Col span={3}>
                        <Text fw={500} c="blue">
                          {formatRupiah(txn.amount, 'id-ID')}
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </Card>
                ))
              )}
              <div ref={ref} style={{ height: 40, textAlign: 'center', color: 'gray' }}>
                {isFetching ? 'Loading more...' : 'Scroll down to load more'}
              </div>
            </ScrollArea>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Card>
  );
}
