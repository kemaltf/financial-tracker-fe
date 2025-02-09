import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';

export const VariantTypeSchema = z.object({
  name: z.string().min(1, 'Nama variant wajib diisi'),
  storeId: z.string().min(1, 'Store wajib dipilih'), // Store ID harus ada
});

export type VariantTypeFormValues = z.infer<typeof VariantTypeSchema>;

export const useVariantTypeForm = () =>
  useForm<VariantTypeFormValues>({
    initialValues: {
      name: '',
      storeId: '',
    },
    validate: zodResolver(VariantTypeSchema),
  });
