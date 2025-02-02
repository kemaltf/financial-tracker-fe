'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useLoginMutation } from '../../lib/features/api';

const schema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  password: z.string().min(6, { message: 'Password should have at least 6 characters' }),
  rememberMe: z.boolean(), // Tambahkan rememberMe sebagai boolean yang bersifat opsional
});

export type LoginFormValues = z.infer<typeof schema>;

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    validate: zodResolver(schema),
    initialValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const user = await login(values).unwrap();
    if (user.code !== 200) {
      console.error('Failed to login:', user.message);
      return;
    }
    router.push('/dashboard'); // Redirect to home page
  };

  return (
    <Center h="100vh" bg="var(--mantine-color-gray-light)">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Container size={420}>
          <Title ta="center" fw={900} ff="">
            Welcome back!
          </Title>
          <Text c="gray" size="sm" ta="center" mt={5}>
            Do not have an account yet?{' '}
            <Anchor<'a'> href="#" size="sm" onClick={(event) => event.preventDefault()}>
              Create account
            </Anchor>
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              label="Username"
              placeholder="johndoe"
              {...form.getInputProps('username')}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              {...form.getInputProps('password')}
              required
              mt="md"
            />
            <Group p="apart" mt="md">
              <Checkbox label="Remember me" {...form.getInputProps('rememberMe')} />
            </Group>
            <Button type="submit" fullWidth mt="md" loading={isLoading}>
              Login
            </Button>
          </Paper>
        </Container>
      </form>
    </Center>
  );
};

export default Login;
