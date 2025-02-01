import dayjs from 'dayjs';
import { JSX, useEffect, useRef, useState } from 'react';
import { IconBuildingBank, IconCash, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Avatar, Card, Grid, ScrollArea, Skeleton, Tabs, Text, Title } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useDeviceType } from '@/hooks/use-device-size';
import { useTransactionHistory } from '@/hooks/use-transaction-history-query';
import { useLazyGetTransactionsQuery } from '@/lib/features/api';
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

export function TransactionHistory() {
  const { isMobile } = useDeviceType();
  const { filter, clearFilter, updateFilter } = useTransactionHistory();

  // TABS
  const [activeTab, setActiveTab] = useState<string>(getLast12Months()[11].value);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const months = getLast12Months();

  // SCROLLING SETUP
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // FETCHING DATA SETUP
  const [trigger, { data, isFetching }] = useLazyGetTransactionsQuery();
  const dataTransactions = data?.data?.data || [];

  useEffect(() => {
    if (dataTransactions.length === 0) {
      return;
    }

    if (data?.data.totalPages && data.data.currentPage + 1 > data.data.totalPages) {
      return;
    }

    if (isIntersecting && !isFetching) {
      updateFilter({
        startMonth: data!.data.filter.startMonth,
        endMonth: data!.data.filter.endMonth,
        limit: 4,
        page: data!.data.currentPage + 1,
        sortBy: 'created_at',
        sortDirection: 'DESC',
      });
    }
  }, [isIntersecting, isFetching]);

  const tabsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startMonth = dayjs(activeTab).startOf('month').format('YYYY-MM-DD');
    const endMonth = dayjs(activeTab).endOf('month').format('YYYY-MM-DD');

    updateFilter({
      startMonth,
      endMonth,
      limit: 4,
      page: 1,
      sortBy: 'created_at',
      sortDirection: 'DESC',
    });

    const scrollToActiveTab = () => {
      if (tabsListRef.current) {
        const targetTab = tabsListRef.current.querySelector(`[data-value="${activeTab}"]`);
        if (targetTab) {
          targetTab.scrollIntoView({
            behavior: 'smooth', // Menambahkan animasi scroll
            inline: 'center', // Agar tab yang aktif berada di tengah secara horizontal
          });
        }
      }
    };

    // Menggunakan setTimeout untuk memastikan elemen selesai dirender
    setTimeout(scrollToActiveTab, 0);
  }, [activeTab]); // Efek ini dipanggil saat activeTab berubah

  useEffect(() => {
    trigger(filter);
  }, [filter]);

  useEffect(() => {
    return () => {
      clearFilter();
    };
  }, []);

  return (
    <Card shadow="sm" padding="sm" radius="md">
      <Title order={3} pb="sm">
        Transaction History
      </Title>

      <Tabs value={activeTab} onChange={(val: string | null) => setActiveTab(val || '')}>
        <ScrollArea scrollbarSize={6}>
          <Tabs.List
            className={TransactionHistoryCSS.scrollbarHide}
            style={{ flexWrap: isMobile ? 'unset' : 'wrap' }}
            ref={tabsListRef} // Menambahkan ref ke Tabs.List
          >
            {months.map((month) => (
              <Tabs.Tab key={month.value} value={month.value} data-value={month.value}>
                {month.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </ScrollArea>

        {months.map((month) => {
          const { ref, entry } = useIntersection({
            root: containerRefs.current[activeTab],
            threshold: 1,
          });

          useEffect(() => {
            if (!isFetching) {
              setIsIntersecting(entry?.isIntersecting || false);
            } else {
              setIsIntersecting(false);
            }
          }, [entry, isFetching]);

          return (
            <Tabs.Panel key={month.value} value={month.value} pt="md">
              <ScrollArea
                h={400}
                ref={(el) => {
                  containerRefs.current[month.value] = el;
                }}
              >
                {!isFetching && dataTransactions.length === 0 ? (
                  <Text ta="center" c="gray" fw="500">
                    No transactions
                  </Text>
                ) : (
                  dataTransactions.map((txn, index) => (
                    <Card
                      key={index}
                      withBorder
                      padding="sm"
                      mb="xs"
                      ref={index === dataTransactions.length - 1 ? ref : null}
                    >
                      <Text fw="100" c="gray" fz="xs" pb="sm">
                        {txn.createdAt} {index} {dataTransactions.length - 1}
                      </Text>

                      <Grid>
                        <Grid.Col
                          span={1}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Avatar size="sm" radius="md">
                            {transactionIcons[txn.transactionType] || <IconCash size={24} />}
                          </Avatar>
                        </Grid.Col>

                        <Grid.Col span={7}>
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

                        <Grid.Col
                          span={4}
                          style={{
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                          }}
                        >
                          <Text fw={500} c="blue" fz="sm" ta="end">
                            {formatRupiah(txn.amount, 'id-ID')}
                          </Text>
                        </Grid.Col>
                      </Grid>
                    </Card>
                  ))
                )}
                {isFetching && (
                  <Card key="loading-card" withBorder padding="sm" mb="xs">
                    <Skeleton height={20} width={150} />
                    <Grid>
                      <Grid.Col
                        span={1.2}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Skeleton
                          width="100%"
                          style={{
                            aspectRatio: '1 / 1', // Menyeting aspect ratio menjadi 1:1
                            display: 'block', // Agar bisa menyesuaikan lebar dan tinggi dengan fleksibel
                          }}
                          circle
                        />
                      </Grid.Col>

                      <Grid.Col span={7.8}>
                        <Skeleton height={20} width="60%" mt="xs" />
                        <Skeleton height={15} width="80%" mt="xs" />
                        <Skeleton height={15} width="60%" mt="xs" />
                      </Grid.Col>

                      <Grid.Col span={3}>
                        <Skeleton height={20} width="70%" mt="xs" />
                      </Grid.Col>
                    </Grid>
                  </Card>
                )}
              </ScrollArea>
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </Card>
  );
}
