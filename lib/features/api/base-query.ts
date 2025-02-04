import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/v1/',
  credentials: 'include',
});

export const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // Try to refresh the token
        const refreshResult = await baseQuery(
          { url: 'auth/refresh', method: 'POST', credentials: 'include' },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          // Store the new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // If refresh token fails, remove existing cookies
          await baseQuery(
            { url: 'auth/logout', method: 'POST', credentials: 'include' },
            api,
            extraOptions
          );
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
