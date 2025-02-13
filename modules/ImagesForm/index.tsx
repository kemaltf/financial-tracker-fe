'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconPhoto, IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import { ActionIcon, Button, Flex, Group, Image, SimpleGrid, Text } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { useUploadImagesMutation } from '@/lib/features/api';
import { useImageUploadForm } from './form';

const ImageUploadForm = () => {
  const form = useImageUploadForm();
  const [uploadMultipleImages, { isLoading }] = useUploadImagesMutation();
  const [previews, setPreviews] = useState<{ url: string; file: FileWithPath }[]>([]);
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

    form.setFieldValue('files', [...form.values.files, ...validFiles]);
    setPreviews((prev) => [
      ...prev,
      ...validFiles.map((file) => ({ url: URL.createObjectURL(file), file })),
    ]);

    if (errors.length > 0) {
      form.setErrors({ files: errors.join(', ') });
    }
  };

  const handleDeleteImage = (index: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });

    form.setFieldValue(
      'files',
      form.values.files.filter((_, i) => i !== index)
    );
  };

  const handleUpload = async () => {
    const formData = new FormData();
    form.values.files.forEach((file) => formData.append('files', file));

    const result = await uploadMultipleImages(formData);
    console.log(result);
    if (result.data?.status === 'success') {
      router.push('/dashboard/images');
      form.reset();
      setPreviews([]); // Reset preview setelah upload berhasil
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
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 1MB
            </Text>
          </div>
        </Group>
      </Dropzone>

      {form.errors.files && <Text c="red">{form.errors.files}</Text>}

      <SimpleGrid cols={{ base: 1, sm: 4 }} mt="md">
        {previews.map((preview, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <Image src={preview.url} onLoad={() => URL.revokeObjectURL(preview.url)} />
            <ActionIcon
              color="red"
              variant="filled"
              size="sm"
              style={{ position: 'absolute', top: 5, right: 5 }}
              onClick={() => handleDeleteImage(index)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </div>
        ))}
      </SimpleGrid>

      <Flex justify="center" mt="md">
        <Button type="submit" disabled={isLoading || previews.length === 0}>
          {isLoading ? 'Uploading...' : 'Upload'}
        </Button>
      </Flex>
    </form>
  );
};

export default ImageUploadForm;
