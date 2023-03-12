export class Coupon {
  _id?: string;
  couponOwner: string;
  couponType: string;
  discount: number;
  activatedAt: Date;
  expiresAt: Date;
}
