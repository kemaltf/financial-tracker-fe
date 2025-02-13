'use client';

import { useState } from 'react';
import { Container, Grid, Image, Skeleton, Stack, Title } from '@mantine/core';
import { useGetImagesQuery } from '@/lib/features/api';
import { ImageType } from '@/lib/features/api/types/images';
import { openImageDetailModal } from '../Modals/ImageDetailModal';

import './galleryStyles.css'; // Menggunakan CSS Module

export function GalleryImageGrid() {
  const { data, isLoading } = useGetImagesQuery();
  const images = data?.data.images;

  return (
    <Stack p={0} m={0}>
      <Title order={4}>Gallery</Title>

      <Grid gutter="md" justify="center" align="stretch" grow>
        {isLoading ? (
          // Skeleton loader saat loading
          <GalleryImageSkeleton />
        ) : (
          // Menampilkan gambar saat sudah dimuat
          images?.map((image) => <GalleryImage key={image.id} image={image} />)
        )}
      </Grid>
    </Stack>
  );
}

// Komponen terpisah untuk efek loading dan klik
function GalleryImage({ image }: { image: ImageType }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
      <Container p={0} onClick={() => openImageDetailModal(image)} className="imageContainer">
        {/* Blur Hash Placeholder */}
        {!isLoaded && <div className="blurPlaceholder" />}
        <Image
          src={image.url}
          alt={image.key}
          radius="md"
          className={`image ${isLoaded ? 'imageLoaded' : ''}`}
          onLoad={() => setIsLoaded(true)}
        />
      </Container>
    </Grid.Col>
  );
}

function GalleryImageSkeleton() {
  return Array.from({ length: 12 }).map((_, index) => (
    <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
      <Container p={0}>
        <Skeleton height={200} width="100%" radius="md" />
      </Container>
    </Grid.Col>
  ));
}
