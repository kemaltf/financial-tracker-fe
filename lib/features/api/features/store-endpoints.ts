import { EndpointBuilder } from '@reduxjs/toolkit/query';
import { SelectType, type ApiResponse } from '../types/common';

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
});
