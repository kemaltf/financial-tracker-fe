export interface ApiResponse<T = undefined> {
  code: number;
  message: string;
  status: string;
  data: T;
}

export interface SelectType {
  value: string;
  label: string;
}
