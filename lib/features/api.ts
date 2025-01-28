import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/v1/' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
    // other endpoints...
  }),
});

export const { useLoginMutation } = api;
