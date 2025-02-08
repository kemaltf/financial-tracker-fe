import { ApiTags, BuilderType } from '..';
import { notifications } from '@mantine/notifications';
import { notify } from '@/components/notify';
import type {
  Account,
  AvailableAccounts,
  CreateAccountDto,
  CreateAccountResponse,
  EditAccountDto,
  GetAccountQueryParams,
} from '../types/account';
import type { ApiResponse } from '../types/common';

export const accountEndpoints = (builder: BuilderType) => ({
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
  getAccounts: builder.query<ApiResponse<Account[]>, void>({
    query: () => ({
      url: 'accounts',
      method: 'GET',
    }),
    providesTags: (result) =>
      result
        ? [
            // Menandai setiap account dengan ID
            ...result.data.map(({ id }) => ({
              type: ApiTags.Account,
              id,
            })),
            { type: ApiTags.Account, id: 'LIST' }, // Menandai daftar account secara keseluruhan
          ]
        : [{ type: ApiTags.Account, id: 'LIST' }],
    transformResponse: (response: ApiResponse<Account[]>): ApiResponse<Account[]> => {
      return response;
    },
  }),
  createAccount: builder.mutation<ApiResponse<CreateAccountResponse>, CreateAccountDto>({
    query: (account) => ({
      url: 'accounts',
      method: 'POST',
      body: account,
    }),
    // Menambahkan invalidasi setelah mutasi berhasil
    invalidatesTags: [{ type: ApiTags.Account, id: 'LIST' }], // Invalidate daftar account setelah account baru dibuat
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (account, { dispatch, queryFulfilled }) => {
      // Show the loading notification when the query is triggered
      notify('loading', 'Creating account...');

      try {
        await queryFulfilled; // Await the response of the mutation
        notifications.clean();
        // Show the success notification when the account is successfully created
        notify('success', 'account created successfully!');
        // Remove the loading notification
        notifications.hide('loading');
      } catch (error) {
        notifications.hide('loading');
        // Show the error notification if the account creation fails
        notify('error', 'Failed to create account.');
      }
    },
  }),
  editAccount: builder.mutation<ApiResponse<CreateAccountResponse>, EditAccountDto>({
    query: ({ id, ...store }) => ({
      url: `accounts/${id}`,
      method: 'PUT',
      body: store,
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (store, { dispatch, queryFulfilled }) => {
      // Show the loading notification when the query is triggered
      notify('loading', 'Creating store...');

      try {
        await queryFulfilled; // Await the response of the mutation
        notifications.clean();
        // Show the success notification when the store is successfully created
        notify('success', 'Store created successfully!');
        // Remove the loading notification
        notifications.hide('loading');
      } catch (error) {
        notifications.hide('loading');
        // Show the error notification if the store creation fails
        notify('error', 'Failed to create store.');
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    invalidatesTags: (result, error, { id }) => [{ type: ApiTags.Account, id: 'LIST' }],
  }),
  getAccount: builder.query<ApiResponse<Account>, GetAccountQueryParams>({
    query: (account) => ({
      url: `accounts/${account.id}`,
      method: 'GET',
    }),
  }),
  deleteAccount: builder.mutation<{ status: string; message: string }, { id: string }>({
    query: ({ id }) => ({
      url: `accounts/${id}`,
      method: 'DELETE',
    }),
    // Setelah melakukan update store, invalidate tag yang relevan
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    invalidatesTags: (result, error, { id }) => [{ type: ApiTags.Account, id: 'LIST' }],
  }),
});
