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
