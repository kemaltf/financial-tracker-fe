export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;

  store: {
    id: number;
    name: string;
    user: {
      id: string;
    };
  };
}

export interface CreateCategoryDto {
  name: string;
  description?: string | undefined;
  storeId: number;
}

export interface GetCategoryQueryParams {
  id: string;
}

export interface EditCategoryDto extends CreateCategoryDto {
  id: string;
}
