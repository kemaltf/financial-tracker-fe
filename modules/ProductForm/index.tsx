'use client';

import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  Button,
  Flex,
  MultiSelect,
  NumberInput,
  rem,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { ImageUpload } from '@/components/ImageUpload';
import { opeImageSelectorModal } from '@/components/Modals/ImageSelector';
import TextAreaWithCounter from '@/components/TextAreaCount';
import { useDeviceType } from '@/hooks/use-device-size';
import {
  useCreateProductMutation,
  useEditProductMutation,
  useGetStoresQuery,
  useLazyGetCategoryOptionQuery,
  useLazyGetProductQuery,
} from '@/lib/features/api';
import { ProductSchemaFormValues, useProductForm } from './form';
import { Variant } from './section/Variant';

export default function ProductForm() {
  const { data: storeData, isLoading } = useGetStoresQuery();
  const [fetchCategory, { data, isFetching: isFetchingCategory }] = useLazyGetCategoryOptionQuery();
  const [createProduct, { isLoading: isCreateProductLoading }] = useCreateProductMutation();
  const [fetchProduct, { isFetching: isFetchingProduct, isLoading: isLoadingProduct }] =
    useLazyGetProductQuery();
  const [editProduct] = useEditProductMutation();

  const form = useProductForm();
  const { isMobile } = useDeviceType();
  const router = useRouter();
  const params = useParams();
  const path = usePathname().split('/')[3];
  console.log(path);

  console.log(form.values);

  const id = params?.id as string | undefined;

  useEffect(() => {
    if (form.values.storeId) {
      fetchCategory({ storeId: Number(form.values.storeId) });
    }
  }, [form.values.storeId]);

  const openImageModal = () => {
    opeImageSelectorModal({
      storeId: Number(form.values.storeId),
      value: form.getInputProps('images').value,
      onChange: (newImages) => {
        const currentImages = form.values.images || []; // Ambil data lama

        // ✅ Hindari duplikasi dengan filter berdasarkan `id`
        const uniqueImages = [
          ...currentImages,
          ...newImages.filter((newImg) => !currentImages.some((img) => img.id === newImg.id)),
        ];

        form.setValues({ images: uniqueImages });
      },
      size: isMobile ? '100%' : '70%',
    });
  };

  const storeIdNotExist = !form.values.storeId;
  const onSubmit = async (values: ProductSchemaFormValues) => {
    if (path === 'edit' && id) {
      const result = await editProduct({
        ...values,
        storeId: Number(values.storeId),
        categories: values.categories.map((category) => parseInt(category, 10)),
        id,
      }).unwrap();
      if (result.status === 'success') {
        router.push('/dashboard/products/categories');
        form.reset();
      }
    } else {
      // Mengonversi kategori dari string ke integer
      const updatedValues = {
        ...values,
        storeId: Number(values.storeId),
        categories: values.categories.map((category) => parseInt(category, 10)), // Mengubah kategori menjadi integer
      };

      await createProduct(updatedValues); // Memanggil fungsi untuk create produk dengan kategori yang sudah terkonversi
      router.push('/dashboard/products');
      form.reset();
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct({ id: Number(id) }).then((result) => {
        if (result.data?.data) {
          const variantTypes = Array.from(
            new Set(
              result.data.data.variants.flatMap((variant) =>
                variant.variantOptions.map((option) => option.type)
              )
            )
          ); // Ambil semua variant type dalam urutan unik

          const variantValues = Object.fromEntries(
            variantTypes.map((type, index) => [
              String(index), // Gunakan index sebagai key
              Array.from(
                new Set(
                  result?.data?.data?.variants?.flatMap((variant) =>
                    variant.variantOptions
                      .filter((option) => option.type === type)
                      .map((option) => option.name)
                  )
                )
              ),
            ])
          );

          form.setValues({
            name: result.data.data.name,
            description: result.data.data.description,
            storeId: String(result.data.data.store.id),
            sku: result.data.data.sku ?? '',
            stock: result.data.data.stock,
            price: result.data.data.price,
            categories: result.data.data.categories.map((category) => String(category.id)), // Schema butuh string

            images: result.data.data.images.map((image) => ({
              file: null, // Karena ini dari server, tidak ada file yang di-upload langsung
              source: 'select', // Karena berasal dari database, bukan upload baru
              id: image.id, // Bisa gunakan `name` atau `url` sebagai ID unik
              url: image.url,
            })),

            variants: result.data.data.variants.map((variant) => ({
              variantOptions: Object.fromEntries(
                variant.variantOptions.map((option) => [option.type, option.name])
              ), // Mengubah array menjadi object key-value
              price: variant.price,
              stock: variant.stock,
              sku: variant.sku,
              image: variant.image.map((image) => ({
                file: null, // Dari server, tidak ada file
                source: 'select',
                id: image.id, // Bisa pakai `name` atau `url` sebagai ID unik
                url: image.url,
              })),
            })),

            variantTypeSelections: result.data.data.variantTypeSelections.map((value) =>
              String(value)
            ),

            variantValues, // Mengelompokkan variantOptions ke dalam record type -> [names]

            isVariantMode: result.data.data.variants.length > 0,
          });
        }
      });
    }
  }, [id, fetchProduct]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Select
          label="Store"
          placeholder="Select store"
          data={storeData?.data}
          {...form.getInputProps('storeId')}
          disabled={isLoading || isFetchingProduct || isLoadingProduct}
          searchable
          allowDeselect
          w="100%"
          required
        />
        <TextInput
          label="Product Name"
          {...form.getInputProps('name')}
          withAsterisk
          placeholder="Product name"
          disabled={storeIdNotExist || isFetchingProduct || isLoadingProduct}
        />
        <TextInput
          label="SKU"
          {...form.getInputProps('sku')}
          placeholder="SKU"
          disabled={storeIdNotExist || isFetchingProduct || isLoadingProduct}
        />
        <ImageUpload
          {...form.getInputProps('images')}
          onClick={() => {
            openImageModal();
          }}
          maxImages={6}
          // predefinedBoxes
          label="Product Images"
          disabled={storeIdNotExist || isFetchingProduct || isLoadingProduct}
        />
        <TextAreaWithCounter
          label="Description"
          {...form.getInputProps('description')}
          withAsterisk
          maxLength={1000}
          placeholder="Description"
          disabled={storeIdNotExist || isFetchingProduct || isLoadingProduct}
          inputHeight={rem(200)}
        />

        <NumberInput
          label="Stock"
          {...form.getInputProps('stock')}
          placeholder="Stock"
          disabled={storeIdNotExist || isFetchingProduct || isLoadingProduct}
          allowNegative={false}
        />
        <NumberInput
          leftSection="Rp"
          label="Price (Rupiah)"
          placeholder="10,000,000"
          {...form.getInputProps('price')}
          required
          thousandSeparator
          hideControls
          allowNegative={false}
          disabled={storeIdNotExist || isFetchingProduct || isLoadingProduct}
        />
        <MultiSelect
          label="Categories"
          data={data?.data} // Replace with real categories
          {...form.getInputProps('categories')}
          placeholder="Categories"
          disabled={storeIdNotExist || isFetchingCategory || isFetchingProduct || isLoadingProduct}
        />

        <Variant form={form} />

        <Flex w="100%" justify="end">
          <Button type="submit" disabled={isCreateProductLoading}>
            {isCreateProductLoading ? 'Creating...' : 'Create Product'}
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
