import { Material } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

const BASE_PRODUCT = 'mackó-szundikendő';

export class MackoSzundikendoProduct {
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
  ): MackoSzundikendoProduct {
    return new MackoSzundikendoProduct(
      BASE_PRODUCT,
      sortedMaterials.plainCotton,
      [...sortedMaterials.plainCotton, ...sortedMaterials.patternedCotton],
      sortedMaterials.minkyPlus
    );
  }
}
