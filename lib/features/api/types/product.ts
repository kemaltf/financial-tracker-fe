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

export type VariantDto = {
  variantTypeId: number;
  variant_value: string;
  sku: string;
  price: string;
  stock: number;
  imageIds: number[];
};

export type CreateProductDto = {
  name: string;
  sku: string;
  description: string;
  stock: number;
  price: string;
  categories: number[];
  store: number;
  imageIds: number[];
  variants: VariantDto[];
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
