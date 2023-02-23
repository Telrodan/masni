import { Material } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

const BASE_PRODUCT_TYPE_ID = '63eb94a421e3dfdd574de12f';

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
      BASE_PRODUCT_TYPE_ID,
      sortedMaterials.plainCotton,
      [...sortedMaterials.plainCotton, ...sortedMaterials.patternedCotton],
      sortedMaterials.minkyPlus
    );
  }
}
