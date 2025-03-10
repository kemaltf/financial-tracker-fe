import { api } from '..';
import { API_URL, ApiTags } from '../constants';
import { handleQueryNotification } from '../helpers';
import { type ApiResponse } from '../types/common';
import { Courier, CreateCourierDto, GetCourierQueryParams } from '../types/courier';

export const courierEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getCouriers: builder.query<
      ApiResponse<
        {
          value: string;
          label: string;
          code: string;
          service: string[];
        }[]
      >,
      GetCourierQueryParams
    >({
      query: ({ id }) => ({
        url: `${API_URL.COURIER}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<Courier[]>) => {
        return {
          ...response,
          data: response.data.map((item) => ({
            value: item.value.toString(),
            label: item.label,
            code: item.code,
            service: item.service,
          })),
        };
      },
      providesTags: (result) =>
        result
          ? [
              // Menandai setiap store dengan ID
              ...result.data.map(({ value }) => ({
                type: ApiTags.Courier,
                value,
              })),
              { type: ApiTags.Courier, id: 'LIST' },
            ]
          : [{ type: ApiTags.Courier, id: 'LIST' }],
    }),
    getCouriersList: builder.query<
      ApiResponse<
        {
          label: string;
          code: string;
          services: string[];
        }[]
      >,
      void
    >({
      query: () => ({
        url: API_URL.COURIER,
        method: 'GET',
      }),
    }),

    toggleCourier: builder.mutation<ApiResponse<Courier>, CreateCourierDto>({
      query: ({ storeId, courierCode, action, service }) => ({
        url: `${API_URL.COURIER}/${storeId}/${courierCode}`,
        method: 'PUT',
        body: { action, service },
      }),
      invalidatesTags: [{ type: ApiTags.Courier, id: 'LIST' }],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onQueryStarted: async (store, { dispatch, queryFulfilled }) => {
        await handleQueryNotification('Creating courier', queryFulfilled);
      },
    }),
  }),
});

export const { useToggleCourierMutation, useLazyGetCouriersQuery, useGetCouriersListQuery } =
  courierEndpoints;
