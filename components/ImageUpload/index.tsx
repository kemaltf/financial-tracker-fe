'use client';

import { closestCenter, DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IconPlus, IconUpload } from '@tabler/icons-react';
import { Button, Grid, Group, Stack, Text } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { ImageFileSchemaType } from '@/modules/ProductForm/form';
import { SortableItem } from './SortableItem';

interface ImageUploadProps {
  onChange?: (images: ImageFileSchemaType[]) => void;
  maxImages?: number;
  value?: ImageFileSchemaType[];
  error?: string;
  onClick?: () => void;
  predefinedBoxes?: boolean;
  label?: string;
  disabled?: boolean;
  gridColSetting?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

export function ImageUpload({
  onChange,
  maxImages = 5,
  value = [],
  error,
  onClick,
  predefinedBoxes = false,
  label = '',
  disabled = false,
  gridColSetting = { base: 6, sm: 3, md: 2, lg: 2 }, // ✅ Bisa dikirim dari props
}: ImageUploadProps) {
  const handleDrop = (files: FileWithPath[]) => {
    if (disabled) {
      return;
    } // Blokir jika disabled

    const newFiles = files
      .slice(0, maxImages - value.length) // Batasi jumlah agar tidak melebihi maxImages
      .map((file) => ({
        file,
        source: 'upload' as const,
        url: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }));

    onChange?.([...value, ...newFiles].slice(0, maxImages)); // Tambahkan file baru ke daftar
  };

  const handleDelete = (index: number) => {
    if (disabled) {
      return;
    }
    const updatedFiles = [...value];
    updatedFiles.splice(index, 1);
    onChange?.(updatedFiles);
  };

  const handleDragEnd = (event: any) => {
    if (disabled) {
      return;
    }
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = value.findIndex((file) => file.id.toString() === active.id);
      const newIndex = value.findIndex((file) => file.id.toString() === over.id);
      const reordered = arrayMove(value, oldIndex, newIndex);
      onChange?.(reordered);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={value.map((file) => file.id.toString())}
        strategy={verticalListSortingStrategy}
      >
        <Stack p={0} m={0} gap="sm" h="100%" w="100%">
          {label && (
            <Text fw={500} fz="sm">
              {label}
            </Text>
          )}
          <Grid justify="start" align="stretch" gutter="md" pt={0} w="100%" h="100%">
            {Array.from({ length: maxImages }).map((_, index) => (
              <Grid.Col
                key={index}
                span={gridColSetting}
                style={{ aspectRatio: '1 / 1' }}
                w="100%"
                h="100%"
              >
                {value[index] ? (
                  <SortableItem
                    id={value[index].id.toString()} // ✅ ID tetap unik
                    src={
                      value[index].source === 'upload'
                        ? URL.createObjectURL(value[index].file!)
                        : value[index].url
                    } // ✅ Bedakan upload & select
                    index={index}
                    onDelete={handleDelete}
                  />
                ) : (
                  <Dropzone
                    h="100%"
                    w="100%"
                    display="flex"
                    onDrop={(files) => handleDrop(files)}
                    accept={['image/*']}
                    disabled={disabled} // ✅ Nonaktifkan upload jika disabled
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: '1 1 auto',
                      opacity: disabled ? 0.5 : 1, // ✅ Tambahkan efek visual
                      cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
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
                  disabled={disabled} // ✅ Nonaktifkan upload jika disabled
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
  );
}
