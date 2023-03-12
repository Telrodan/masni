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
  productName: string;
  productPrice: number;
  productDetails: {
    isExtraNameEmbroidery?: boolean;
    nameEmbroideryText?: string;
  };
  category: string;
  productStatus: string;
}
