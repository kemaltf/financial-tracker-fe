'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { Box, Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useLoginMutation } from '../../lib/features/api';
import { setCredentials } from '../../lib/features/authSlice';

const schema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  password: z.string().min(6, { message: 'Password should have at least 6 characters' }),
});

const Login = () => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const user = await login(values).unwrap();
      console.log(user);
      if (user.code !== 200) {
        console.error('Failed to login:', user.message);
        return;
      }
      console.log('Logged in redirecting to home page');
      router.push('/'); // Redirect to home page
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Username"
          placeholder="yourusername"
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
        <Button type="submit" fullWidth mt="xl" loading={isLoading}>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
