import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';

const productDiscountSchema = z.object({
  eventName: z.string().min(3, 'Event name harus minimal 3 karakter'),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().min(1, 'Nilai diskon harus lebih dari 0'),
  maxDiscount: z.number().min(0, 'Maksimal diskon tidak boleh negatif'),
  startDate: z.date(),
  endDate: z.date(),
  products: z
    .array(
      z.object({
        id: z.number(),
        image: z.string().optional(),
        label: z.string().optional(),
        price: z.number().min(0, 'Harga tidak boleh negatif').optional(),
        sku: z.string().optional(),
        stock: z.number().min(0, 'Stok tidak boleh negatif').optional(),
      })
    )
    .optional(),
  storeId: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Store is required',
  }),
});

export type ProductDiscountSchemaFormValues = z.infer<typeof productDiscountSchema>;

const now = new Date();
now.setMinutes(now.getMinutes() + 15); // Tambah 15 menit

const defaultProductValues: ProductDiscountSchemaFormValues = {
  eventName: '',
  discountType: 'PERCENTAGE',
  discountValue: 10,
  maxDiscount: 50000,
  startDate: now,
  endDate: null as any,
  storeId: '',
  products: undefined,
};

export function useProductDiscountForm(
  initialValues?: ProductDiscountSchemaFormValues | undefined
) {
  const form = useForm({
    validate: zodResolver(productDiscountSchema),
    initialValues: initialValues || defaultProductValues,
  });

  return form;
}
