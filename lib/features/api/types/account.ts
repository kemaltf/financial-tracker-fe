import { SelectType } from './common';

export interface AvailableAccounts {
  debitAccounts: SelectType[];
  creditAccounts: SelectType[];
}

export type Account = {
  id: number;
  code: string;
  name: string;
  description: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  account: {
    id: number;
    type: string;
    normalBalance: string;
  };
};
