import { EndpointBuilder } from '@reduxjs/toolkit/query';
import { formatExchage } from '@/utils/helpers';
import { type ApiResponse } from '../types/common';
import type { ProductQueryParams, ProductResponse } from '../types/product';

export const productEndpoints = (builder: EndpointBuilder<any, never, 'api'>) => ({
  getProducts: builder.query<ApiResponse<ProductResponse>, ProductQueryParams>({
    query: ({ page, limit, sortBy, sortDirection, storeId, filters }) => ({
      url: 'products',
      method: 'GET',
      params: {
        page,
        limit,
        sortBy,
        sortDirection,
        storeId,
        ...filters,
      },
    }),
    transformResponse: (response: ApiResponse<ProductResponse>): ApiResponse<ProductResponse> => {
      return {
        ...response,
        data: {
          ...response.data,
          data: response.data.data.map((item) => ({
            ...item,
            value: item.value.toString(),
            label: `${item.label} - ${item.sku} - ${formatExchage(item.price, 'id-ID')}`,
          })),
        },
      };
    },
  }),
});
