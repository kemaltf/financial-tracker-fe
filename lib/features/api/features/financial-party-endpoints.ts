import { ApiTags, BuilderType } from '..';
import { notifications } from '@mantine/notifications';
import { notify } from '@/components/notify';
import { SelectType, type ApiResponse } from '../types/common';
import {
  CreateFinancialPartyDTO,
  EditFinancialPartyDTO,
  GetFinancialPartyQueryParams,
  type FinancialPartyResponse,
} from '../types/financial-party';

export const financialPartyEndpoints = (builder: BuilderType) => ({
  getFinancialPartyOpt: builder.query<ApiResponse<SelectType[]>, { role: string }>({
    query: ({ role }) => ({
      url: `financial-party/opt?role=${role}`,
      method: 'GET',
    }),
    transformResponse: (
      response: ApiResponse<SelectType[]>
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
  getFinancialParties: builder.query<ApiResponse<FinancialPartyResponse[]>, { role: string }>({
    query: ({ role }) => ({
      url: `financial-party?role=${role}`,
      method: 'GET',
    }),
    providesTags: (result) =>
      result
        ? [
            ...result.data.map(({ id }) => ({
              type: ApiTags.FinancialParty,
              id,
            })),
            { type: ApiTags.FinancialParty, id: 'LIST' },
          ]
        : [{ type: ApiTags.FinancialParty, id: 'LIST' }],
  }),
  deleteFinancialParty: builder.mutation<{ status: string; message: string }, { id: string }>({
    query: ({ id }) => ({
      url: `financial-party/${id}`,
      method: 'DELETE',
    }),
    // Setelah melakukan update store, invalidate tag yang relevan
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    invalidatesTags: (result, error, { id }) => [{ type: ApiTags.FinancialParty, id: 'LIST' }],
  }),
  createFinancialParty: builder.mutation<
    ApiResponse<FinancialPartyResponse>,
    CreateFinancialPartyDTO
  >({
    query: (financialParty) => ({
      url: 'financial-party',
      method: 'POST',
      body: financialParty,
    }),
    // Menambahkan invalidasi setelah mutasi berhasil
    invalidatesTags: [{ type: ApiTags.FinancialParty, id: 'LIST' }], // Invalidate daftar store setelah store baru dibuat
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (store, { dispatch, queryFulfilled }) => {
      // Show the loading notification when the query is triggered
      notify('loading', 'Creating customer...');

      try {
        await queryFulfilled; // Await the response of the mutation
        notifications.clean();
        // Show the success notification when the store is successfully created
        notify('success', 'Customer created successfully!');
        // Remove the loading notification
        notifications.hide('loading');
      } catch (error) {
        notifications.hide('loading');
        // Show the error notification if the store creation fails
        notify('error', 'Failed to create customer.');
      }
    },
  }),
  getFinancialParty: builder.query<
    ApiResponse<FinancialPartyResponse>,
    GetFinancialPartyQueryParams
  >({
    query: (transaction) => ({
      url: `financial-party/${transaction.id}`,
      method: 'GET',
    }),
  }),
  editFinancialParty: builder.mutation<ApiResponse<FinancialPartyResponse>, EditFinancialPartyDTO>({
    query: ({ id, ...store }) => ({
      url: `financial-party/${id}`,
      method: 'PUT',
      body: store,
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (finacialParty, { dispatch, queryFulfilled }) => {
      // Show the loading notification when the query is triggered
      notify('loading', 'Creating financial party...');

      try {
        await queryFulfilled; // Await the response of the mutation
        notifications.clean();
        notify('success', 'Financial Party created successfully!');
        notifications.hide('loading');
      } catch (error) {
        notifications.hide('loading');
        notify('error', 'Failed to financial party.');
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    invalidatesTags: (result, error, { id }) => [{ type: ApiTags.FinancialParty, id: 'LIST' }],
  }),
});
