import { NyuszkoProduct } from './custom-products/nyuszko-product.model';
import { NyuszkoSzundikendoProduct } from './custom-products/nyuszko-szundikendo-product.model';

export class Order {
  public id?: string;
  public productName: string;
  public productDetails: any | any[];
  public orderComment: string;
  public buyerId: string;
  public price: number;

  constructor(
    id: string,
    productName: string,
    productDetails: NyuszkoProduct,
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
