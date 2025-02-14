'use client';

import { useEffect, useState } from 'react';
import { Button, Container, Grid, Image, Stack, Title } from '@mantine/core';
import { useGetImagesQuery } from '@/lib/features/api';
import { ImageType } from '@/lib/features/api/types/images';

import './galleryStyles.css'; // CSS Module

import { GalleryImageSkeleton } from './GalleryImageSelector';

type GalleryImageSelectorProps = {
  value?: number[]; // List ID gambar yang dipilih dari parent
  onChange?: (selectedIds: number[]) => void; // Callback update ke parent
  onClose: () => void;
};

export function GalleryImageSelector({ value = [], onChange, onClose }: GalleryImageSelectorProps) {
  const { data, isLoading } = useGetImagesQuery();
  const images = data?.data.images;

  // ✅ State lokal untuk menyimpan selected images dalam modal
  const [selectedImages, setSelectedImages] = useState<number[]>(value);

  // ✅ Pastikan state lokal ter-update ketika modal dibuka dengan value dari parent
  useEffect(() => {
    setSelectedImages(value);
  }, [value]);

  // ✅ Handle pemilihan gambar (update hanya ke state lokal)
  const handleSelectImage = (imageId: number) => {
    setSelectedImages(
      (prevSelected) =>
        prevSelected.includes(imageId)
          ? prevSelected.filter((id) => id !== imageId) // Hapus jika sudah ada
          : [...prevSelected, imageId] // Tambahkan jika belum ada
    );
  };

  // ✅ Confirm button mengupdate ke parent
  const handleConfirm = () => {
    onChange?.(selectedImages);
    onClose();
  };

  return (
    <Stack p={0} m={0}>
      <Title order={4}>Select Images</Title>

      <Grid gutter="md" justify="center" align="stretch" grow>
        {isLoading ? (
          <GalleryImageSkeleton />
        ) : (
          images?.map((image) => (
            <GalleryImage
              key={image.id}
              image={image}
              isSelected={selectedImages.includes(image.id)}
              onSelect={() => handleSelectImage(image.id)}
            />
          ))
        )}
      </Grid>
      <Button onClick={handleConfirm}>Confirm</Button>
    </Stack>
  );
}

// ✅ Komponen Gambar (tidak berubah)
function GalleryImage({
  image,
  isSelected,
  onSelect,
}: {
  image: ImageType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
      <Container
        p={0}
        onClick={onSelect}
        className={`imageContainer ${isSelected ? 'selected' : ''}`}
      >
        {!isLoaded && <div className="blurPlaceholder" />}
        <Image
          src={image.url}
          alt={image.key}
          radius="md"
          className={`image ${isLoaded ? 'imageLoaded' : ''}`}
          onLoad={() => setIsLoaded(true)}
        />
        {isSelected && <div className="selectedOverlay">✔</div>}
      </Container>
    </Grid.Col>
  );
}
