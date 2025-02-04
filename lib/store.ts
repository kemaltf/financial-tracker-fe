import { configureStore } from '@reduxjs/toolkit';
import { api } from './features/api';
import transactionQueryReducer, {
  transactionQueryReducerPath,
} from './features/create-transaction-query.slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      [transactionQueryReducerPath]: transactionQueryReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
