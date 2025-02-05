import { BuilderType } from '..';
import { notifications } from '@mantine/notifications';
import { notify } from '@/components/notify';
import { type ApiResponse } from '../types/common';

export const authEndpoints = (builder: BuilderType) => ({
  login: builder.mutation<
    ApiResponse<undefined>,
    { username: string; password: string; rememberMe: boolean | undefined }
  >({
    query: (credentials) => ({
      url: 'auth/signin',
      method: 'POST',
      body: credentials,
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
      // Menampilkan notifikasi loading saat login dimulai
      notify('loading', 'Logging in...');

      try {
        await queryFulfilled; // Menunggu hasil login
        notifications.clean();
        // Jika berhasil, tampilkan notifikasi sukses
        notify('success', 'Login successful!');
        // Sembunyikan notifikasi loading
        notifications.hide('loading');
      } catch (error) {
        notifications.hide('loading');
        // Jika gagal, tampilkan notifikasi error
        notify('error', 'Login failed. Please check your credentials.');
      }
    },
  }),
  refresh: builder.mutation<ApiResponse<undefined>, void>({
    query: () => ({
      url: 'auth/refresh',
      method: 'POST',
      credentials: 'include',
    }),
  }),
  logout: builder.mutation<ApiResponse<undefined>, void>({
    query: () => ({
      url: 'auth/logout',
      method: 'POST',
      credentials: 'include',
    }),
  }),
});
