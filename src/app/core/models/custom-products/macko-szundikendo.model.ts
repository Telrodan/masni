import { Material } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

export class MackoSzundikendoProduct {
  public baseColor: Material[];
  public szundikendoColor: Material[];
  public minkyColorBack: Material[];

  constructor(
    baseColor: Material[],
    szundikendoColor: Material[],
    minkyColorBack: Material[]
  ) {
    this.baseColor = baseColor;
    this.szundikendoColor = szundikendoColor;
    this.minkyColorBack = minkyColorBack;
  }

  public static setUpMaterials(
    sortedMaterials: SortedMaterials
  ): MackoSzundikendoProduct {
    return new MackoSzundikendoProduct(
      sortedMaterials.plainCotton,
      [...sortedMaterials.plainCotton, ...sortedMaterials.patternedCotton],
      sortedMaterials.minkyPlus
    );
  }
}
