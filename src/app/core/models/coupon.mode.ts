export interface Coupon {
  couponOwner: string;
  couponType: string;
  activatedAt: Date;
  expiresAt: Date;
}

export class Coupon {
  public id: string;
  public couponOwner: string;
  public couponType: string;
  public activatedAt: Date;
  public expiresAt: Date;
  constructor(
    id: string,
    couponOwner: string,
    couponType: string,
    activatedAt: Date,
    expiresAt: Date
  ) {
    this.id = id;
    this.couponOwner = couponOwner;
    this.couponType = couponType;
    this.activatedAt = activatedAt;
    this.expiresAt = expiresAt;
  }

  public static fromDTO(couponResult: any): Coupon {
    return new Coupon(
      couponResult._id,
      couponResult.couponOwner,
      couponResult.couponType,
      couponResult.activatedAt,
      couponResult.expiresAt
    );
  }
}
