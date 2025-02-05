import { BuilderType } from '..';
import { SelectType, type ApiResponse } from '../types/common';

export const customerEndpoints = (builder: BuilderType) => ({
  getCustomers: builder.query<ApiResponse<SelectType[]>, { role: string }>({
    query: ({ role }) => ({
      url: `financial-party?role=${role}`,
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
