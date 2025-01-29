'use client';

import React, { useEffect, useMemo } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { z } from 'zod';
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  NumberInput,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import {
  useGetCustomersQuery,
  useGetProductsQuery,
  useGetStoreQuery,
  useGetTransactionTypesQuery,
  useLazyGetAvailableAccountsQuery,
} from '@/lib/features/api';
import { isNullOrUndefined, isZero } from '@/utils/helpers';

const transactionSchema = z
  .object({
    transactionTypeId: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Transaction Type is required',
    }),
    amount: z.number().min(0.01, { message: 'Amount must be greater than 0' }),
    note: z
      .string()
      .min(3, { message: 'Note must be at least 3 characters long' })
      .max(500, { message: 'Note cannot exceed 500 characters' }),
    debitAccountId: z
      .string()
      .refine((val) => val === null || (!isNaN(Number(val)) && Number(val) > 0), {
        message: 'Debit Account is required',
      }),
    creditAccountId: z
      .string()
      .refine((val) => val === null || (!isNaN(Number(val)) && Number(val) > 0), {
        message: 'Credit Account is required',
      }),
    customerId: z
      .string()
      .nullable()
      .optional()
      .refine((val) => val === null || !isNaN(Number(val)), {
        message: 'Customer ID must be a number',
      }),
    debtorId: z
      .string()
      .nullable()
      .optional()
      .refine((val) => val === null || !isNaN(Number(val)), {
        message: 'Debtor ID must be a number',
      }),
    creditorId: z
      .string()
      .nullable()
      .optional()
      .refine((val) => val === null || !isNaN(Number(val)), {
        message: 'Creditor ID must be a number',
      }),
    storeId: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Store is required',
    }),
    dueDate: z.date().optional().nullable(),
    address: z
      .object({
        recipientName: z.string().optional(),
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        phoneNumber: z.string().optional(),
      })
      .optional(),
    products: z
      .array(
        z.object({
          productId: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'Product is required',
          }),
          quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (['3', '4'].includes(data.transactionTypeId)) {
        return data.debtorId && data.creditorId && data.dueDate;
      }
      return true;
    },
    {
      message: 'Debtor, Creditor, and Due Date are required for Transaction Type 3 or 4',
      path: ['debtorId', 'creditorId', 'dueDate'], // This sets the error paths
    }
  );

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface AddTransactionFormProps {
  onClose: () => void;
}

const initialValues: TransactionFormValues = {
  transactionTypeId: null as any,
  amount: 0,
  note: '',
  debitAccountId: '0',
  creditAccountId: '0',
  customerId: null,
  debtorId: null,
  creditorId: null,
  storeId: '0',
  dueDate: null,
  address: {
    recipientName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
  },
  products: [],
};

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onClose }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { data: transactionTypes, isLoading: isLoadingTransactionTypes } =
    useGetTransactionTypesQuery();
  const { data: customers, isLoading: isLoadingCustomers } = useGetCustomersQuery({
    role: 'CUSTOMER',
  });
  const { data: debtors, isLoading: isLoadingDebtors } = useGetCustomersQuery({ role: 'DEBTOR' });
  const { data: creditors, isLoading: isLoadingCreditors } = useGetCustomersQuery({
    role: 'CREDITOR',
  });
  const { data: stores, isLoading: isLoadingStores } = useGetStoreQuery();
  const { data: productData, isLoading: isLoadingProducts } = useGetProductsQuery({
    page: 1,
    limit: 10,
    sortBy: 'price',
    sortDirection: 'DESC',
    storeId: 1,
    filters: {},
  });

  const form = useForm<TransactionFormValues>({
    validate: zodResolver(transactionSchema),
    initialValues,
  });

  const [
    fetchAvailableAccounts,
    {
      data: availableAccounts,
      isLoading: isLoadingAvailableAccount,
      reset: resetAvailableAccounts,
    },
  ] = useLazyGetAvailableAccountsQuery();

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    onClose();
  };

  const transactionTypeIsExist =
    !isNullOrUndefined(form.values.transactionTypeId) && !isZero(form.values.transactionTypeId);

  useEffect(() => {
    if (transactionTypeIsExist) {
      fetchAvailableAccounts(Number(form.values.transactionTypeId));
    } else {
      form.reset();
      resetAvailableAccounts();
    }
  }, [form.values.transactionTypeId, fetchAvailableAccounts]);

  const selectedTransactionType = useMemo(
    () =>
      transactionTypeIsExist &&
      transactionTypes?.data.find(
        (type) => type.value === form.values.transactionTypeId.toString() || ''
      ),
    [form.values.transactionTypeId, transactionTypes, transactionTypeIsExist]
  );

  const addProduct = () => {
    form.insertListItem('products', { productId: '', quantity: 1 });
  };

  const removeProduct = (index: number) => {
    form.removeListItem('products', index);
  };

  return (
    <Container
      {...(isMobile && {
        mb: '70px',
      })}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <Select
              label="Transaction Type"
              placeholder="Select transaction type"
              data={transactionTypes?.data || []}
              {...form.getInputProps('transactionTypeId')}
              required
              disabled={isLoadingTransactionTypes}
              searchable
            />
            {selectedTransactionType && (
              <Text size="sm" color="dimmed">
                {selectedTransactionType.description}
              </Text>
            )}
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Debit Account"
              placeholder="Select debit account"
              data={availableAccounts?.data.debitAccounts || []}
              required
              disabled={!availableAccounts || isLoadingAvailableAccount}
              {...form.getInputProps('debitAccountId')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Credit Account"
              placeholder="Select credit account"
              data={availableAccounts?.data.creditAccounts || []}
              required
              disabled={!availableAccounts || isLoadingAvailableAccount}
              {...form.getInputProps('creditAccountId')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <NumberInput
              leftSection="Rp"
              label="Amount (Rupiah)"
              {...form.getInputProps('amount')}
              required
              thousandSeparator
              hideControls
              allowNegative={false}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <div style={{ position: 'relative', width: '100%', minHeight: '130px' }}>
              <Textarea
                label="Note"
                placeholder="Note"
                {...form.getInputProps('note')}
                onChange={(event) => form.setFieldValue('note', event.currentTarget.value)}
                minRows={4}
                maxRows={10}
                styles={{
                  input: {
                    paddingBottom: '30px', // Tambahkan ruang di bawah untuk counter
                    position: 'relative',
                  },
                }}
                withAsterisk
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '30px', // Jarak dari bawah
                  right: '12px', // Jarak dari kanan
                  fontSize: '12px', // Ukuran font kecil
                  color: form.values.note.length >= 500 ? 'red' : 'gray', // Warna dinamis
                }}
              >
                {form.values.note.length} / {500}
              </div>
            </div>
          </Grid.Col>
          <Grid.Col span={8} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <Select
              label="Store"
              placeholder="Select store"
              data={stores?.data || []}
              {...form.getInputProps('storeId')}
              disabled={isLoadingStores}
              searchable
              allowDeselect
              w="100%"
            />
          </Grid.Col>
          <Grid.Col span={4} style={{ display: 'flex', alignItems: 'flex-start' }} mt={12}>
            <Tooltip label="Add a new store" withArrow>
              <Button
                variant="outline"
                mt="sm"
                w="100%"
                onClick={() => window.open('/register-store', '_blank')}
              >
                Add New Store
              </Button>
            </Tooltip>
          </Grid.Col>
          {['1', '8'].includes(form.values.transactionTypeId) && (
            <Grid.Col span={12}>
              <Select
                label="Customer"
                placeholder="Select customer"
                data={customers?.data || []}
                {...form.getInputProps('customerId')}
                disabled={isLoadingCustomers}
                searchable
                allowDeselect
              />
            </Grid.Col>
          )}
          {['1', '3', '4', '8'].includes(form.values.transactionTypeId) && (
            <Grid.Col span={12}>
              <Tooltip label="Add a new customer, debtor, or creditor" withArrow>
                <Button
                  variant="outline"
                  mt="sm"
                  w="100%"
                  onClick={() => window.open('/register-financial-party', '_blank')}
                >
                  Add New Financial Party
                </Button>
              </Tooltip>
            </Grid.Col>
          )}
          {['3', '4'].includes(form.values.transactionTypeId) && (
            <>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Debtors"
                  placeholder="Select debtor"
                  data={debtors?.data || []}
                  {...form.getInputProps('debtorId')}
                  disabled={isLoadingDebtors}
                  searchable
                  allowDeselect
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Creditor"
                  placeholder="Select creditor"
                  data={creditors?.data || []}
                  {...form.getInputProps('creditorId')}
                  disabled={isLoadingCreditors}
                  searchable
                  allowDeselect
                  withAsterisk
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateTimePicker
                  label="Due date"
                  placeholder="Due date"
                  withAsterisk
                  {...form.getInputProps('dueDate')}
                />
              </Grid.Col>
            </>
          )}
          <Grid.Col span={12}>
            <Group p="apart" mb="xs">
              <Text fw={500}>Products</Text>
              <Button onClick={addProduct} variant="outline" size="xs">
                Add Product
              </Button>
            </Group>
            {form.values.products?.map((product, index) => (
              <Group key={product.productId} mb="xs" align="flex-end">
                <Select
                  label="Product"
                  placeholder="Select product"
                  data={[
                    { value: '1', label: 'Product 1' },
                    { value: '2', label: 'Product 2' },
                    { value: '3', label: 'Product 3' },
                    { value: '4', label: 'Product 4' },
                    { value: '5', label: 'Product 5' },
                    { value: '6', label: 'Product 6' },
                    { value: '7', label: 'Product 7' },
                    { value: '8', label: 'Product 8' },
                    { value: '9', label: 'Product 9' },
                    { value: '10', label: 'Product 10' },
                    { value: '11', label: 'Product 11' },
                    { value: '12', label: 'Product 12' },
                    { value: '13', label: 'Product 13' },
                    { value: '14', label: 'Product 14' },
                    { value: '15', label: 'Product 15' },
                    { value: '16', label: 'Product 16' },
                    { value: '17', label: 'Product 17' },
                    { value: '18', label: 'Product 18' },
                    { value: '19', label: 'Product 19' },
                    { value: '20', label: 'Product 20' },
                  ]}
                  {...form.getInputProps(`products.${index}.productId`)}
                  required
                  style={{ flex: 1 }}
                />

                <NumberInput
                  label="Quantity"
                  {...form.getInputProps(`products.${index}.quantity`)}
                  required
                  min={1}
                  style={{ width: 100 }}
                />
                <ActionIcon color="red" onClick={() => removeProduct(index)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Grid.Col>
          {['1', '3', '4', '8'].includes(form.values.transactionTypeId) && (
            <>
              <Divider my="md" w="100%" />
              <Title order={4} px="8px">
                Address
              </Title>
              <Grid.Col span={12}>
                <TextInput
                  label="Recipient Name"
                  placeholder="Recipient Name"
                  {...form.getInputProps('address.recipientName')}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Address Line 1"
                  placeholder="Address Line 1"
                  {...form.getInputProps('address.addressLine1')}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Address Line 2"
                  placeholder="Address Line 2"
                  {...form.getInputProps('address.addressLine2')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="City"
                  placeholder="City"
                  {...form.getInputProps('address.city')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="State"
                  placeholder="State"
                  {...form.getInputProps('address.state')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Postal Code"
                  placeholder="Postal Code"
                  {...form.getInputProps('address.postalCode')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Phone Number"
                  placeholder="Phone Number"
                  {...form.getInputProps('address.phoneNumber')}
                />
              </Grid.Col>
            </>
          )}
        </Grid>
        <Group
          justify="space-between"
          mt="md"
          w="100%"
          {...(isMobile && {
            pos: 'fixed',
            bottom: 0,
            bg: 'white',
            left: 0,
            p: 'md',
          })}
        >
          <Button variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>

          <Group>
            <Button variant="filled" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Group>
        </Group>
      </form>
    </Container>
  );
};

export default AddTransactionForm;
