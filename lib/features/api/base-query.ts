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
  let hasRetried = false;

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
          // Store the new token and retry the original request
          result = await baseQuery(args, api, extraOptions);

          // Jika setelah refresh token, request kedua tetap 401, logout
          if (result.error && result.error.status === 401) {
            hasRetried = true;
          }
        } else {
          hasRetried = true;
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);

      // Jika setelah refresh token, request kedua tetap 401, logout
      if (result.error && result.error.status === 401) {
        hasRetried = true;
      }
    }
  }

  // Jika sudah mencoba refresh token dan tetap gagal, jalankan logout
  if (hasRetried) {
    await baseQuery(
      { url: 'auth/logout', method: 'POST', credentials: 'include' },
      api,
      extraOptions
    );
  }

  return result;
};
