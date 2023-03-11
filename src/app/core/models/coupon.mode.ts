export class Coupon {
  public _id?: string;
  public couponOwner: string;
  public couponType: string;
  public discount: number;
  public activatedAt: Date;
  public expiresAt: Date;
  constructor(
    _id: string,
    couponOwner: string,
    couponType: string,
    discount: number,
    activatedAt: Date,
    expiresAt: Date
  ) {
    this._id = _id;
    this.couponOwner = couponOwner;
    this.couponType = couponType;
    this.discount = discount;
    this.activatedAt = activatedAt;
    this.expiresAt = expiresAt;
  }
}
