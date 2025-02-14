import { Container, Grid, Skeleton } from '@mantine/core';

export function GalleryImageSkeleton() {
  return Array.from({ length: 12 }).map((_, index) => (
    <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
      <Container p={0}>
        <Skeleton height={200} width="100%" radius="md" />
      </Container>
    </Grid.Col>
  ));
}
