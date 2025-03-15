import { api } from '..';
import { API_URL, ApiTags } from '../constants';
import { handleQueryNotification } from '../helpers';
import { type ApiResponse } from '../types/common';
import {
  CreateProductDiscountRequest,
  EditProductDiscountRequest,
  EventData,
} from '../types/product-discount';

const { PRODUCT_DISCOUNT } = API_URL;
export const productDiscountEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getProductDiscounts: builder.query<ApiResponse<EventData[]>, void>({
      query: () => ({
        url: `${PRODUCT_DISCOUNT}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: ApiTags.ProductDiscount, id })),
              { type: ApiTags.ProductDiscount, id: 'LIST' },
            ]
          : [{ type: ApiTags.ProductDiscount, id: 'LIST' }],
    }),

    getProductDiscount: builder.query<ApiResponse<EventData>, { id: number }>({
      query: ({ id }) => ({
        url: `${PRODUCT_DISCOUNT}/${id}`,
        method: 'GET',
      }),
    }),

    createProductDiscount: builder.mutation<ApiResponse<EventData>, CreateProductDiscountRequest>({
      query: (voucher) => ({
        url: `${PRODUCT_DISCOUNT}`,
        method: 'POST',
        body: voucher,
      }),
      invalidatesTags: [{ type: ApiTags.ProductDiscount, id: 'LIST' }],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onQueryStarted: async (_voucher, { dispatch, queryFulfilled }) => {
        await handleQueryNotification('Creating product discount', queryFulfilled);
      },
    }),

    editProductDiscount: builder.mutation<ApiResponse<EventData>, EditProductDiscountRequest>({
      query: ({ id, ...voucher }) => ({
        url: `${PRODUCT_DISCOUNT}/${id}`,
        method: 'PATCH',
        body: voucher,
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      invalidatesTags: (result, error, { id }) => [{ type: ApiTags.ProductDiscount, id }],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onQueryStarted: async (voucher, { dispatch, queryFulfilled }) => {
        await handleQueryNotification('Editing voucher', queryFulfilled);
      },
    }),

    deleteProductDiscount: builder.mutation<{ status: string; message: string }, { id: number }>({
      query: ({ id }) => ({
        url: `${PRODUCT_DISCOUNT}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: ApiTags.ProductDiscount, id: 'LIST' }],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onQueryStarted: async (voucher, { dispatch, queryFulfilled }) => {
        await handleQueryNotification('Deleting voucher', queryFulfilled);
      },
    }),
  }),
});

export const {
  useGetProductDiscountsQuery,
  useLazyGetProductDiscountQuery,
  useCreateProductDiscountMutation,
  useEditProductDiscountMutation,
  useDeleteProductDiscountMutation,
} = productDiscountEndpoints;
