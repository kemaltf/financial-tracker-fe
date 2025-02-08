import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';

export const storeSchema = z.object({
  name: z.string().min(3, 'Nama store minimal 3 karakter'),
  description: z.string().min(5, 'Deskripsi minimal 5 karakter'),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

const defaultValues: StoreFormValues = {
  name: '',
  description: '',
};
export function useStoreForm(initialValues?: StoreFormValues | undefined) {
  const form = useForm<StoreFormValues>({
    validate: zodResolver(storeSchema),
    initialValues: initialValues || defaultValues,
  });
  return form;
}
