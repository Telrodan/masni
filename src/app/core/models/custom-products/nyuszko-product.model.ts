import { Material } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

// type BaseProductType = 'nyuszko' | 'nyuszko-szundikendo';
// type BaseProductId = '63e9fc610c0aff28bef14d2b' | '63e9fc610c0aff28bef14d2c';
// const baseProductMap: Map<BaseProductId, BaseProductType> = new Map([
//   ['63e9fc610c0aff28bef14d2b', 'nyuszko']
// ]);

const BASE_PRODUCT_TYPE_ID = '63eb94a421e3dfdd574de12e';

export class NyuszkoProduct {
  public baseProduct: string;
  public baseColor: Material[];
  public earsColor: Material[];
  public ribbonColor: Material[];

  constructor(
    baseProduct: string,
    baseColor: Material[],
    earsColor: Material[],
    ribbonColor: Material[]
  ) {
    this.baseProduct = baseProduct;
    this.baseColor = baseColor;
    this.earsColor = earsColor;
    this.ribbonColor = ribbonColor;
  }

  public static setUpMaterials(
    sortedMaterials: SortedMaterials
  ): NyuszkoProduct {
    console.log(sortedMaterials);
    return new NyuszkoProduct(
      BASE_PRODUCT_TYPE_ID,
      sortedMaterials.plainCotton,
      [
        ...sortedMaterials.plainCotton,
        ...sortedMaterials.patternedCotton,
        ...sortedMaterials.doubleGauze
      ],
      sortedMaterials.ribbon
    );
  }
}
