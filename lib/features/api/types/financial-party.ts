export type FinancialPartyResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateFinancialPartyDTO = {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | undefined;
  city: string;
  state: string;
  postalCode: string;
  role: string;
};

export interface GetFinancialPartyQueryParams {
  id: string;
}

export type EditFinancialPartyDTO = {
  id: string;
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | undefined;
  city: string;
  state: string;
  postalCode: string;
  role: string;
};
