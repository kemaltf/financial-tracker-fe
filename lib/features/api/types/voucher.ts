export interface Voucher {
  eventName: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  applyTo: 'TOTAL' | 'PRODUCT';
  discountValue: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  id: number;
  isActive: boolean;
  store: {
    id: number;
    name: string;
    user: {
      id: string;
    };
  };
  products: {
    id: number;
    name: string;
    sku: string;
    description: string;
    stock: number;
    price: number;
    productImage: string;
  }[];
}

export interface CreateVoucherDto {
  eventName: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  applyTo: 'TOTAL' | 'PRODUCT';
  discountValue: number;
  maxDiscount: number;
  startDate: Date;
  endDate: Date;
  storeId: number;
  productIds: number[];
}

export interface EditVoucherDto extends CreateVoucherDto {
  id: string;
}
