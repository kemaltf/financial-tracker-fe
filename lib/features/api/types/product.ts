export interface Product {
  value: string;
  label: string;
  sku: string;
  description: string;
  stock: number;
  price: number;
  image?: string;
  id: number;
}

export interface ProductResponse {
  data: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface ProductQueryParams {
  page: number;
  limit: number;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
  storeId: number;
  filters?: {
    name?: string;
    sku?: string;
  };
}
