import { ShoppingCartItem } from './shopping-cart-item.model';

interface Address {
  street: string;
  city: string;
  postcode: number;
  county: string;
}

export class User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  passwordConfirm?: string;
  shoppingCart: {
    _id: string;
    items: ShoppingCartItem[];
  };
  address: Address;
  subscribed: boolean;

  constructor(data: any) {
    this.name = data?.name;
    this.email = data?.email;
    this.phone = data?.phone;
    this.password = data?.password;
    this.passwordConfirm = data?.passwordConfirm;
    this.address = {
      street: data?.street,
      city: data?.city,
      postcode: data?.postcode,
      county: data?.county
    };
    this.subscribed = data?.subscribed;
  }
}
