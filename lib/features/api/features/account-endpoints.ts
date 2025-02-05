import { BuilderType } from '..';
import { type AvailableAccounts } from '../types/account';
import { type ApiResponse } from '../types/common';

export const accountEndpoints = (builder: BuilderType) => ({
  getAvailableAccounts: builder.query<ApiResponse<AvailableAccounts>, number>({
    query: (id) => ({
      url: `accounts/options/${id}`,
      method: 'GET',
    }),
    transformResponse: (
      response: ApiResponse<AvailableAccounts>
    ): ApiResponse<AvailableAccounts> => {
      return {
        ...response,
        data: {
          debitAccounts: response.data.debitAccounts.map((item) => ({
            value: item.value.toString(),
            label: item.label,
          })),
          creditAccounts: response.data.creditAccounts.map((item) => ({
            value: item.value.toString(),
            label: item.label,
          })),
        },
      };
    },
  }),
});
