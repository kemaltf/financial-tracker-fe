import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';

export const storeSchema = z.object({
  name: z.string().min(3, 'Nama store minimal 3 karakter'),
  description: z.string().min(5, 'Deskripsi minimal 5 karakter'),
  address: z.object({
    addressLine1: z.string().trim(),
    addressLine2: z.string().trim(),
    state: z.string().trim(),
    city: z.string().trim(),
    subdistrict: z.string().trim(),
    postalCode: z.string().trim(),
    phoneNumber: z.string().trim(),
  }),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

const defaultValues: StoreFormValues = {
  name: '',
  description: '',
  address: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
    subdistrict: '',
  },
};

export function useStoreForm(initialValues?: StoreFormValues | undefined) {
  const form = useForm<StoreFormValues>({
    validate: zodResolver(storeSchema),
    initialValues: initialValues || defaultValues,
  });
  return form;
}
