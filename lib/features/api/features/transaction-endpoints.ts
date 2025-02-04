import { EndpointBuilder } from '@reduxjs/toolkit/query';
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

export const transactionEndpoints = (builder: EndpointBuilder<any, never, 'api'>) => ({
  getFinancialSummary: builder.query<
    ApiResponse<TransactionSummaryResponse>,
    TransactionSummaryQueryParams
  >({
    query: (transaction) => ({
      url: 'transactions/financial-summary',
      method: 'GET',
      params: transaction,
    }),
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
});
