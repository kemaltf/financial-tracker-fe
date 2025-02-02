import { RefObject, useEffect, useMemo } from 'react';
import { ScrollArea, Tabs, Text } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import LoadingCard from './LoadingCard';
import TransactionCard from './TransactionCard';

type TransactionPanelProps = {
  month: { label: string; value: string };
  activeTab: string;
  dataTransactions: any[];
  isFetching: boolean;
  setIsIntersecting: React.Dispatch<React.SetStateAction<boolean>>;
  containerRefs: RefObject<Record<string, HTMLDivElement | null>>;
};

const TransactionPanel = ({
  month,
  activeTab,
  dataTransactions,
  isFetching,
  setIsIntersecting,
  containerRefs,
}: TransactionPanelProps) => {
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

  const panelCard = useMemo(() => {
    return dataTransactions.map((txn, index) => (
      <TransactionCard
        key={index}
        txn={txn}
        ref={index === dataTransactions.length - 1 ? ref : null}
      />
    ));
  }, [dataTransactions, ref]);

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
          panelCard
        )}
        {isFetching && <LoadingCard />}
      </ScrollArea>
    </Tabs.Panel>
  );
};

export default TransactionPanel;
