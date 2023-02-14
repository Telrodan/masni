import { NyuszkoProduct } from './custom-products/nyuszko-product.model';

export class Order {
  public id?: string;
  public productName: string;
  public productDetails: ProductDetails;
  public orderComment: string;
  public buyerId: string;
  public price: number;

  constructor(
    id: string,
    productName: string,
    productDetails: ProductDetails,
    orderComment: string,
    buyerId: string,
    price: number
  ) {
    this.id = id;
    this.productName = productName;
    this.productDetails = productDetails;
    this.orderComment = orderComment;
    this.buyerId = buyerId;
    this.price = price;
  }
}

export interface ProductDetails {
  baseProduct: string;
  baseColor: string;
  szundikendoColor?: string;
  earsColor?: string;
  ribbonColor?: string;
  isExtraMinkyEars?: boolean;
  minkyEarsColor?: string;
  isExtraNameEmbroidery: boolean;
  nameEmbroideryText: string;
}
