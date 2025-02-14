'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Container, Image, Paper, rem } from '@mantine/core';

export function SortableItem({
  id,
  src,
  index,
  onDelete,
}: {
  id: string;
  src: string;
  index: number;
  disabled?: boolean; // ✅ Tambahkan prop disabled

  onDelete: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Paper
      ref={setNodeRef}
      p={0}
      pos="relative"
      withBorder
      radius="md"
      style={{
        ...style,
        overflow: 'hidden',
        width: '100%', // Full width
        aspectRatio: '1 / 1', // Menjaga rasio 1:1
        position: 'relative',
      }}
    >
      {/* Grip area yang memenuhi seluruh Paper */}
      <Container
        variant="subtle"
        p={0}
        style={{
          position: 'absolute',
          inset: 0, // Memenuhi seluruh area Paper
          top: 0,
          left: 0,
          right: 0,
          cursor: 'grab',
          zIndex: 1, // Lebih kecil dari tombol delete
          display: 'flex',
          alignItems: 'flex-start', // Posisi di atas
          justifyContent: 'flex-start', // Posisi di kiri
          backgroundColor: 'rgba(0, 0, 0, 0.05)', // Transparan untuk indikasi drag area
        }}
        {...attributes}
        {...listeners}
      >
        <IconGripVertical size={16} />
      </Container>

      <Image src={src} radius="md" w="100%" h="100%" fit="cover" />

      {/* Tombol delete tetap di atas */}
      <ActionIcon
        size="sm"
        color="red"
        radius="xl"
        style={{
          position: 'absolute',
          top: rem(5),
          right: rem(5),
          zIndex: 2, // Lebih tinggi dari grip area
        }}
        onClick={() => onDelete(index)}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </Paper>
  );
}
