export interface RawBuiltProductInterface {
  baseMaterials: {
    baseProduct: string;
    baseColor: string;
    szundikendoColor?: string;
    minkyColorBack?: string;
    earsColor?: string;
    ribbonColor?: string;
  };
  extraOptions: {
    extraMinkyEarCheckbox?: boolean;
    extraMinkyEarInput?: string;
    nameEmbroideryCheckbox?: boolean;
    nameEmbroideryInput?: string;
    comment?: string;
  };
  price: number;
}

export interface ProductInterface {
  ownerId: string;
  _id?: string;
  productName: string;
  productComment: string;
  productDetails: {
    baseProduct?: string;
    baseColor?: string;
    szundikendoColor?: string;
    minkyColorBack?: string;
    earsColor?: string;
    ribbonColor?: string;
    isExtraMinkyEars?: boolean;
    minkyEarsColor?: string;
    isExtraNameEmbroidery?: boolean;
    nameEmbroideryText?: string;
  };
  productPrice: number;
  addedAt?: Date;
  productStatus?: string;
}
