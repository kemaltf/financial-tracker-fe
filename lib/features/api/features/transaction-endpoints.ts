import { ApiTags, BuilderType } from '..';
import { notifications } from '@mantine/notifications';
import { notify } from '@/components/notify';
import { type ApiResponse } from '../types/common';
import type {
  TransactionBalanceSheet,
  TransactionDTO,
  TransactionQueryParams,
  TransactionResponse,
  TransactionSummaryQueryParams,
  TransactionSummaryResponse,
  TransactionTypeWithDescription,
} from '../types/transaction';

export const transactionEndpoints = (builder: BuilderType) => ({
  getFinancialSummary: builder.query<
    ApiResponse<TransactionSummaryResponse>,
    TransactionSummaryQueryParams
  >({
    query: (transaction) => ({
      url: 'transactions/financial-summary',
      method: 'GET',
      params: transaction,
    }),
    providesTags: (result) => [
      { type: ApiTags.Transaction, id: 'FINANCIAL_SUMMARY' }, // Menandai query summary dengan tag 'FINANCIAL_SUMMARY'
    ],
  }),
  getBalanceSheet: builder.query<
    ApiResponse<TransactionBalanceSheet>,
    TransactionSummaryQueryParams
  >({
    query: (transaction) => ({
      url: 'transactions/balance-sheet',
      method: 'GET',
      params: transaction,
    }),
    providesTags: (result) => [
      { type: ApiTags.Transaction, id: 'BALANCE_SHEET' }, // Menandai query summary dengan tag 'FINANCIAL_SUMMARY'
    ],
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
    providesTags: (result) =>
      result
        ? [
            // Menandai setiap transaksi dengan ID atau tag lainnya
            ...result.data.data.map(({ id }) => ({
              type: ApiTags.Transaction, // Menandai dengan type 'Transaction'
              id, // ID transaksi
            })),
            { type: ApiTags.Transaction, id: 'LIST' }, // Menandai daftar transaksi secara keseluruhan
          ]
        : [{ type: ApiTags.Transaction, id: 'LIST' }],
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
        // Gabungkan data lama dengan data baru
        const mergedData = [...currentCache.data.data, ...newItems.data.data];

        // Gunakan Map untuk menghapus duplikasi berdasarkan id
        const uniqueData = Array.from(new Map(mergedData.map((item) => [item.id, item])).values());

        // Urutkan berdasarkan ID dari besar ke kecil
        uniqueData.sort((a, b) => b.id - a.id);

        // Simpan hasil yang sudah di-filter dan diurutkan
        currentCache.data.data = uniqueData;
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
  createTransaction: builder.mutation<ApiResponse<TransactionDTO>, TransactionDTO>({
    query: (transaction) => ({
      url: 'transactions',
      method: 'POST',
      body: transaction,
    }),
    // Invalidasi tag untuk getTransactions dan getFinancialSummary setelah mutasi berhasil
    invalidatesTags: [
      { type: ApiTags.Transaction, id: 'LIST' }, // Untuk getTransactions
      { type: ApiTags.Transaction, id: 'FINANCIAL_SUMMARY' }, // Untuk getFinancialSummary
      { type: ApiTags.Transaction, id: 'BALANCE_SHEET' }, // Untuk getFinancialSummary
    ],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (transaction, { dispatch, queryFulfilled }) => {
      // Show the loading notification when the query is triggered
      notify('loading', 'Creating transaction...');

      try {
        await queryFulfilled; // Await the response of the mutation
        notifications.clean();
        // Invalidate cache getTransactions setelah transaksi berhasil dibuat
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
});
