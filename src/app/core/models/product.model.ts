export interface ProductsDTO {
  data: {
    products: Product[];
  };
}

export interface BuiltProduct {
  baseMaterials: {
    baseProduct: string;
    baseColor: string;
    szundikendoColor?: string;
    minkyColorBack?: string;
    earsColor?: string;
    earsAndBodyColor?: string;
    noseColor?: string;
    ribbonColor?: string;
  };
  extraOptions: {
    extraMinkyEarsCheckbox?: boolean;
    extraMinkyEarsInput?: string;
    nameEmbroideryCheckbox?: boolean;
    nameEmbroideryInput?: string;
    productComment?: string;
  };
  price: number;
}

export interface Product {
  _id?: string;
  name: string;
  baseProduct: string;
  price: number;
  details: {
    nameEmbroideryCheckbox?: boolean;
    nameEmbroideryInput?: string;
    comment?: string;
  };
  description: string[];
  images: string[];
  category: string;
  status: string;
}
