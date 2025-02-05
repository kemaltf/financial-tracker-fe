import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';

export const CreateFinancialPartySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal Code is required'),
  role: z.string().min(1, 'Role is required'),
});

// Infer TypeScript type from schema
export type CreateFinancialPartyType = z.infer<typeof CreateFinancialPartySchema>;

export const defaultFinancialPartyValues: CreateFinancialPartyType = {
  name: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  role: '',
};

export function useFinancialPartyForm(initialValues?: CreateFinancialPartyType | undefined) {
  const form = useForm<CreateFinancialPartyType>({
    validate: zodResolver(CreateFinancialPartySchema),
    initialValues: initialValues || defaultFinancialPartyValues,
  });
  return form;
}
