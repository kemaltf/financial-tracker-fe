import { ProductSchemaFormValues } from '@/modules/ProductForm/form';

export interface Product {
  value: string;
  label: string;
  sku: string;
  description: string;
  stock: number;
  price: number;
  image?: string;
  id: number;
  disabled: boolean;
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

// Tipe data untuk CreateProductDto
export type CreateProductDto = Omit<ProductSchemaFormValues, 'storeId' | 'categories'> & {
  storeId: number;
  categories: number[];
};

export type ProductStore = {
  id: number;
  name: string;
  description: string;
};

export type ProductCategory = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductImage = {
  id: number;
  key: string;
  url: string;
  mimeType: string;
  size: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductVariant = {
  variantType: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  variant_value: string;
  sku: string;
  price: string;
  stock: number;
  images: ProductImage[];
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductResponse = {
  name: string;
  sku: string;
  description: string;
  stock: number;
  price: string;
  store: ProductStore;
  categories: ProductCategory[];
  id: number;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  variants: ProductVariant[];
};
