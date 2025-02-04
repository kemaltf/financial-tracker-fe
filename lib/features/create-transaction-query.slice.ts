import dayjs from 'dayjs';
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
  startMonth: dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
  endMonth: dayjs().format('YYYY-MM-DD'),
  limit: 4,
  page: 1,
  sortBy: 'createdAt',
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
