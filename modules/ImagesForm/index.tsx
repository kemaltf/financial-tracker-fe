'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Group, Image, SimpleGrid, Text } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useUploadImagesMutation } from '@/lib/features/api';
import { useImageUploadForm } from './form';

const ImageUploadForm = () => {
  const form = useImageUploadForm();
  const [uploadMultipleImages, { isLoading }] = useUploadImagesMutation();
  const [previews, setPreviews] = useState<string[]>([]);
  const router = useRouter();

  const handleDrop = async (files: FileWithPath[]) => {
    const validFiles: FileWithPath[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
      const isPng =
        bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
      const isWebp =
        bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;

      if (file.size > 1048576) {
        errors.push(`${file.name} terlalu besar (maksimal 1MB)`);
      } else if (!isJpeg && !isPng && !isWebp) {
        errors.push(`${file.name} bukan gambar yang valid`);
      } else {
        validFiles.push(file);
      }
    }

    form.setFieldValue('files', validFiles);
    setPreviews(validFiles.map((file) => URL.createObjectURL(file)));

    if (errors.length > 0) {
      form.setErrors({ files: errors.join(', ') });
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    form.values.files.forEach((file) => formData.append('files', file));

    const result = await uploadMultipleImages(formData);
    console.log(result);
    if (result.data?.status === 'success') {
      router.push('/dashboard/products/categories');
      form.reset();
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleUpload)}>
      <Dropzone
        accept={IMAGE_MIME_TYPE}
        onDrop={handleDrop}
        multiple
        maxSize={1048576} // 1MB
      >
        <Text ta="center">Drop images here (JPEG, PNG, WebP, max 1MB)</Text>
      </Dropzone>

      {form.errors.files && <Text c="red">{form.errors.files}</Text>}

      <SimpleGrid cols={{ base: 1, sm: 4 }} mt="md">
        {previews.map((src, index) => (
          <Image key={index} src={src} onLoad={() => URL.revokeObjectURL(src)} />
        ))}
      </SimpleGrid>

      <Group p="right" mt="md">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload'}
        </Button>
      </Group>
    </form>
  );
};

export default ImageUploadForm;
