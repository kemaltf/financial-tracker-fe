import { createApi } from '@reduxjs/toolkit/query/react';
import createBaseQuery from './base-query';
import { ApiTags } from './constants';

const baseQuery = createBaseQuery(process.env.NEXT_PUBLIC_API_BASE_URL);

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: Object.values(ApiTags), // tagTypes digunakan untuk memberi label atau kategori pada data yang di-fetch dari API.
  endpoints: () => ({}),
});
