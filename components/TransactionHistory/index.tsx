import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, ScrollArea, Tabs, Title } from '@mantine/core';
import { useDeviceType } from '@/hooks/use-device-size';
import { useTransactionHistory } from '@/hooks/use-transaction-history-query';
import { useLazyGetTransactionsQuery } from '@/lib/features/api';
import TransactionPanel from './section/TransactionPanel';
import { getLast12Months } from './utils';
import TransactionHistoryCSS from './TransactionHistory.module.css';

export function TransactionHistory() {
  const { isMobile } = useDeviceType();
  const { filter, updateFilter } = useTransactionHistory();

  // GENERATE LAST 12 MONTH
  const months = useMemo(() => {
    return getLast12Months();
  }, []);

  // TABS
  const [activeTab, setActiveTab] = useState<string>(months[11].value);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  // FETCHING DATA SETUP
  const [trigger, { data, isFetching }] = useLazyGetTransactionsQuery();
  const dataTransactions = data?.data?.data || [];

  // INFINITE SCROLLING SETUP
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    if (dataTransactions.length === 0) {
      return;
    }

    if (data?.data.totalPages && data.data.currentPage + 1 > data.data.totalPages) {
      return;
    }

    if (isIntersecting && !isFetching) {
      updateFilter({
        ...filter,
        startMonth: data!.data.filter.startMonth,
        endMonth: data!.data.filter.endMonth,
        page: data!.data.currentPage + 1,
      });
    }
  }, [isIntersecting, isFetching]);

  // SCROLL TO ACTIVE TAB
  const viewport = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true); // Ref untuk mendeteksi render pertama

  useEffect(() => {
    const startMonth = dayjs(activeTab).startOf('month').format('YYYY-MM-DD');
    const endMonth = dayjs(activeTab).endOf('month').format('YYYY-MM-DD');

    updateFilter({
      ...filter,
      startMonth,
      endMonth,
      page: 1,
    });

    // Jika ini adalah render pertama, jalankan scroll ke kanan
    if (isFirstRender.current) {
      isFirstRender.current = false; // Set false setelah pertama kali dijalankan
      const scrollToRight = () => {
        if (viewport.current) {
          viewport.current.scrollTo({
            left: viewport.current.scrollWidth, // Menggulung ke kanan
            behavior: 'smooth',
          });
        }
      };
      setTimeout(scrollToRight, 0);
    } else {
      // Jika bukan render pertama, scroll ke activeTab
      const scrollToActiveTab = () => {
        if (viewport.current) {
          const targetTab = viewport.current.querySelector(`[data-value="${activeTab}"]`);
          if (targetTab) {
            targetTab.scrollIntoView({
              behavior: 'smooth',
              inline: 'center',
            });
          }
        }
      };
      setTimeout(scrollToActiveTab, 0);
    }
  }, [activeTab]); // Efek ini dipanggil saat activeTab berubah

  // FETCH DATA
  useEffect(() => {
    trigger(filter);
  }, [filter]);

  // PANEL MEMO
  const TransactionPanelMemo = useMemo(() => {
    return months.map((month, index) => (
      <TransactionPanel
        key={index}
        month={month}
        activeTab={activeTab}
        dataTransactions={dataTransactions}
        isFetching={isFetching}
        setIsIntersecting={setIsIntersecting}
        containerRefs={containerRefs}
      />
    ));
  }, [months, activeTab, data, isFetching, setIsIntersecting, containerRefs]);

  return (
    <Card shadow="sm" padding="sm" radius="md">
      <Title order={3} pb="sm">
        Transaction History
      </Title>

      <Tabs value={activeTab} onChange={(val: string | null) => setActiveTab(val || '')}>
        <ScrollArea
          scrollbarSize={0}
          scrollbars="x"
          viewportRef={viewport} // Menambahkan ref ke Tabs.List
        >
          <Tabs.List
            className={TransactionHistoryCSS.scrollbarHide}
            style={{ flexWrap: isMobile ? 'unset' : 'wrap' }}
          >
            {months.map((month) => (
              <Tabs.Tab key={month.value} value={month.value} data-value={month.value}>
                {month.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </ScrollArea>
        {TransactionPanelMemo}
      </Tabs>
    </Card>
  );
}
