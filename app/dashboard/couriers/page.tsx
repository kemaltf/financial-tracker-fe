'use client';

import { useEffect } from 'react';
import { Card, Group, Select, Skeleton, Stack, Switch, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  useGetCouriersListQuery,
  useLazyGetCouriersQuery,
  useToggleCourierMutation,
} from '@/lib/features/api/features/courier-endpoints';
import { useGetStoresQuery } from '@/lib/features/api/features/store-endpoints';
import { isNullOrUndefined } from '@/utils/helpers';

function Couriers() {
  const { data: dataStore, isLoading } = useGetStoresQuery();
  const { data: dataCourierList, isLoading: isLoadingCourierList } = useGetCouriersListQuery();
  const [toggleCourierService] = useToggleCourierMutation();
  const form = useForm({
    initialValues: {
      storeId: '',
    },
  });

  const storesData = dataStore?.data || [];

  const [fetchCourier, { data: dataStoreCourier, reset }] = useLazyGetCouriersQuery();

  useEffect(() => {
    if (form.values.storeId !== '' && !isNullOrUndefined(form.values.storeId)) {
      fetchCourier({ id: form.values.storeId });
    } else {
      reset();
    }
  }, [form.values.storeId]);

  return (
    <Stack>
      <Select
        label="Store"
        placeholder="Select store"
        data={storesData}
        {...form.getInputProps('storeId')}
        disabled={isLoading}
        searchable
        allowDeselect
        w="100%"
        required
      />

      {form.values && form.values.storeId !== '' && (
        <Stack>
          {isLoadingCourierList
            ? // 🔹 Loading Skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} shadow="sm" p="md" withBorder>
                  <Group p="apart">
                    <Skeleton height={20} width="50%" />
                    <Skeleton height={15} width="20%" />
                  </Group>
                  <Stack mt="md">
                    {Array.from({ length: 2 }).map((_, idx) => (
                      <Group key={idx} p="apart">
                        <Skeleton height={15} width="40%" />
                        <Skeleton height={20} width={40} />
                      </Group>
                    ))}
                  </Stack>
                </Card>
              ))
            : // 🔹 Tampilkan Data Kurir
              dataCourierList?.data.map((courier) => {
                const storeCourier = dataStoreCourier?.data.find((c) => c.code === courier.code);
                const isCourierActive = storeCourier?.service?.length;

                return (
                  <Card key={courier.code} shadow="sm" p="md" withBorder>
                    <Group p="apart">
                      <Text fw={500}>{courier.label}</Text>
                      <Text size="sm" c={isCourierActive ? 'green' : 'red'}>
                        {isCourierActive ? 'Active' : 'Inactive'}
                      </Text>
                    </Group>
                    <Stack mt="md">
                      {courier.services.map((service) => (
                        <Group key={service} p="apart">
                          <Text>{service}</Text>
                          <Switch
                            checked={
                              dataStoreCourier?.data
                                .find((c) => c.code === courier.code)
                                ?.service?.includes(service) ?? false
                            }
                            onChange={() =>
                              toggleCourierService({
                                storeId: form.values.storeId,
                                courierCode: courier.code,
                                service,
                                action: dataStoreCourier?.data
                                  .find((c) => c.code === courier.code)
                                  ?.service?.includes(service)
                                  ? 'disable'
                                  : 'enable',
                              })
                            }
                          />
                        </Group>
                      ))}
                    </Stack>
                  </Card>
                );
              })}
        </Stack>
      )}
    </Stack>
  );
}

export default Couriers;
