export interface VariantType {
  id: number;
  name: string;

  store: {
    id: number;
    name: string;
    user: {
      id: string;
    };
  };
}
export interface CreateVariantTypeDto {
  name: string;
  storeId: number;
}

export interface GetVariantTypeParams {
  id: string;
}

export interface GetVariantsTypeParams {
  storeId: string;
}

export interface EditVariantTypeDto extends CreateVariantTypeDto {
  id: string;
}
