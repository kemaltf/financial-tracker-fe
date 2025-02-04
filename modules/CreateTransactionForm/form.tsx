import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';

const transactionSchema = z
  .object({
    transactionTypeId: z
      .string()
      .trim()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Transaction Type is required',
      }),
    amount: z.number().min(0.01, { message: 'Amount must be greater than 0' }),
    note: z
      .string()
      .trim()
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
        recipientName: z.string().trim().optional(),
        addressLine1: z.string().trim().optional(),
        addressLine2: z.string().trim().optional(),
        city: z.string().trim().optional(),
        state: z.string().trim().optional(),
        postalCode: z.string().trim().optional(),
        phoneNumber: z.string().trim().optional(),
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

export type TransactionFormValues = z.infer<typeof transactionSchema>;

const initialValues: TransactionFormValues = {
  transactionTypeId: null as any,
  amount: null as any,
  note: '',
  debitAccountId: null as any,
  creditAccountId: null as any,
  customerId: null,
  debtorId: null,
  creditorId: null,
  storeId: null as any,
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

export function useTransactionForm() {
  const form = useForm<TransactionFormValues>({
    validate: zodResolver(transactionSchema),
    initialValues,
  });
  return form;
}
