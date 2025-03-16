export type EventData = {
  id: number;
  eventName: string;
  discountType: 'FIXED' | 'PERCENTAGE'; // Tambahkan opsi lain jika ada
  discountValue: number;
  maxDiscount: number | null;
  startDate: string; // ISO string date
  endDate: string; // ISO string date
  isActive: boolean;
  store: Store;
  products: Product[];
};

export type Store = {
  id: number;
  name: string;
  description: string;
};

export type Product = {
  id: number;
  name: string;
  sku: string;
  description: string;
  stock: number;
  price: number;
  productImage: string; // ISO string date
};

export type CreateProductDiscountRequest = {
  eventName: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue?: number;
  maxDiscount?: number;
  startDate: Date | string; // ISO string date
  endDate: Date | string; // ISO string date
  productIds: number[];
  isActive?: boolean;
  storeId: number;
};

export interface EditProductDiscountRequest extends CreateProductDiscountRequest {
  id: string;
}
