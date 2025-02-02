import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TransactionFilterState {
  startMonth: string;
  endMonth: string;
  limit: number;
  page: number;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
}

const initialState: TransactionFilterState = {
  startMonth: '',
  endMonth: '',
  limit: 4,
  page: 1,
  sortBy: 'created_at',
  sortDirection: 'DESC',
};

const transactionQuerySlice = createSlice({
  name: 'transaction-query',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<TransactionFilterState>>) => {
      return { ...state, ...action.payload };
    },
    resetFilter: () => initialState,
  },
});

export const { setFilter, resetFilter } = transactionQuerySlice.actions;
export const { reducerPath: transactionQueryReducerPath } = transactionQuerySlice;
export default transactionQuerySlice.reducer;
