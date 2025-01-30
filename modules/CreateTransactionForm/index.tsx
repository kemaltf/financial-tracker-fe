'use client';

import { Container, Divider, Grid, Select } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useDeviceType } from '@/hooks/use-device-size';
import {
  TransactionDTO,
  useCreateTransactionMutation,
  useGetCustomersQuery,
  useGetProductsQuery,
} from '@/lib/features/api';
import { stringToDate } from '@/utils/helpers';
import { TransactionForm } from './form';
import {
  ActionButton,
  Address,
  CustomerSection,
  ProductSection,
  StoreData,
  TransactionMain,
} from './sections';

interface AddTransactionFormProps {
  onClose: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onClose }) => {
  const { isMobile } = useDeviceType();

  const { data: debtors, isLoading: isLoadingDebtors } = useGetCustomersQuery({ role: 'DEBTOR' });
  const { data: creditors, isLoading: isLoadingCreditors } = useGetCustomersQuery({
    role: 'CREDITOR',
  });
  const { data: productData, isLoading: isLoadingProducts } = useGetProductsQuery({
    page: 1,
    limit: 100,
    sortBy: 'price',
    sortDirection: 'DESC',
    storeId: 1,
    filters: {},
  });
  const [createTransaction] = useCreateTransactionMutation();

  const form = TransactionForm();

  const handleSubmit = async (values: typeof form.values) => {
    const convertedValues: TransactionDTO = {
      transactionTypeId: Number(values.transactionTypeId),
      amount: values.amount,
      note: values.note,
      debitAccountId: Number(values.debitAccountId),
      creditAccountId: Number(values.creditAccountId),
      customerId: values.customerId ? Number(values.customerId) : undefined,
      debtorId: values.debtorId ? Number(values.debtorId) : undefined,
      creditorId: values.creditorId ? Number(values.creditorId) : undefined,
      storeId: Number(values.storeId),
      dueDate: values.dueDate ? stringToDate(values.dueDate.toString()) : undefined,
      address:
        values.address && !Object.values(values.address).every((field) => field === '')
          ? {
              recipientName: values.address.recipientName || '',
              addressLine1: values.address.addressLine1 || '',
              addressLine2: values.address.addressLine2 || '',
              city: values.address.city || '',
              state: values.address.state || '',
              postalCode: values.address.postalCode || '',
              phoneNumber: values.address.phoneNumber || '',
            }
          : undefined,
      orders: values.products?.map((product) => ({
        productId: Number(product.productId),
        quantity: product.quantity,
      })),
    };

    try {
      const response = await createTransaction(convertedValues).unwrap();
      console.log('Transaction created successfully:', response);
      onClose();
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  return (
    <Container
      {...(isMobile && {
        mb: '70px',
      })}
      pt="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid pb="md">
          <StoreData form={form} />

          <TransactionMain form={form} />

          {['1', '8'].includes(form.values.transactionTypeId) && (
            <>
              <Divider my="md" w="100%" />
              <CustomerSection form={form} />
              <Divider my="md" w="100%" />
              <ProductSection
                form={form}
                isLoadingProducts={isLoadingProducts}
                productData={productData?.data.data || []}
              />
            </>
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

          {['1', '3', '4', '8'].includes(form.values.transactionTypeId) && (
            <>
              <Divider my="md" w="100%" />
              <Address form={form} />
            </>
          )}
        </Grid>
        <ActionButton form={form} isMobile={isMobile || false} onClose={onClose} />
      </form>
    </Container>
  );
};

export default AddTransactionForm;
