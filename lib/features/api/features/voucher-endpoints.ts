import { api } from '..';
import { API_URL, ApiTags } from '../constants';
import { handleQueryNotification } from '../helpers';
import { type ApiResponse } from '../types/common';
import { CreateVoucherDto, EditVoucherDto, Voucher } from '../types/voucher';

export const voucherEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getVouchers: builder.query<ApiResponse<Voucher[]>, void>({
      query: () => ({
        url: `${API_URL.VOUCHER}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: ApiTags.Voucher, id })),
              { type: ApiTags.Voucher, id: 'LIST' },
            ]
          : [{ type: ApiTags.Voucher, id: 'LIST' }],
    }),

    getVoucher: builder.query<ApiResponse<Voucher>, { id: number }>({
      query: ({ id }) => ({
        url: `${API_URL.VOUCHER}/${id}`,
        method: 'GET',
      }),
    }),

    createVoucher: builder.mutation<ApiResponse<Voucher>, CreateVoucherDto>({
      query: (voucher) => ({
        url: `${API_URL.VOUCHER}`,
        method: 'POST',
        body: voucher,
      }),
      invalidatesTags: [{ type: ApiTags.Voucher, id: 'LIST' }],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onQueryStarted: async (_voucher, { dispatch, queryFulfilled }) => {
        await handleQueryNotification('Creating voucher', queryFulfilled);
      },
    }),

    editVoucher: builder.mutation<ApiResponse<Voucher>, EditVoucherDto>({
      query: ({ id, ...voucher }) => ({
        url: `${API_URL.VOUCHER}/${id}`,
        method: 'PATCH',
        body: voucher,
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      invalidatesTags: (result, error, { id }) => [{ type: ApiTags.Voucher, id }],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onQueryStarted: async (voucher, { dispatch, queryFulfilled }) => {
        await handleQueryNotification('Editing voucher', queryFulfilled);
      },
    }),

    deleteVoucher: builder.mutation<{ status: string; message: string }, { id: number }>({
      query: ({ id }) => ({
        url: `${API_URL.VOUCHER}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: ApiTags.Voucher, id: 'LIST' }],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onQueryStarted: async (voucher, { dispatch, queryFulfilled }) => {
        await handleQueryNotification('Deleting voucher', queryFulfilled);
      },
    }),
  }),
});

export const {
  useGetVouchersQuery,
  useLazyGetVoucherQuery,
  useCreateVoucherMutation,
  useEditVoucherMutation,
  useDeleteVoucherMutation,
} = voucherEndpoints;
