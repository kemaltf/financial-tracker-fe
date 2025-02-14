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
  predefinedBoxes?: boolean;
  label?: string;
}

const gridColSetting = { base: 6, sm: 3, md: 2, lg: 2 };
export function ImageUpload({
  onChange,
  maxImages = 5,
  value = [],
  error,
  onClick,
  predefinedBoxes = false,
  label = '',
}: ImageUploadProps) {
  const handleDrop = (files: FileWithPath[], index: number) => {
    const newImages = files.map((file) => URL.createObjectURL(file));
    const updatedImages = [...value];
    updatedImages[index] = newImages[0] || updatedImages[index];
    onChange?.(updatedImages.slice(0, maxImages));
  };

  const handleDelete = (index: number) => {
    const updatedImages = [...value];
    updatedImages.splice(index, 1);
    onChange?.(updatedImages.filter(Boolean));
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
          <Stack p={0} m={0} gap="sm">
            <Text fw={500} fz="sm">
              {label}
            </Text>
            <Grid justify="start" align="stretch" gutter="md" pt={0}>
              {Array.from({ length: maxImages }).map((_, index) => (
                <Grid.Col key={index} span={gridColSetting} style={{ aspectRatio: '1 / 1' }}>
                  {value[index] ? (
                    <SortableItem
                      id={value[index]}
                      src={value[index]}
                      index={index}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <Dropzone
                      h="100%"
                      w="100%"
                      display="flex"
                      onDrop={(files) => handleDrop(files, index)}
                      accept={['image/*']}
                      style={{ justifyContent: 'center', alignItems: 'center', flex: '1 1 auto' }}
                    >
                      <Group>
                        <IconUpload size={24} />
                      </Group>
                    </Dropzone>
                  )}
                </Grid.Col>
              ))}
              {!predefinedBoxes && value.length < maxImages && (
                <Grid.Col span={gridColSetting} style={{ aspectRatio: '1 / 1' }}>
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
                  </Button>
                </Grid.Col>
              )}
            </Grid>
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
