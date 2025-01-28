import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ApiResponse<T = undefined> {
  code: number;
  message: string;
  status: string;
  data: T;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/v1/', credentials: 'include' }),
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<undefined>, { username: string; password: string }>({
      query: (credentials) => ({
        url: 'auth/signin',
        method: 'POST',
        body: credentials,
      }),
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
    // other endpoints...
  }),
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation } = api;
