import { Material } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

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

  public static setUpMaterials(
    sortedMaterials: SortedMaterials
  ): NyuszkoProduct {
    return new NyuszkoProduct(
      sortedMaterials.plainCotton,
      [
        ...sortedMaterials.plainCotton,
        ...sortedMaterials.patternedCotton,
        ...sortedMaterials.doubleGauze
      ],
      sortedMaterials.ribbon,
      sortedMaterials.minkyPlus
    );
  }
}
