import { resetFilter, setFilter } from '@/lib/features/create-transaction-query.slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

export const useTransactionHistory = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state['transaction-query']);

  const updateFilter = (newFilter: Partial<typeof filter>) => {
    dispatch(setFilter(newFilter));
  };

  const clearFilter = () => {
    dispatch(resetFilter());
  };

  return {
    filter,
    updateFilter,
    clearFilter,
  };
};
