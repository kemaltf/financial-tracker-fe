import { api } from '..';
import { API_URL } from '../constants';
import { SelectType, type ApiResponse } from '../types/common';
import {
  City,
  Country,
  GetCitiesQueryParams,
  GetCountryQueryParams,
  GetProvinceQueryParams,
  GetSubdistrictQueryParams,
  Province,
  ShippingCostRequest,
  ShippingCostResponse,
  Subdistrict,
} from '../types/shipment';

export const shipmentEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<ApiResponse<SelectType[]>, void>({
      query: () => ({
        url: `${API_URL.SHIPPING}/countries`,
        method: 'GET',
      }),
      transformResponse: (
        response: ApiResponse<Country[]>
      ): ApiResponse<{ value: string; label: string }[]> => ({
        ...response,
        data: [
          { value: '0', label: 'Indonesia' }, // Tambahkan Indonesia di awal
          ...response.data.map((data) => ({
            value: data.country_id,
            label: data.country_name,
          })),
        ],
      }),
    }),
    getCountry: builder.query<ApiResponse<SelectType[]>, GetCountryQueryParams>({
      query: ({ id }) => ({
        url: `${API_URL.SHIPPING}/countries`,
        method: 'GET',
        params: {
          id,
        },
      }),
      transformResponse: (
        response: ApiResponse<Country>
      ): ApiResponse<{ value: string; label: string }[]> => ({
        ...response,
        data: [{ label: response.data.country_name, value: response.data.country_name }],
      }),
    }),
    getProvices: builder.query<ApiResponse<SelectType[]>, void>({
      query: () => ({
        url: `${API_URL.SHIPPING}/provinces`,
        method: 'GET',
      }),
      transformResponse: (
        response: ApiResponse<Province[]>
      ): ApiResponse<{ value: string; label: string }[]> => ({
        ...response,
        data: [
          ...response.data.map((data) => ({
            value: data.province_id,
            label: data.province,
          })),
        ],
      }),
    }),
    getProvince: builder.query<ApiResponse<SelectType[]>, GetProvinceQueryParams>({
      query: ({ id }) => ({
        url: `${API_URL.SHIPPING}/provinces`,
        method: 'GET',
        params: {
          id,
        },
      }),
      transformResponse: (
        response: ApiResponse<Country>
      ): ApiResponse<{ value: string; label: string }[]> => ({
        ...response,
        data: [{ label: response.data.country_name, value: response.data.country_name }],
      }),
    }),
    getCities: builder.query<ApiResponse<SelectType[]>, GetCitiesQueryParams>({
      query: ({ provinceId }) => ({
        url: `${API_URL.SHIPPING}/cities`,
        method: 'GET',
        params: {
          provinceId,
        },
      }),
      transformResponse: (
        response: ApiResponse<City[]>
      ): ApiResponse<{ value: string; label: string }[]> => ({
        ...response,
        data: [
          ...response.data.map((data) => ({
            value: data.city_id,
            label: `${data.type} ${data.city_name}`,
          })),
        ],
      }),
    }),
    getSubdistrict: builder.query<ApiResponse<SelectType[]>, GetSubdistrictQueryParams>({
      query: ({ cityId }) => ({
        url: `${API_URL.SHIPPING}/subdistrict`,
        method: 'GET',
        params: {
          cityId,
        },
      }),
      transformResponse: (
        response: ApiResponse<Subdistrict[]>
      ): ApiResponse<{ value: string; label: string }[]> => ({
        ...response,
        data: [
          ...response.data.map((data) => ({
            value: data.subdistrict_id,
            label: data.subdistrict_name,
            postalCode: data.postal_code,
          })),
        ],
      }),
    }),
    getShippingCost: builder.mutation<ShippingCostResponse, ShippingCostRequest>({
      query: ({ storeId, ...rest }) => ({
        url: `${API_URL.SHIPPING}/costs/${storeId}`,
        method: 'POST',
        body: rest,
      }),
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useLazyGetCountryQuery,
  useLazyGetProvicesQuery,
  useLazyGetCitiesQuery,
  useLazyGetSubdistrictQuery,
  useGetShippingCostMutation,
} = shipmentEndpoints;
