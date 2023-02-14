import { Material } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

export class NyuszkoSzundikendoProduct {
  public baseProduct: string;
  public baseColor: Material[];
  public szundikendoColor: Material[];
  public minkyColorBack: Material[];

  constructor(
    baseProduct: string,
    baseColor: Material[],
    szundikendoColor: Material[],
    minkyColorBack: Material[]
  ) {
    this.baseProduct = baseProduct;
    this.baseColor = baseColor;
    this.szundikendoColor = szundikendoColor;
    this.minkyColorBack = minkyColorBack;
  }

  public static setUpMaterials(
    sortedMaterials: SortedMaterials
  ): NyuszkoSzundikendoProduct {
    return new NyuszkoSzundikendoProduct(
      '63eb94a421e3dfdd574de12f',
      sortedMaterials.plainCotton,
      [...sortedMaterials.plainCotton, ...sortedMaterials.patternedCotton],
      sortedMaterials.minkyPlus
    );
  }
}
