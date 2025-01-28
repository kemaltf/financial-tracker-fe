import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { logout } from './authSlice'; // Adjust the import path as necessary

interface ApiResponse<T = undefined> {
  code: number;
  message: string;
  status: string;
  data: T;
}

interface TransactionType {
  value: string;
  label: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/v1/',
  credentials: 'include',
});

const mutex = new Mutex();

const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          { url: 'auth/refresh', method: 'POST', credentials: 'include' },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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
    getTransactionTypes: builder.query<ApiResponse<TransactionType[]>, void>({
      query: () => ({
        url: 'transaction-types',
        method: 'GET',
      }),
      transformResponse: (
        response: ApiResponse<TransactionType[]>
      ): ApiResponse<{ value: string; label: string }[]> => {
        return {
          ...response,
          data: response.data.map((item) => ({
            value: item.value.toString(),
            label: item.label,
          })),
        };
      },
    }),
    // other endpoints...
  }),
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetTransactionTypesQuery,
} = api;
