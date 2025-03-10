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
}

// export type Voucher = {
//   id: number;
// };
