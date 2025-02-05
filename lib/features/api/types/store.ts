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
};

export type CreateStoreDto = {
  name: string;
  description: string;
};

export type EditStoreDto = {
  id: string;
  name: string;
  description: string;
};

export interface Store {
  id: number;
  name: string;
  description: string;
}

export interface StoreTypeWithDescription extends SelectType {
  description: string;
}

export interface GetStoreQueryParams {
  id: string;
}
