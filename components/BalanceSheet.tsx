import { useEffect, useMemo } from 'react';
import { IconArrowDownRight, IconChartLine, IconCoin } from '@tabler/icons-react';
import { Group, SimpleGrid, Spoiler, Title } from '@mantine/core';
import { useTransactionHistory } from '@/hooks/use-transaction-history-query';
import { useLazyGetBalanceSheetQuery } from '@/lib/features/api';
import { formatExchage, isNullOrUndefined } from '@/utils/helpers';
import { CardWithIcon } from './CardWithIcon';

export function BalanceSheet() {
  const { filter } = useTransactionHistory();

  const [trigger, { data, isFetching, currentData }] = useLazyGetBalanceSheetQuery();

  const dataResult = data?.data || {
    assets: [{ name: '', total: 0 }],
    equity: [{ name: '', total: 0 }],
    liabilities: [{ name: '', total: 0 }],
  };

  useEffect(() => {
    trigger({ endMonth: filter.endMonth, startMonth: filter.startMonth });
  }, []);

  const cardMemo = useMemo(() => {
    console.log('re render', isFetching, isNullOrUndefined(data?.data), currentData, data);
    return (
      <>
        {dataResult?.assets.map((asset) => (
          <CardWithIcon
            key={asset.name}
            icon={<IconCoin size={24} color="var(--mantine-color-yellow-5)" />}
            title={asset.name}
            value={formatExchage(asset.total || 0, 'id-ID')}
            isLoading={isFetching || isNullOrUndefined(data?.data)}
            label={`Total ${asset.name}`}
          />
        ))}
        {/* Render liability cards */}
        {dataResult?.liabilities.map((liability) => (
          <CardWithIcon
            key={liability.name}
            icon={<IconArrowDownRight size={24} color="var(--mantine-color-red-6)" />}
            title={liability.name}
            value={formatExchage(liability.total || 0, 'id-ID')}
            isLoading={isFetching || isNullOrUndefined(data?.data)}
            label={`Total ${liability.name}`}
          />
        ))}
        {/* Render equity cards */}
        {dataResult?.equity.map((equity) => (
          <CardWithIcon
            key={equity.name}
            icon={<IconChartLine size={24} color="var(--mantine-color-blue-6)" />}
            title={equity.name}
            value={formatExchage(equity.total || 0, 'id-ID')}
            isLoading={isFetching || isNullOrUndefined(data?.data)}
            label={`Total ${equity.name}`}
          />
        ))}
      </>
    );
  }, [dataResult]);

  return (
    <>
      <Group pb="sm">
        <Title order={3}>Balance Sheet</Title>
      </Group>
      <Spoiler maxHeight={200} showLabel="Show more" hideLabel="Hide" transitionDuration={200}>
        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
          {cardMemo}
        </SimpleGrid>
      </Spoiler>
    </>
  );
}
