import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';

export const CategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  description: z.string().optional(),
  storeId: z.string().min(1, 'Store wajib dipilih'), // Store ID harus ada
});

export type CategoryFormValues = z.infer<typeof CategorySchema>;

export const useCategoryForm = () =>
  useForm<CategoryFormValues>({
    initialValues: {
      name: '',
      description: '',
      storeId: '',
    },
    validate: zodResolver(CategorySchema),
  });
