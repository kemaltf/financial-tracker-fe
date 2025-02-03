import { SelectType } from './common';

export interface TransactionTypeWithDescription extends SelectType {
  description: string;
}

export interface Transaction {
  id: number;
  note: string;
  createdAt: string;
  transactionType: string;
  amount: number;
  store: string;
  user: string;
  debit: {
    code: string;
    account: string;
    balance: number;
  };
  credit: {
    code: string;
    account: string;
    balance: number;
  };
}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
  currentPage: number;
  totalPages: number;
  filter: { startMonth: string; endMonth: string };
}

export interface TransactionSummaryQueryParams {
  startMonth: string;
  endMonth: string;
}

export interface TransactionSummaryResponse {
  totalIncome: number;
  totalExpense: number;
  totalDebt: number;
  totalReceivables: number;
  totalInvestment: number;
  totalWithdrawal: number;
  totalTransfer: number;
  totalReceivablesIncome: number;
  totalReceivablesExpense: number;
  profitLoss: number;
  totalIncomeChange: number | null;
  totalExpenseChange: number | null;
  totalDebtChange: number | null;
  totalReceivablesChange: number | null;
  totalInvestmentChange: number | null;
  totalWithdrawalChange: number | null;
  totalTransferChange: number | null;
  totalReceivablesIncomeChange: number | null;
  totalReceivablesExpenseChange: number | null;
  profitLossChange: number | null;
}

export interface TransactionBalanceSheet {
  assets: {
    name: string;
    total: number;
  }[];
  liabilities: {
    name: string;
    total: number;
  }[];
  equity: {
    name: string;
    total: number;
  }[];
}

export interface TransactionQueryParams {
  startMonth: string;
  endMonth: string;
  limit: number;
  page: number;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
}

export interface TransactionDTO {
  transactionTypeId: number;
  amount: number;
  note?: string;
  debitAccountId: number;
  creditAccountId: number;
  customerId?: number;
  debtorId?: number;
  creditorId?: number;
  storeId?: number;
  dueDate?: Date;
  address?: AddressDTO;
  orders?: OrderDTO[];
}

interface AddressDTO {
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
}

interface OrderDTO {
  productId: number;
  quantity: number;
}
