'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Container, Divider, Grid } from '@mantine/core';
import { useDeviceType } from '@/hooks/use-device-size';
import { useTransactionHistory } from '@/hooks/use-transaction-history-query';
import {
  api,
  useCreateTransactionMutation,
  useLazyGetBalanceSheetQuery,
  useLazyGetFinancialSummaryQuery,
  useLazyGetTransactionsQuery,
} from '@/lib/features/api';
import { TransactionDTO } from '@/lib/features/api/types/transaction';
import { stringToDate } from '@/utils/helpers';
import { TransactionFormValues, useTransactionForm } from './form';
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
  const router = useRouter();
  const dispatch = useDispatch();

  const { isMobile } = useDeviceType();
  const [trigger] = useLazyGetTransactionsQuery();
  const { filter } = useTransactionHistory();
  const [createTransaction] = useCreateTransactionMutation();
  const [triggerFinancialSummary] = useLazyGetFinancialSummaryQuery();
  const [triggerBalanceSheet] = useLazyGetBalanceSheetQuery();

  const form = useTransactionForm();

  console.log(form.values);

  const handleSubmit = async (values: TransactionFormValues) => {
    const convertedValues: TransactionDTO = {
      transactionTypeId: Number(values.transactionTypeId),
      amount: values.amount,
      note: values.note.trim(),
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
              recipientName: values.address.recipientName?.trim() || '',
              addressLine1: values.address.addressLine1?.trim() || '',
              addressLine2: values.address.addressLine2?.trim() || '',
              city: values.address.city?.trim() || '',
              state: values.address.state?.trim() || '',
              postalCode: values.address.postalCode?.trim() || '',
              phoneNumber: values.address.phoneNumber?.trim() || '',
            }
          : undefined,
      orders: values.products?.map((product) => ({
        productId: Number(product.productId),
        quantity: product.quantity,
      })),
    };

    const result = await createTransaction(convertedValues).unwrap();
    if (result.status === 'success') {
      // close modals
      onClose();

      // reset all state
      dispatch(api.util.resetApiState());

      // reset
      // resetTransactionResult();
      // resetFinancialSummary();

      trigger({
        ...filter,
        page: 1,
      });

      triggerFinancialSummary({
        endMonth: filter.endMonth,
        startMonth: filter.startMonth,
      });

      triggerBalanceSheet({
        endMonth: filter.endMonth,
        startMonth: filter.startMonth,
      });

      router.refresh();
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
