'use client';

import { IconArticle, IconRuler, IconTrash, IconTypeface } from '@tabler/icons-react';
import { Button, Flex, Image, ScrollArea, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useDeleteImageMutation } from '@/lib/features/api';
import { ImageType } from '@/lib/features/api/types/images';
import { formatBytes } from '@/utils/helpers';

export const ImageDetailModal = ({ image }: { image: ImageType }) => {
  const [deleteImage] = useDeleteImageMutation();

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: 'Confirm Delete',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this image?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteImage({ id: image.id.toString() });
      },
    });
  };

  return (
    <Stack>
      <Stack>
        <Image
          src={image.url}
          alt={image.key}
          radius="md"
          style={{ maxHeight: '400px', width: 'auto', objectFit: 'contain' }}
        />
      </Stack>
      <Flex justify="end">
        <Button
          variant="outline"
          color="red"
          leftSection={<IconTrash size={10} />}
          onClick={openDeleteModal} // Buka modal konfirmasi delete
          h={32}
        >
          <Text size="sm">Delete</Text>
        </Button>
      </Flex>
      <Stack>
        <Stack gap="4px">
          <Flex align="center" gap="5px">
            <IconArticle color="gray" size="20px" />
            <Text size="xs" c="gray">
              {image.key}
            </Text>
          </Flex>
          <Flex align="center" gap="5px">
            <IconTypeface color="gray" size="20px" />
            <Text size="xs" c="gray">
              {image.mimeType}
            </Text>
          </Flex>
          <Flex align="center" gap="5px">
            <IconRuler color="gray" size="20px" />
            <Text size="xs" c="gray">
              {formatBytes(image.size)}
            </Text>
          </Flex>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const openImageDetailModal = (image: ImageType) => {
  modals.open({
    title: 'Image Details',
    centered: true,
    size: '90%',
    children: <ImageDetailModal image={image} />,
    scrollAreaComponent: ScrollArea.Autosize,
  });
};
