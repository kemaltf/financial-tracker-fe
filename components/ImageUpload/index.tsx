'use client';

import { useState } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IconPlus, IconUpload } from '@tabler/icons-react';
import { Button, Grid, Group, Image, Modal, rem, SimpleGrid, Stack } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { SortableItem } from './SortableItem';

interface ImageUploadProps {
  existingImages?: string[];
  onChange?: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ existingImages = [], onChange, maxImages = 5 }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [opened, setOpened] = useState(false);

  const handleDrop = (files: FileWithPath[]) => {
    const newImages = files.map((file) => URL.createObjectURL(file));
    const updatedImages = [...images, ...newImages].slice(0, maxImages);
    setImages(updatedImages);
    onChange?.(updatedImages);
  };

  const handleDelete = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange?.(updatedImages);
  };

  const handleSelectExisting = (img: string) => {
    if (images.length < maxImages) {
      const updatedImages = [...images, img];
      setImages(updatedImages);
      onChange?.(updatedImages);
      setOpened(false);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        onChange?.(reordered);
        return reordered;
      });
    }
  };

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images} strategy={verticalListSortingStrategy}>
          <Stack p={0} m={0}>
            <Grid grow justify="center" align="stretch" gutter="md">
              {images.map((src, index) => (
                <Grid.Col key={src} span={{ base: 6, sm: 3, md: 2, lg: 1 }}>
                  <SortableItem id={src} src={src} index={index} onDelete={handleDelete} />
                </Grid.Col>
              ))}

              {images.length < maxImages && (
                <Grid.Col span={{ base: 6, sm: 3, md: 2, lg: 1 }}>
                  <Dropzone
                    onDrop={handleDrop}
                    multiple
                    accept={['image/*']}
                    style={{ width: '100%', height: rem(100) }}
                  >
                    <Group align="center" justify="center" style={{ height: '100%' }}>
                      <IconUpload size={24} />
                    </Group>
                  </Dropzone>
                </Grid.Col>
              )}

              <Grid.Col span={{ base: 6, sm: 3, md: 2, lg: 1 }}>
                <Button
                  variant="light"
                  color="blue"
                  size="xs"
                  radius="md"
                  style={{ width: '100%', height: rem(100) }}
                  onClick={() => setOpened(true)}
                >
                  <IconPlus size={16} />
                  Select Image
                </Button>
              </Grid.Col>
            </Grid>
          </Stack>
        </SortableContext>
      </DndContext>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Select Existing Image">
        <SimpleGrid cols={4} spacing="sm">
          {existingImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              width={80}
              height={80}
              radius="md"
              onClick={() => handleSelectExisting(img)}
              style={{ cursor: 'pointer', border: '1px solid #ddd' }}
            />
          ))}
        </SimpleGrid>
      </Modal>
    </>
  );
}
