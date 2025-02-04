import React from 'react';
import { IconCash } from '@tabler/icons-react';
import { Avatar, Card, Grid, Text } from '@mantine/core';
import { formatExchage, getReadableDate, parseDate } from '@/utils/helpers';
import { transactionIcons } from './TransactionIcon';

interface TransactionCardProps {
  txn: {
    createdAt: string;
    transactionType: string;
    note?: string;
    store: string;
    user: string;
    debit: { account: string };
    credit: { account: string };
    amount: number;
  };
}

const TransactionCard = React.forwardRef<HTMLDivElement, TransactionCardProps>(({ txn }, ref) => (
  <Card ref={ref} withBorder padding="sm" mb="xs">
    <Text fw="100" c="gray" fz="xs" pb="sm">
      {getReadableDate(parseDate(txn.createdAt, 'id'), 'id', 'MMMM D, YYYY hh:mm A')}
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

      <Grid.Col span={4} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
        <Text fw={500} c="blue" fz="sm" ta="end">
          {formatExchage(txn.amount, 'id-ID')}
        </Text>
      </Grid.Col>
    </Grid>
  </Card>
));

TransactionCard.displayName = 'TransactionCard';

export default TransactionCard;
