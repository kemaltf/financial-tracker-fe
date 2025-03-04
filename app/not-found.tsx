import Link from 'next/link';
import { Button, Container, Text, Title } from '@mantine/core';

export default function NotFoundPage() {
  return (
    <Container style={{ textAlign: 'center', paddingTop: '10vh' }}>
      <Title order={1} style={{ fontSize: 60, fontWeight: 700 }}>
        404
      </Title>
      <Text size="lg" c="dimmed" mt="sm">
        Oops! The page you are looking for does not exist.
      </Text>
      <Button component={Link} href="/dashboard" mt="lg" size="md">
        Go back home
      </Button>
    </Container>
  );
}
