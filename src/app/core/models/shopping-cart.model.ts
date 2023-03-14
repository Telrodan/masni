export interface ShoppingCartItemDTO {
  data: {
    item: ShoppingCartItem;
  };
}

export interface ShoppingCartItemsDTO {
  data: {
    items: ShoppingCartItem[];
  };
}

export interface ShoppingCartItem {
  ownerId: string;
  _id?: string;
  name: string;
  comment: string;
  details: {
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
  price: number;
  addedAt?: Date;
  status?: string;
}
