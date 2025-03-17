import { SelectType } from './common';

export type CreateStoreResponse = {
  name: string;
  description: string;
  userId: {
    name: string;
    email: string;
    username: string;
  }; // Jika ingin mengaitkan dengan objek User
  id: number;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  subdistrict: string;
  postalCode: string;
  phoneNumber: string;
};

export type CreateStoreDto = {
  name: string;
  description: string;
  addressLine1: string;
  addressLine2?: string | undefined;
  city: string;
  state: string;
  subdistrict: string;
  postalCode: string;
  phoneNumber: string;
};

export interface EditStoreDto extends CreateStoreDto {
  id: string;
}

export interface Store {
  id: number;
  name: string;
  description: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  subdistrict: string;
  postalCode: string;
  phoneNumber: string;
}

export interface StoreTypeWithDescription extends SelectType {
  description: string;
}

export interface GetStoreQueryParams {
  id: string;
}
