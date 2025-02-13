import { ApiTags, BuilderType } from '..';
import { API_URL } from '../constants';
import { handleQueryNotification } from '../helpers';
import {
  Category,
  CreateCategoryDto,
  EditCategoryDto,
  GetCategoryOptQueryParams,
  GetCategoryQueryParams,
} from '../types/category';
import { SelectType, type ApiResponse } from '../types/common';

export const categoryEndpoints = (builder: BuilderType) => ({
  getCategoryOption: builder.query<ApiResponse<SelectType[]>, GetCategoryOptQueryParams>({
    query: ({ storeId }) => ({
      url: `${API_URL.CATEGORIES}/opt`,
      method: 'GET',
      params: {
        storeId,
      },
    }),
    transformResponse: (response: ApiResponse<SelectType[]>): ApiResponse<SelectType[]> => {
      return {
        ...response,
        data: response.data.map((item) => ({
          value: item.value.toString(),
          label: item.label,
        })),
      };
    },
  }),
  getCategories: builder.query<ApiResponse<Category[]>, void>({
    query: () => ({
      url: API_URL.CATEGORIES,
      method: 'GET',
    }),
    providesTags: (result) =>
      result
        ? [
            // Menandai setiap store dengan ID
            ...result.data.map(({ id }) => ({
              type: ApiTags.Category,
              id,
            })),
            { type: ApiTags.Category, id: 'LIST' },
          ]
        : [{ type: ApiTags.Category, id: 'LIST' }],
  }),
  createCategory: builder.mutation<ApiResponse<Category>, CreateCategoryDto>({
    query: (store) => ({
      url: API_URL.CATEGORIES,
      method: 'POST',
      body: store,
    }),
    invalidatesTags: [{ type: ApiTags.Category, id: 'LIST' }],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (store, { dispatch, queryFulfilled }) => {
      await handleQueryNotification('Creating category', queryFulfilled);
    },
  }),
  getCategory: builder.query<ApiResponse<Category>, GetCategoryQueryParams>({
    query: (category) => ({
      url: `${API_URL.CATEGORIES}/${category.id}`,
      method: 'GET',
    }),
  }),
  editCategory: builder.mutation<ApiResponse<Category>, EditCategoryDto>({
    query: ({ id, ...store }) => ({
      url: `${API_URL.CATEGORIES}/${id}`,
      method: 'PUT',
      body: store,
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (store, { dispatch, queryFulfilled }) => {
      await handleQueryNotification('Editing category', queryFulfilled);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    invalidatesTags: (result, error, { id }) => [{ type: ApiTags.Category, id: 'LIST' }],
  }),
  deleteCategory: builder.mutation<{ status: string; message: string }, { id: string }>({
    query: ({ id }) => ({
      url: `${API_URL.CATEGORIES}/${id}`,
      method: 'DELETE',
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    invalidatesTags: (result, error, { id }) => [{ type: ApiTags.Category, id: 'LIST' }],
  }),
});
