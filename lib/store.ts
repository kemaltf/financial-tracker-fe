import { configureStore } from '@reduxjs/toolkit';
import yourFeatureReducer from './features/example';

export const makeStore = () => {
  return configureStore({
    reducer: {
      yourFeature: yourFeatureReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
