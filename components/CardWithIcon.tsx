import React, { JSX, ReactNode } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import { Card, Group, Skeleton, Stack, Text, Tooltip } from '@mantine/core';

interface InfoCardProps {
  icon: JSX.Element;
  title: string;
  value: string;
  children: ReactNode;
  isLoading: boolean; // Menambahkan properti untuk memeriksa status loading
  label: string;
}

export const CardWithIcon: React.FC<InfoCardProps> = ({
  icon,
  title,
  value,
  children,
  isLoading,
  label,
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="xs" align="start">
        <Group gap="xs">
          {isLoading ? <Skeleton height={24} width={24} circle /> : icon}
          {isLoading ? (
            <Skeleton height={20} width={100} />
          ) : (
            <Group gap={5}>
              <Text size="sm" c="dimmed" ta="center">
                {title}
              </Text>
              <Tooltip label={label}>
                <IconInfoCircle height={15} width={15} />
              </Tooltip>
            </Group>
          )}
        </Group>
        {isLoading ? (
          <Skeleton height={30} width={120} />
        ) : (
          <Text size="xl" fw={700}>
            {value}
          </Text>
        )}
        {isLoading ? (
          <Group gap="xs">
            <Skeleton height={16} width={40} />
            <Skeleton height={16} width={60} />
            <Skeleton height={14} width={80} />
          </Group>
        ) : (
          children
        )}
      </Stack>
    </Card>
  );
};
