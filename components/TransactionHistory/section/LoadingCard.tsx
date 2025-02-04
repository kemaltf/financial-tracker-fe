import React from 'react';
import { Card, Grid, Skeleton } from '@mantine/core';

const LoadingCard = () => {
  return (
    <Card key="loading-card" withBorder padding="sm" mb="xs">
      <Skeleton height={20} width={150} />
      <Grid>
        <Grid.Col
          span={1.2}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Skeleton width="100%" style={{ aspectRatio: '1 / 1', display: 'block' }} circle />
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
  );
};

export default LoadingCard;
