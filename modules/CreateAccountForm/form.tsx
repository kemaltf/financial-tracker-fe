import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';

export const accountTypes = ['ASSET', 'LIABILITY', 'REVENUE', 'EXPENSE', 'EQUITY'];

export const CreateAccountSchema = z.object({
  name: z.string().trim().min(1, 'Nama harus diisi'),
  type: z.string().refine((val) => accountTypes.includes(val), {
    message: 'Tipe akun tidak valid',
  }),
  description: z.string().trim().min(1, 'Deskripsi harus diisi'),
});

export type CreateAccountDTO = z.infer<typeof CreateAccountSchema>;
const defaultValues: CreateAccountDTO = {
  name: '',
  type: '',
  description: '',
};
export function useAccountForm(initialValues?: CreateAccountDTO | undefined) {
  const form = useForm<CreateAccountDTO>({
    validate: zodResolver(CreateAccountSchema),
    initialValues: initialValues || defaultValues,
  });
  return form;
}
