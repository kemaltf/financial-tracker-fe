'use client';

import { useEffect, useState } from 'react';
import { Button, Container, Grid, Image, Stack, Title } from '@mantine/core';
import { useGetImagesQuery } from '@/lib/features/api';
import { ImageType } from '@/lib/features/api/types/images';

import './galleryStyles.css'; // CSS Module

import { ImageFileSchemaType } from '@/modules/ProductForm/form';
import { GalleryImageSkeleton } from './GalleryImageSelector';

type GalleryImageSelectorProps = {
  value?: ImageFileSchemaType[];
  onChange?: (selectedImages: ImageFileSchemaType[]) => void;
  onClose: () => void;
  storeId: number;
};

export function GalleryImageSelector({
  value = [],
  onChange,
  onClose,
  storeId,
}: GalleryImageSelectorProps) {
  const { data, isLoading } = useGetImagesQuery({
    storeId,
  });
  const images = data?.data.images;

  // ✅ State lokal menyimpan objek gambar
  const [selectedImages, setSelectedImages] = useState<ImageFileSchemaType[]>(value);

  // ✅ Update state ketika modal dibuka kembali
  useEffect(() => {
    setSelectedImages(value);
  }, [value]);

  // ✅ Handle pemilihan gambar
  const handleSelectImage = (image: ImageType) => {
    setSelectedImages((prevSelected) => {
      const exists = prevSelected.some((img) => img.id === image.id);
      return exists
        ? prevSelected.filter((img) => img.id !== image.id) // Hapus jika sudah ada
        : [
            ...prevSelected,
            {
              id: image.id,
              file: null, // ✅ Tidak ada file karena dari server
              url: image.url, // ✅ URL dari server
              source: 'select', // ✅ Pastikan `source` adalah `select`
            },
          ];
    });
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
              isSelected={selectedImages.some((img) => img.id === image.id)}
              onSelect={() => handleSelectImage(image)}
            />
          ))
        )}
      </Grid>
      <Button onClick={handleConfirm}>Confirm</Button>
    </Stack>
  );
}

// ✅ Komponen Gambar
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
