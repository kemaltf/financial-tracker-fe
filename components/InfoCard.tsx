import React from 'react';
import { Card, Grid, Text } from '@mantine/core';

interface InfoCardProps {
  title: string;
  data: { label: string; value: string | number }[];
}

const InfoCard: React.FC<InfoCardProps> = ({ title, data }) => {
  return (
    <Card shadow="xs" padding="md" withBorder>
      <Text size="lg" fw={700} mb="sm">
        {title}
      </Text>
      <Grid gutter={5}>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <Grid.Col span={6}>
              <Text>{item.label}:</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>{item.value}</Text>
            </Grid.Col>
          </React.Fragment>
        ))}
      </Grid>
    </Card>
  );
};

export default InfoCard;
