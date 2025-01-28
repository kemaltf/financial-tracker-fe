'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { Box, Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useLoginMutation } from '../../lib/features/api';
import { setCredentials } from '../../lib/features/authSlice';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password should have at least 6 characters' }),
});

const Login = () => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const user = await login(values).unwrap();
      dispatch(setCredentials(user));
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          {...form.getInputProps('email')}
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
