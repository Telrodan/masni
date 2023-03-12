import { Material } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

const BASE_PRODUCT = 'nyuszkó';

export class NyuszkoProduct {
  public baseProduct: string;
  public baseColor: Material[];
  public earsColor: Material[];
  public ribbonColor: Material[];
  public extraMinkyEars: Material[];

  constructor(
    baseProduct: string,
    baseColor: Material[],
    earsColor: Material[],
    ribbonColor: Material[],
    extraMinkyEars: Material[]
  ) {
    this.baseProduct = baseProduct;
    this.baseColor = baseColor;
    this.earsColor = earsColor;
    this.ribbonColor = ribbonColor;
    this.extraMinkyEars = extraMinkyEars;
  }

  public static setUpMaterials(
    sortedMaterials: SortedMaterials
  ): NyuszkoProduct {
    return new NyuszkoProduct(
      BASE_PRODUCT,
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
