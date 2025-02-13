'use client';

import { useEffect, useState } from 'react';
import { Button, Group, MultiSelect, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { ImageUpload } from '@/components/ImageUpload';
import TextAreaWithCounter from '@/components/TextAreaCount';
import {
  useGetCategoriesQuery,
  useGetStoresQuery,
  useLazyGetCategoryOptionQuery,
} from '@/lib/features/api';
import { useProductForm } from './form';
import { Variant } from './section/Variant';

interface Image {
  id: number;
  url: string;
}

export default function CreateProductForm() {
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const { data: storeData, isLoading } = useGetStoresQuery();
  const [fetchCategory, { isFetchingdata, data }] = useLazyGetCategoryOptionQuery();

  const form = useProductForm();

  useEffect(() => {
    if (form.values.storeId) {
      fetchCategory({ storeId: Number(form.values.storeId) });
    }
  }, [form.values.storeId]);

  const handleSelectImages = (images: Image[]) => {
    setSelectedImages(images);
    form.setFieldValue(
      'imageIds',
      images.map((img) => img.id)
    );
  };

  return (
    <Stack>
      <TextInput
        label="Product Name"
        {...form.getInputProps('name')}
        withAsterisk
        placeholder="Product name"
      />
      <TextInput label="SKU" {...form.getInputProps('sku')} placeholder="SKU" />
      <TextAreaWithCounter
        label="Description"
        {...form.getInputProps('description')}
        withAsterisk
        placeholder="Description"
      />

      <NumberInput label="Stock" {...form.getInputProps('stock')} placeholder="Stock" />
      <NumberInput
        leftSection="Rp"
        label="Price (Rupiah)"
        placeholder="10,000,000"
        {...form.getInputProps('Price')}
        required
        thousandSeparator
        hideControls
        allowNegative={false}
      />
      <MultiSelect
        label="Categories"
        data={data?.data} // Replace with real categories
        {...form.getInputProps('categories')}
        placeholder="Categories"
      />

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

      <Variant form={form} />
      <ImageUpload
        existingImages={[
          'https://via.placeholder.com/100',
          'https://via.placeholder.com/100/111',
          'https://via.placeholder.com/100/222',
        ]}
        onChange={() => {
          console.log('tes');
        }}
      />
      <Group>
        {selectedImages.map((img) => (
          <img key={img.id} src={img.url} alt="Selected" width={100} />
        ))}
      </Group>

      <Button type="submit">Create Product</Button>
    </Stack>
  );
}
