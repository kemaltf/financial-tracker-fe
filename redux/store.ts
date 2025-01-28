import { configureStore } from '@reduxjs/toolkit';
import { api } from '../lib/features/api';
import authReducer from '../lib/features/authSlice';

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export default store;
