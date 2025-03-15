export type Province = {
  province_id: string;
  province: string;
};

export type Country = {
  country_id: string;
  country_name: string;
};

export interface GetCountryQueryParams {
  id?: string;
}

export interface GetProvinceQueryParams {
  id?: string;
}

export interface GetCitiesQueryParams {
  provinceId: string;
}

export interface GetSubdistrictQueryParams {
  cityId: string;
}

export type City = {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
};

export type Subdistrict = {
  subdistrict_id: string;
  province_id: string;
  province: string;
  city_id: string;
  city: string;
  type: string;
  subdistrict_name: string;
  postal_code: string;
};

// Tipe untuk request body
export interface ShippingCostRequest {
  origin: string;
  originType: string;
  destination: string;
  destinationType: string;
  weight: number;
  courier: string;
  storeId: string;
}

// Tipe untuk response dari API
export interface ShippingCostResponse {
  query: ShippingCostRequest;
  status: {
    code: number;
    description: string;
  };
  origin_details: {
    city_id: string;
    province_id: string;
    province: string;
    type: string;
    city_name: string;
    postal_code: string;
  };
  destination_details: {
    subdistrict_id: string;
    province_id: string;
    province: string;
    city_id: string;
    city: string;
    type: string;
    subdistrict_name: string;
    postal_code: string;
  };
  results: {
    code: string;
    name: string;
    costs: {
      service: string;
      description: string;
      cost: {
        value: number;
        etd: string;
        note: string;
      }[];
    }[];
  }[];
}
