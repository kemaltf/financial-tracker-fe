import { z } from 'zod';
import { useForm, UseFormReturnType, zodResolver } from '@mantine/form';

export const MAX_VARIANT_TYPES = 3;

export const imageFileSchema = z.object({
  file: z.instanceof(File).nullable(), // Bisa `null` jika dari server
  source: z.enum(['upload', 'select']),
  id: z.union([z.string(), z.number()]),
  url: z.string().url(), // Pastikan URL valid
});

export type ImageFileSchemaType = z.infer<typeof imageFileSchema>;

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  stock: z.number().min(0, 'Stock must be at least 0'),
  price: z.number().min(1, 'Price is required'),
  categories: z.array(z.string()),
  storeId: z.string().min(1, 'Store is required'),
  images: z.array(imageFileSchema), // ✅ Tambahkan array `imageFiles`
  // ✅ Tambahan field ukuran dan berat
  length: z.number().min(0, 'Length must be at least 0').optional(),
  width: z.number().min(0, 'Width must be at least 0').optional(),
  height: z.number().min(0, 'Height must be at least 0').optional(),
  weight: z.number().min(0.01, 'Weight is required'), // ✅ Wajib diisi
  variants: z.array(
    z.object({
      variantOptions: z.record(z.string(), z.string()), // Object key-value seperti { "COLOR": "Red", "SIZE": "M" }
      price: z.number().min(1, 'Price is required'),
      stock: z.number().min(0, 'Stock must be at least 0'),
      sku: z.string(),
      image: z.array(imageFileSchema),
      weight: z.number().min(0.01, 'Weight is required'), // ✅ Wajib diisi
    })
  ),
  variantTypeSelections: z.array(z.string()),
  variantValues: z.record(z.array(z.string())),
  isVariantMode: z.boolean(),
});

export type ProductSchemaFormValues = z.infer<typeof productSchema>;

const defaultProductValues: ProductSchemaFormValues = {
  name: '',
  sku: '',
  description: '',
  stock: 0,
  price: 0,
  weight: 0,
  categories: [],
  storeId: '',
  images: [],
  variants: [],
  variantTypeSelections: [],
  variantValues: {},
  isVariantMode: false,
};

export function useProductForm(initialValues?: ProductSchemaFormValues | undefined) {
  const form = useForm<ProductSchemaFormValues>({
    validate: zodResolver(productSchema),
    initialValues: initialValues || defaultProductValues,
  });
  return form;
}

export type ProductFormType = UseFormReturnType<ProductSchemaFormValues>;
