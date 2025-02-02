import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { notifications } from '@mantine/notifications';
import { notify } from '@/components/notify';
import { formatRupiah } from '@/utils/helpers';

interface ApiResponse<T = undefined> {
  code: number;
  message: string;
  status: string;
  data: T;
}

export interface TransactionType {
  value: string;
  label: string;
}

export interface TransactionTypeWithDescription extends TransactionType {
  description: string;
}
export interface Customer {
  value: string;
  label: string;
}

export interface AccountOption {
  value: string;
  label: string;
}

interface AvailableAccounts {
  debitAccounts: AccountOption[];
  creditAccounts: AccountOption[];
}

interface AddressDTO {
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
}

interface OrderDTO {
  productId: number;
  quantity: number;
}

export interface TransactionDTO {
  transactionTypeId: number;
  amount: number;
  note?: string;
  debitAccountId: number;
  creditAccountId: number;
  customerId?: number;
  debtorId?: number;
  creditorId?: number;
  storeId?: number;
  dueDate?: Date;
  address?: AddressDTO;
  orders?: OrderDTO[];
}

export interface Product {
  value: string;
  label: string;
  sku: string;
  description: string;
  stock: number;
  price: number;
  image?: string;
  id: number;
}

interface ProductResponse {
  data: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
}

interface ProductQueryParams {
  page: number;
  limit: number;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
  storeId: number;
  filters?: {
    name?: string;
    sku?: string;
  };
}

export interface Transaction {
  id: number;
  note: string;
  createdAt: string;
  transactionType: string;
  amount: number;
  store: string;
  user: string;
  debit: {
    code: string;
    account: string;
    balance: number;
  };
  credit: {
    code: string;
    account: string;
    balance: number;
  };
}

export interface TransactionQueryParams {
  startMonth: string;
  endMonth: string;
  limit: number;
  page: number;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
}

interface TransactionResponse {
  data: Transaction[];
  total: number;
  currentPage: number;
  totalPages: number;
  filter: { startMonth: string; endMonth: string };
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
        // Try to refresh the token
        const refreshResult = await baseQuery(
          { url: 'auth/refresh', method: 'POST', credentials: 'include' },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          // Store the new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // If refresh token fails, remove existing cookies
          // If refresh token fails, remove existing cookies
          await baseQuery(
            { url: 'auth/logout', method: 'POST', credentials: 'include' },
            api,
            extraOptions
          );
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
    getTransactionTypes: builder.query<ApiResponse<TransactionTypeWithDescription[]>, void>({
      query: () => ({
        url: 'transaction-types',
        method: 'GET',
      }),
      transformResponse: (
        response: ApiResponse<TransactionTypeWithDescription[]>
      ): ApiResponse<{ value: string; label: string; description: string }[]> => {
        return {
          ...response,
          data: response.data.map((item) => ({
            value: item.value.toString(),
            label: item.label,
            description: item.description,
          })),
        };
      },
    }),
    getStore: builder.query<ApiResponse<TransactionType[]>, void>({
      query: () => ({
        url: 'stores',
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
    getCustomers: builder.query<ApiResponse<Customer[]>, { role: string }>({
      query: ({ role }) => ({
        url: `financial-party?role=${role}`,
        method: 'GET',
      }),
      transformResponse: (
        response: ApiResponse<Customer[]>
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
    getAvailableAccounts: builder.query<ApiResponse<AvailableAccounts>, number>({
      query: (id) => ({
        url: `accounts/options/${id}`,
        method: 'GET',
      }),
      transformResponse: (
        response: ApiResponse<AvailableAccounts>
      ): ApiResponse<AvailableAccounts> => {
        return {
          ...response,
          data: {
            debitAccounts: response.data.debitAccounts.map((item) => ({
              value: item.value.toString(),
              label: item.label,
            })),
            creditAccounts: response.data.creditAccounts.map((item) => ({
              value: item.value.toString(),
              label: item.label,
            })),
          },
        };
      },
    }),
    createTransaction: builder.mutation<ApiResponse<TransactionDTO>, TransactionDTO>({
      query: (transaction) => ({
        url: 'transactions',
        method: 'POST',
        body: transaction,
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onQueryStarted: async (transaction, { dispatch, queryFulfilled }) => {
        // Show the loading notification when the query is triggered
        notify('loading', 'Creating transaction...');

        try {
          await queryFulfilled; // Await the response of the mutation
          notifications.clean();
          // Show the success notification when the transaction is successfully created
          notify('success', 'Transaction created successfully!');
          // Remove the loading notification
          notifications.hide('loading');
        } catch (error) {
          notifications.hide('loading');
          // Show the error notification if the transaction creation fails
          notify('error', 'Failed to create transaction.');
        }
      },
    }),

    getProducts: builder.query<ApiResponse<ProductResponse>, ProductQueryParams>({
      query: ({ page, limit, sortBy, sortDirection, storeId, filters }) => ({
        url: 'products',
        method: 'GET',
        params: {
          page,
          limit,
          sortBy,
          sortDirection,
          storeId,
          ...filters,
        },
      }),
      transformResponse: (response: ApiResponse<ProductResponse>): ApiResponse<ProductResponse> => {
        return {
          ...response,
          data: {
            ...response.data,
            data: response.data.data.map((item) => ({
              ...item,
              value: item.value.toString(),
              label: `${item.label} - ${item.sku} - ${formatRupiah(item.price, 'id-ID')}`,
            })),
          },
        };
      },
    }),
    getTransactions: builder.query<ApiResponse<TransactionResponse>, TransactionQueryParams>({
      query: ({ startMonth, endMonth, limit, page, sortBy, sortDirection }) => ({
        url: 'transactions',
        method: 'GET',
        params: {
          startMonth,
          endMonth,
          limit,
          page,
          sortBy,
          sortDirection,
        },
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        // Jika bulan berubah, timpa seluruh data
        if (
          currentCache?.data.filter.startMonth !== arg.startMonth ||
          currentCache?.data.filter.endMonth !== arg.endMonth
        ) {
          currentCache.data = newItems.data;
        } else {
          // Jika bulan sama, tambahkan data baru
          currentCache.data.data.push(...newItems.data.data);
        }
        currentCache.data.totalPages = newItems.data.totalPages;
        currentCache.data.currentPage = newItems.data.currentPage;
      },

      transformResponse: (
        response: ApiResponse<TransactionResponse>
      ): ApiResponse<TransactionResponse> => {
        return response;
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
  useGetCustomersQuery,
  useLazyGetAvailableAccountsQuery,
  useGetStoreQuery,
  useCreateTransactionMutation,
  useGetProductsQuery,
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
} = api;
