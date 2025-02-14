import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';

export const ImageUploadSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, 'Minimal satu gambar harus diunggah')
    .max(5, 'Maksimal 5 gambar diperbolehkan'),
  storeId: z
    .string()
    .optional()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Store is required',
    }),
});

export type ImageUploadFormValues = z.infer<typeof ImageUploadSchema>;

export const useImageUploadForm = () =>
  useForm<ImageUploadFormValues>({
    initialValues: {
      storeId: null as any,
      files: [],
    },
    validate: zodResolver(ImageUploadSchema),
    validateInputOnChange: true,
  });
