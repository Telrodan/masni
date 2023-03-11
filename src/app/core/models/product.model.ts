export interface RawBuiltShoppingCartProductInterface {
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
