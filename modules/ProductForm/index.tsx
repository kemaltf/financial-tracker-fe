'use client';

import { useEffect } from 'react';
import {
  Button,
  MultiSelect,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { GalleryImageSelector } from '@/components/GalleryImageSelector';
import { ImageUpload } from '@/components/ImageUpload';
import TextAreaWithCounter from '@/components/TextAreaCount';
import { useDeviceType } from '@/hooks/use-device-size';
import {
  useGetCategoriesQuery,
  useGetStoresQuery,
  useLazyGetCategoryOptionQuery,
} from '@/lib/features/api';
import { useProductForm } from './form';
import { Variant } from './section/Variant';

export default function CreateProductForm() {
  const { data: storeData, isLoading } = useGetStoresQuery();
  const [fetchCategory, { isFetchingdata, data }] = useLazyGetCategoryOptionQuery();

  const form = useProductForm();

  useEffect(() => {
    if (form.values.storeId) {
      fetchCategory({ storeId: Number(form.values.storeId) });
    }
  }, [form.values.storeId]);

  const { isMobile } = useDeviceType();
  const modals = useModals();

  const openAddTransactionModal = () => {
    modals.openModal({
      title: 'Add New Transaction',
      size: isMobile ? '100%' : '70%',
      radius: 'md',
      scrollAreaComponent: ScrollArea.Autosize,
      children: (
        <GalleryImageSelector
          storeId={Number(form.values.storeId)}
          {...form.getInputProps('images')}
          onClose={() => modals.closeAll()}
          onChange={(newImages) => {
            const currentImages = form.values.images || []; // Ambil data lama

            // ✅ Hindari duplikasi dengan filter berdasarkan `id`
            const uniqueImages = [
              ...currentImages,
              ...newImages.filter((newImg) => !currentImages.some((img) => img.id === newImg.id)),
            ];

            form.setValues({ images: uniqueImages });
          }}
        />
      ),
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
          openAddTransactionModal();
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
        disabled={storeIdNotExist}
      />

      <Variant form={form} />

      <Button type="submit">Create Product</Button>
    </Stack>
  );
}
