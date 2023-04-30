import { ShoppingCartItem } from './shopping-cart-item.model';

interface UserSignupForm {
  name: string;
  email: string;
  phone: string;
  password?: string;
  passwordConfirm?: string;
  shippingStreet: string;
  shippingCity: string;
  shippingPostcode: number;
  shippingCounty: string;
  billingStreet: string;
  billingCity: string;
  billingPostcode: number;
  billingCounty: string;
  subscribed: boolean;
}

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
  shippingAddress: Address;
  billingAddress: Address;
  subscribed: boolean;

  constructor(data: UserSignupForm) {
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.password = data.password;
    this.passwordConfirm = data.passwordConfirm;
    this.shippingAddress = {
      street: data.shippingStreet,
      city: data.shippingCity,
      postcode: data.shippingPostcode,
      county: data.shippingCounty
    };
    this.billingAddress = {
      street: data.billingStreet,
      city: data.billingCity,
      postcode: data.billingPostcode,
      county: data.billingCounty
    };
    this.subscribed = data.subscribed;
  }
}
