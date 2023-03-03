export class Coupon {
  public id: string;
  public couponOwner: string;
  public couponType: string;
  public discount: number;
  public activatedAt: Date;
  public expiresAt: Date;
  constructor(
    id: string,
    couponOwner: string,
    couponType: string,
    discount: number,
    activatedAt: Date,
    expiresAt: Date
  ) {
    this.id = id;
    this.couponOwner = couponOwner;
    this.couponType = couponType;
    this.discount = discount;
    this.activatedAt = activatedAt;
    this.expiresAt = expiresAt;
  }

  public static fromDTO(couponResult: any): Coupon {
    return new Coupon(
      couponResult._id,
      couponResult.couponOwner,
      couponResult.couponType,
      couponResult.discount,
      couponResult.activatedAt,
      couponResult.expiresAt
    );
  }
}
