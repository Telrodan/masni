import { Material } from '../material.model';

export class MackoProduct {
  public baseColor: Material[];
  public earsAndBodyColor: Material[];
  public noseColor: Material[];

  constructor(
    baseColor: Material[],
    earsAndBodyColor: Material[],
    noseColor: Material[]
  ) {
    this.baseColor = baseColor;
    this.earsAndBodyColor = earsAndBodyColor;
    this.noseColor = noseColor;
  }
}
