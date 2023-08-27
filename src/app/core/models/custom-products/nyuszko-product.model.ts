import { Material } from '../material.model';

export class NyuszkoProduct {
  public baseColor: Material[];
  public earsColor: Material[];
  public ribbonColor: Material[];
  public extraMinkyEars: Material[];

  constructor(
    baseColor: Material[],
    earsColor: Material[],
    ribbonColor: Material[],
    extraMinkyEars: Material[]
  ) {
    this.baseColor = baseColor;
    this.earsColor = earsColor;
    this.ribbonColor = ribbonColor;
    this.extraMinkyEars = extraMinkyEars;
  }
}
