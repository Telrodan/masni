import { Material } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

const BASE_PRODUCT = 'nyuszkó-szundikendő';

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
      BASE_PRODUCT,
      sortedMaterials.plainCotton,
      [...sortedMaterials.plainCotton, ...sortedMaterials.patternedCotton],
      sortedMaterials.minkyPlus
    );
  }
}
