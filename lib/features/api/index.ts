import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './base-query';
import { accountEndpoints } from './features/account-endpoints';
import { authEndpoints } from './features/auth-endpoints';
import { customerEndpoints } from './features/customer-endpoints';
import { productEndpoints } from './features/product-endpoints';
import { storeEndpoints } from './features/store-endpoints';
import { transactionEndpoints } from './features/transaction-endpoints';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    ...authEndpoints(builder),
    ...transactionEndpoints(builder),
    ...accountEndpoints(builder),
    ...storeEndpoints(builder),
    ...customerEndpoints(builder),
    ...productEndpoints(builder),
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
  useLazyGetFinancialSummaryQuery,
} = api;
