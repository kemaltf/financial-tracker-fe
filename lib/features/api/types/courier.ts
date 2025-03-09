export interface Courier {
  label: string;
  value: number;
  code: string;
  service: string[];
}

export interface CreateCourierDto {
  storeId: string;
  service: string;
  action: 'disable' | 'enable';
  courierCode: string;
}

export interface GetCourierQueryParams {
  id: string;
}
