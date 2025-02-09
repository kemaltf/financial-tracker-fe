import { ApiTags, BuilderType } from '..';
import { API_URL } from '../constants';
import { handleQueryNotification } from '../helpers';
import { type ApiResponse } from '../types/common';
import {
  CreateVariantTypeDto,
  EditVariantTypeDto,
  GetVariantTypeParams,
  VariantType,
} from '../types/variant-type';

export const variantTypeEndpoints = (builder: BuilderType) => ({
  getVariantTypes: builder.query<ApiResponse<VariantType[]>, void>({
    query: () => ({
      url: API_URL.VARIANT_TYPES,
      method: 'GET',
    }),
    providesTags: (result) =>
      result
        ? [
            ...result.data.map(({ id }) => ({
              type: ApiTags.VariantType,
              id,
            })),
            { type: ApiTags.VariantType, id: 'LIST' },
          ]
        : [{ type: ApiTags.VariantType, id: 'LIST' }],
  }),
  createVariantType: builder.mutation<ApiResponse<VariantType>, CreateVariantTypeDto>({
    query: (variantType) => ({
      url: API_URL.VARIANT_TYPES,
      method: 'POST',
      body: variantType,
    }),
    invalidatesTags: [{ type: ApiTags.VariantType, id: 'LIST' }],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (store, { dispatch, queryFulfilled }) => {
      await handleQueryNotification('Creating variant type', queryFulfilled);
    },
  }),
  getVariantType: builder.query<ApiResponse<VariantType>, GetVariantTypeParams>({
    query: (variantType) => ({
      url: `${API_URL.VARIANT_TYPES}/${variantType.id}`,
      method: 'GET',
    }),
  }),
  editVariantType: builder.mutation<ApiResponse<VariantType>, EditVariantTypeDto>({
    query: ({ id, ...variantType }) => ({
      url: `${API_URL.VARIANT_TYPES}/${id}`,
      method: 'PUT',
      body: variantType,
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (variantType, { dispatch, queryFulfilled }) => {
      await handleQueryNotification('Editing variant type', queryFulfilled);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    invalidatesTags: (result, error, { id }) => [{ type: ApiTags.VariantType, id: 'LIST' }],
  }),
  deleteVariantType: builder.mutation<{ status: string; message: string }, { id: string }>({
    query: ({ id }) => ({
      url: `${API_URL.VARIANT_TYPES}/${id}`,
      method: 'DELETE',
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    invalidatesTags: (result, error, { id }) => [{ type: ApiTags.VariantType, id: 'LIST' }],
  }),
});
