import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';

const voucherSchema = z
  .object({
    storeId: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Store is required',
    }),
    eventName: z.string().min(3, 'Event name harus minimal 3 karakter'),
    code: z.string().min(3, 'Code harus minimal 3 karakter'),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    applyTo: z.enum(['TOTAL', 'PRODUCT']),
    discountValue: z.number().min(1, 'Nilai diskon harus lebih dari 0'),
    maxDiscount: z.number().min(0, 'Maksimal diskon tidak boleh negatif'),
    startDate: z.date(),
    endDate: z.date(),
    products: z
      .array(
        z.object({
          id: z.number(),
          image: z.string().url(),
          label: z.string(),
          price: z.number().min(0, 'Harga tidak boleh negatif'),
          sku: z.string(),
          stock: z.number().min(0, 'Stok tidak boleh negatif'),
        })
      )
      .optional(),
  })
  .refine(
    (data) => data.applyTo === 'TOTAL' || (data.applyTo === 'PRODUCT' && data.products?.length),
    {
      message: 'Produk wajib dipilih jika applyTo adalah PRODUCT',
      path: ['products'],
    }
  );

export type VoucherSchemaFormValues = z.infer<typeof voucherSchema>;

const defaultProductValues: VoucherSchemaFormValues = {
  eventName: '',
  code: '',
  discountType: 'PERCENTAGE',
  applyTo: 'TOTAL',
  discountValue: 10,
  maxDiscount: 50000,
  startDate: null as any,
  endDate: null as any,
  storeId: '',
};

export function useVoucherForm(initialValues?: VoucherSchemaFormValues | undefined) {
  const form = useForm({
    validate: zodResolver(voucherSchema),
    initialValues: initialValues || defaultProductValues,
  });

  return form;
}
