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
import { imagesEndpoints } from './features/image-endpoints';
import { productEndpoints } from './features/product-endpoints';
import { storeEndpoints } from './features/store-endpoints';
import { transactionEndpoints } from './features/transaction-endpoints';
import { variantTypeEndpoints } from './features/variant-type-endpoints';

export enum ApiTags {
  Store = 'Store',
  Transaction = 'Transaction',
  FinancialParty = 'FinancialParty',
  Account = 'Account',
  Category = 'Category',
  VariantType = 'VariantType',
  Image = 'Image',
  Produt = 'Product',
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
    ...variantTypeEndpoints(builder),
    ...imagesEndpoints(builder),
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
  useGetProductsOptionQuery,
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
  useLazyGetCategoryOptionQuery,

  // variant type
  useGetVariantTypesQuery,
  useDeleteVariantTypeMutation,
  useCreateVariantTypeMutation,
  useLazyGetVariantTypeQuery,
  useLazyGetVariantTypesQuery,
  useEditVariantTypeMutation,

  // IMAGES
  useGetImagesQuery,
  useDeleteImageMutation,
  useUploadImagesMutation,
  useLazyGetImageQuery,
} = api;
