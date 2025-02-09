import {
  BaseQueryFn,
  createApi,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './base-query';
import { accountEndpoints } from './features/account-endpoints';
import { authEndpoints } from './features/auth-endpoints';
import { categoryEndpoints } from './features/category-endpoints';
import { financialPartyEndpoints } from './features/financial-party-endpoints';
import { productEndpoints } from './features/product-endpoints';
import { storeEndpoints } from './features/store-endpoints';
import { transactionEndpoints } from './features/transaction-endpoints';

export enum ApiTags {
  Store = 'Store',
  Transaction = 'Transaction',
  FinancialParty = 'FinancialParty',
  Account = 'Account',
  Category = 'Category',
}

export type BuilderType = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
  ApiTags,
  'api'
>;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: Object.values(ApiTags), // tagTypes digunakan untuk memberi label atau kategori pada data yang di-fetch dari API.
  endpoints: (builder) => ({
    ...authEndpoints(builder),
    ...transactionEndpoints(builder),
    ...accountEndpoints(builder),
    ...storeEndpoints(builder),
    ...financialPartyEndpoints(builder),
    ...productEndpoints(builder),
    ...categoryEndpoints(builder),
  }),
});

export const {
  // auth
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,

  // transaction
  useGetTransactionTypesQuery,
  useGetFinancialPartyOptQuery,
  useCreateTransactionMutation,
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
  useLazyGetFinancialSummaryQuery,
  useLazyGetBalanceSheetQuery,

  // Account
  useLazyGetAvailableAccountsQuery,
  useGetAccountsQuery,
  useCreateAccountMutation,
  useEditAccountMutation,
  useLazyGetAccountQuery,
  useDeleteAccountMutation,

  // Store
  useGetStoresQuery,
  useCreateStoreMutation,

  // product
  useGetProductsQuery,
  useLazyGetStoreQuery,
  useEditStoreMutation,
  useDeleteStoreMutation,

  // financial party
  useGetFinancialPartiesQuery,
  useDeleteFinancialPartyMutation,
  useCreateFinancialPartyMutation,
  useLazyGetFinancialPartyQuery,
  useEditFinancialPartyMutation,

  // category
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
  useLazyGetCategoryQuery,
  useEditCategoryMutation,
} = api;
