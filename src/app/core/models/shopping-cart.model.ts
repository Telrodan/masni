export interface ShoppingCartItem {
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
    earsAndBodyColor?: string;
    noseColor?: string;
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
