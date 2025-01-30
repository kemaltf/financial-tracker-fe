import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QueryParams {
  startMonth: string;
  endMonth: string;
  limit: number;
  page: number;
}

const initialState: QueryParams = {
  startMonth: '',
  endMonth: '',
  limit: 4,
  page: 1,
};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQueryParams(state, action: PayloadAction<QueryParams>) {
      state.startMonth = action.payload.startMonth;
      state.endMonth = action.payload.endMonth;
      state.limit = action.payload.limit;
      state.page = action.payload.page;
    },
  },
});

export const { setQueryParams } = querySlice.actions;
export default querySlice.reducer;
