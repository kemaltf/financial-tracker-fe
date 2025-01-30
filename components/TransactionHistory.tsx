import dayjs from 'dayjs';
import { JSX, useEffect, useRef, useState } from 'react';
import { IconBuildingBank, IconCash, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Avatar, Card, Grid, ScrollArea, Tabs, Text } from '@mantine/core';
import { formatRupiah } from '@/utils/helpers';
import TransactionHistoryCSS from './TransactionHistory.module.css';

interface Transaction {
  id: number;
  note: string;
  createdAt: string;
  transactionType: string;
  amount: number;
  debit: { code: string; account: string; balance: number };
  credit: { code: string; account: string; balance: number };
  store: string;
  user: string;
}

const transactionIcons: Record<string, JSX.Element> = {
  Pemasukan: <IconTrendingUp size={24} className="text-green-500" />,
  Pengeluaran: <IconTrendingDown size={24} className="text-red-500" />,
  Hutang: <IconBuildingBank size={24} className="text-yellow-500" />,
  Piutang: <IconBuildingBank size={24} className="text-blue-500" />,
  'Tanam Modal': <IconCash size={24} className="text-purple-500" />,
  'Tarik Modal': <IconCash size={24} className="text-orange-500" />,
  Transfer: <IconTrendingUp size={24} className="text-gray-500" />,
  'Pemasukan Piutang': <IconTrendingUp size={24} className="text-green-500" />,
  'Pengeluaran Piutang': <IconTrendingDown size={24} className="text-red-500" />,
};

const statusColors: Record<string, string> = {
  Pemasukan: 'green',
  Pengeluaran: 'red',
  Hutang: 'yellow',
  Piutang: 'blue',
  'Tanam Modal': 'purple',
  'Tarik Modal': 'orange',
  Transfer: 'gray',
  'Pemasukan Piutang': 'green',
  'Pengeluaran Piutang': 'red',
};

// Generate 12 bulan terakhir
const getLast12Months = () => {
  return Array.from({ length: 12 })
    .map((_, i) => {
      const date = dayjs().subtract(i, 'month');
      return { label: date.format('MMMM'), value: date.format('YYYY-MM') };
    })
    .reverse();
};

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState(getLast12Months()[0].value);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const months = getLast12Months();

  useEffect(() => {
    fetchTransactions();
  }, [page, activeTab]);

  const fetchTransactions = async () => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      const newTransactions: Transaction[] = Array.from({ length: 10 }).map((_, i) => ({
        id: page * 10 + i,
        note: `Transaksi ${page * 10 + i}`,
        createdAt: dayjs(activeTab)
          .startOf('month')
          .add(Math.random() * 30, 'day')
          .toISOString(),
        transactionType: Object.keys(transactionIcons)[Math.floor(Math.random() * 9)],
        amount: Math.floor(Math.random() * 10000000),
        debit: { code: '1-10001', account: 'Kas', balance: 10000000 },
        credit: { code: '4-40200', account: 'Pendapatan', balance: 10100000100 },
        store: 'Toko A',
        user: 'Admin',
      }));
      setTransactions((prev) => [...prev, ...newTransactions]);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading]);

  return (
    <Card shadow="sm" padding="lg" radius="md" className="w-full max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-4">Transaction History</h2>

      <Tabs
        value={activeTab}
        onChange={(val) => {
          setActiveTab(val);
          setPage(1);
          setTransactions([]);
        }}
      >
        {/* Tabs Header dengan Horizontal Scroll */}
        <ScrollArea type="auto" scrollbarSize={6} className="w-full">
          <Tabs.List
            style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}
            className={TransactionHistoryCSS.scrollbarHide}
          >
            {months.map((month) => (
              <Tabs.Tab key={month.value} value={month.value} className="px-4">
                {month.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </ScrollArea>

        {/* Tabs Panel */}
        {months.map((month) => (
          <Tabs.Panel key={month.value} value={month.value} pt="md">
            <ScrollArea h={400}>
              {transactions.length === 0 && !loading ? (
                <Text ta="center" c="gray" fw="500">
                  No transactions
                </Text>
              ) : (
                transactions.map((txn, index) => (
                  <Card key={index} withBorder padding="sm" className="mb-2">
                    <Text fw="100" c="gray" fz="xs" pb="sm">
                      {dayjs(txn.createdAt).format('DD MMM YYYY HH:mm')}
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

                        <Text fz="xs" c={statusColors[txn.transactionType]}>
                          Debit dari {txn.debit.account} Kredit ke {txn.credit.account}
                        </Text>
                      </Grid.Col>

                      {/* Kolom 3: Amount */}
                      <Grid.Col span={3}>
                        <Text fw={500} c={statusColors[txn.transactionType]}>
                          {formatRupiah(txn.amount, 'id-ID')}
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </Card>
                ))
              )}
              <div ref={loaderRef} className="h-10 text-center text-gray-500">
                {loading ? 'Loading more...' : 'Scroll down to load more'}
              </div>
            </ScrollArea>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Card>
  );
}
