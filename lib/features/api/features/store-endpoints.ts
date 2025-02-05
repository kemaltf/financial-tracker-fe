import { ApiTags, BuilderType } from '..';
import { notifications } from '@mantine/notifications';
import { notify } from '@/components/notify';
import { type ApiResponse } from '../types/common';
import {
  CreateStoreDto,
  CreateStoreResponse,
  EditStoreDto,
  GetStoreQueryParams,
  Store,
  StoreTypeWithDescription,
} from '../types/store';

export const storeEndpoints = (builder: BuilderType) => ({
  getStores: builder.query<ApiResponse<StoreTypeWithDescription[]>, void>({
    query: () => ({
      url: 'stores',
      method: 'GET',
    }),
    providesTags: (result) =>
      result
        ? [
            // Menandai setiap store dengan ID
            ...result.data.map(({ value }) => ({
              type: ApiTags.Store, // Gunakan StoreTags.SINGLE daripada 'Store'
              id: value,
            })),
            { type: ApiTags.Store, id: 'LIST' }, // Menandai daftar store secara keseluruhan
          ]
        : [{ type: ApiTags.Store, id: 'LIST' }],
    transformResponse: (
      response: ApiResponse<StoreTypeWithDescription[]>
    ): ApiResponse<StoreTypeWithDescription[]> => {
      return {
        ...response,
        data: response.data.map((item) => ({
          ...item,
          value: item.value.toString(),
        })),
      };
    },
  }),
  createStore: builder.mutation<ApiResponse<CreateStoreResponse>, CreateStoreDto>({
    query: (store) => ({
      url: 'stores',
      method: 'POST',
      body: store,
    }),
    // Menambahkan invalidasi setelah mutasi berhasil
    invalidatesTags: [{ type: ApiTags.Store, id: 'LIST' }], // Invalidate daftar store setelah store baru dibuat
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
  }),
  getStore: builder.query<ApiResponse<Store>, GetStoreQueryParams>({
    query: (transaction) => ({
      url: `stores/${transaction.id}`,
      method: 'GET',
    }),
  }),
  editStore: builder.mutation<ApiResponse<CreateStoreResponse>, EditStoreDto>({
    query: ({ id, ...store }) => ({
      url: `stores/${id}`,
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
    invalidatesTags: (result, error, { id }) => [{ type: ApiTags.Store, id: 'LIST' }],
  }),
  deleteStore: builder.mutation<{ status: string; message: string }, { id: string }>({
    query: ({ id }) => ({
      url: `stores/${id}`,
      method: 'DELETE',
    }),
    // Setelah melakukan update store, invalidate tag yang relevan
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    invalidatesTags: (result, error, { id }) => [{ type: ApiTags.Store, id: 'LIST' }],
  }),
});
