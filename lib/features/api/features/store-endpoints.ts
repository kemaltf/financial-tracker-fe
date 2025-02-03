import { EndpointBuilder } from '@reduxjs/toolkit/query';
import { notifications } from '@mantine/notifications';
import { notify } from '@/components/notify';
import { SelectType, type ApiResponse } from '../types/common';
import { CreateStoreDto, CreateStoreResponse } from '../types/store';

export const storeEndpoints = (builder: EndpointBuilder<any, never, 'api'>) => ({
  getStore: builder.query<ApiResponse<SelectType[]>, void>({
    query: () => ({
      url: 'stores',
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
  createStore: builder.mutation<ApiResponse<CreateStoreResponse>, CreateStoreDto>({
    query: (store) => ({
      url: 'stores',
      method: 'POST',
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
  }),
});
