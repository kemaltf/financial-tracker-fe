import { Card, Grid, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { TransactionFormValues } from '../form';

interface ShippingOption {
  service: string;
  description: string;
  cost: {
    value: number;
    etd: string;
    note: string;
  }[];
}

interface ShippingResults {
  code: string;
  name: string;
  costs: ShippingOption[];
}

interface ShippingOptionsProps {
  results: ShippingResults[];
  form: UseFormReturnType<TransactionFormValues>;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({ results, form }) => {
  const { value, onChange } = form.getInputProps('shippingMethod');

  return (
    <Grid.Col span={12} p={0}>
      <Group p="apart" mb="xs" justify="space-between">
        <Title order={4}>Shipping</Title>
      </Group>
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }} // 1 kolom di mobile, 2 di tablet, 3 di desktop
        spacing="md"
        w="100%"
      >
        {results.map((result) =>
          result.costs.map((cost) => {
            const isSelected = value === cost.service;

            return (
              <Card
                key={cost.service}
                shadow="sm"
                padding="md"
                radius="md"
                withBorder
                onClick={() => onChange(cost.service)}
                style={{
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #228be6' : undefined,
                  justifyContent: 'space-between',
                }}
              >
                <Stack gap={0}>
                  <Group justify="space-between">
                    <Text fw={500}>{result.name}</Text>
                  </Group>
                  <Text size="xs" c="dimmed">
                    {cost.description}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Estimasi tiba: {cost.cost[0].etd} hari
                  </Text>
                </Stack>
                <Text fw={600} size="lg">
                  Rp {cost.cost[0].value.toLocaleString('id-ID')}
                </Text>
              </Card>
            );
          })
        )}
      </SimpleGrid>
    </Grid.Col>
  );
};
export default ShippingOptions;
