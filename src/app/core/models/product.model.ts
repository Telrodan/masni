export interface RawBuiltShoppingCartProductInterface {
  baseMaterials: {
    baseProduct: string;
    baseColor: string;
    szundikendoColor?: string;
    minkyColorBack?: string;
    earsColor?: string;
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
