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

export type CreateAccountResponse = {
  code: string;
  name: string;
  description: string;
  balance: number;
  Account: {
    id: number;
    type: string;
    normalBalance: string;
  };
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateAccountDto = {
  name: string;
  type: string;
  description: string;
};

export type EditAccountDto = {
  name: string;
  type: string;
  description: string;
  id: string;
};

export interface GetAccountQueryParams {
  id: string;
}
