'use client';

import { useEffect } from 'react';
import { Button, MultiSelect, NumberInput, rem, Select, Stack, TextInput } from '@mantine/core';
import { ImageUpload } from '@/components/ImageUpload';
import { opeImageSelectorModal } from '@/components/Modals/ImageSelector';
import TextAreaWithCounter from '@/components/TextAreaCount';
import { useDeviceType } from '@/hooks/use-device-size';
import { useGetStoresQuery, useLazyGetCategoryOptionQuery } from '@/lib/features/api';
import { useProductForm } from './form';
import { Variant } from './section/Variant';

export default function CreateProductForm() {
  const { data: storeData, isLoading } = useGetStoresQuery();
  const [fetchCategory, { data, isFetching: isFetchingCategory }] = useLazyGetCategoryOptionQuery();

  const form = useProductForm();
  const { isMobile } = useDeviceType();

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

  console.log(form.values);

  return (
    <Stack>
      <Select
        label="Store"
        placeholder="Select store"
        data={storeData?.data}
        {...form.getInputProps('storeId')}
        disabled={isLoading}
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
        disabled={storeIdNotExist}
      />
      <TextInput
        label="SKU"
        {...form.getInputProps('sku')}
        placeholder="SKU"
        disabled={storeIdNotExist}
      />
      <ImageUpload
        {...form.getInputProps('images')}
        onClick={() => {
          openImageModal();
        }}
        maxImages={6}
        // predefinedBoxes
        label="Product Images"
        disabled={storeIdNotExist}
      />
      <TextAreaWithCounter
        label="Description"
        {...form.getInputProps('description')}
        withAsterisk
        placeholder="Description"
        disabled={storeIdNotExist}
        inputHeight={rem(200)}
      />

      <NumberInput
        label="Stock"
        {...form.getInputProps('stock')}
        placeholder="Stock"
        disabled={storeIdNotExist}
        allowNegative={false}
      />
      <NumberInput
        leftSection="Rp"
        label="Price (Rupiah)"
        placeholder="10,000,000"
        {...form.getInputProps('Price')}
        required
        thousandSeparator
        hideControls
        allowNegative={false}
        disabled={storeIdNotExist}
      />
      <MultiSelect
        label="Categories"
        data={data?.data} // Replace with real categories
        {...form.getInputProps('categories')}
        placeholder="Categories"
        disabled={storeIdNotExist || isFetchingCategory}
      />

      <Variant form={form} />

      <Button type="submit">Create Product</Button>
    </Stack>
  );
}
