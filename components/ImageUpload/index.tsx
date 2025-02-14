'use client';

import { closestCenter, DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IconPlus, IconUpload } from '@tabler/icons-react';
import { Button, Grid, Group, Stack, Text } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { SortableItem } from './SortableItem';

interface ImageUploadProps {
  onChange?: (images: string[]) => void;
  maxImages?: number;
  value?: string[];
  error?: string;
  onClick: () => void;
}

export function ImageUpload({
  onChange,
  maxImages = 5,
  value = [],
  error,
  onClick,
}: ImageUploadProps) {
  const handleDrop = (files: FileWithPath[]) => {
    const newImages = files.map((file) => URL.createObjectURL(file));
    const updatedImages = [...value, ...newImages].slice(0, maxImages);
    onChange?.(updatedImages);
  };

  const handleDelete = (index: number) => {
    const updatedImages = value.filter((_, i) => i !== index);
    onChange?.(updatedImages);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = value.indexOf(active.id);
      const newIndex = value.indexOf(over.id);
      const reordered = arrayMove(value, oldIndex, newIndex);
      onChange?.(reordered);
    }
  };

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value} strategy={verticalListSortingStrategy}>
          <Stack p={0} m={0}>
            <Grid grow justify="center" align="stretch" gutter="md">
              {value.map((src, index) => (
                <Grid.Col key={src} span={{ base: 6, sm: 3, md: 2, lg: 1 }}>
                  <SortableItem id={src} src={src} index={index} onDelete={handleDelete} />
                </Grid.Col>
              ))}

              {value.length < maxImages && (
                <Grid.Col span={{ base: 6, sm: 3, md: 2, lg: 1 }}>
                  <Dropzone
                    h="100%"
                    w="100%"
                    display="flex"
                    onDrop={handleDrop}
                    multiple
                    accept={['image/*']}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Group>
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
                  h="100%"
                  w="100%"
                  onClick={onClick}
                >
                  <IconPlus size={16} />
                  Select Image
                </Button>
              </Grid.Col>
            </Grid>
            {/* Tambahkan Error Message di Sini */}
            {error && (
              <Text c="red" size="sm">
                {error}
              </Text>
            )}
          </Stack>
        </SortableContext>
      </DndContext>
    </>
  );
}
