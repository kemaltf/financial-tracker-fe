'use client';

import { Container, Divider, Grid } from '@mantine/core';
import { useDeviceType } from '@/hooks/use-device-size';
import {
  TransactionDTO,
  useCreateTransactionMutation,
  useGetTransactionsQuery,
} from '@/lib/features/api';
import { useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { stringToDate } from '@/utils/helpers';
import { TransactionForm } from './form';
import {
  ActionButton,
  Address,
  CustomerSection,
  DebtorCreditor,
  ProductSection,
  StoreData,
  TransactionSection,
} from './sections';

interface AddTransactionFormProps {
  onClose: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onClose }) => {
  const queryParams = useAppSelector((state: RootState) => state.query);

  const { isMobile } = useDeviceType();

  const [createTransaction] = useCreateTransactionMutation();
  const { refetch } = useGetTransactionsQuery(queryParams);

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
      refetch();
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

          <TransactionSection form={form} />

          {['1', '8'].includes(form.values.transactionTypeId) && (
            <>
              <Divider my="md" w="100%" />
              <CustomerSection form={form} />
              <Divider my="md" w="100%" />
              <ProductSection form={form} />
            </>
          )}

          {['3', '4'].includes(form.values.transactionTypeId) && <DebtorCreditor form={form} />}

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
