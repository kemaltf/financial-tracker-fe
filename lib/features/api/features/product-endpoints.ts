import { ApiTags, BuilderType } from '..';
import { formatExchage } from '@/utils/helpers';
import { API_URL } from '../constants';
import { handleQueryNotification } from '../helpers';
import { type ApiResponse } from '../types/common';
import type {
  CreateProductDto,
  CreateProductResponse,
  ProductQueryParams,
  ProductResponse,
} from '../types/product';

export const productEndpoints = (builder: BuilderType) => ({
  getProductsOption: builder.query<ApiResponse<ProductResponse>, ProductQueryParams>({
    query: ({ page, limit, sortBy, sortDirection, storeId, filters }) => ({
      url: 'products/opt',
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
  createStore: builder.mutation<ApiResponse<CreateProductResponse>, CreateProductDto>({
    query: (store) => ({
      url: API_URL.PRODUCT,
      method: 'POST',
      body: store,
    }),
    // Menambahkan invalidasi setelah mutasi berhasil
    invalidatesTags: [{ type: ApiTags.Produt, id: 'LIST' }], // Invalidate daftar store setelah store baru dibuat
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (store, { dispatch, queryFulfilled }) => {
      await handleQueryNotification('Creating product', queryFulfilled);
    },
  }),
});
