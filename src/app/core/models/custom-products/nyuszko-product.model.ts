import { Material } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

// type BaseProductType = 'nyuszko' | 'nyuszko-szundikendo';
// type BaseProductId = '63e9fc610c0aff28bef14d2b' | '63e9fc610c0aff28bef14d2c';
// const baseProductMap: Map<BaseProductId, BaseProductType> = new Map([
//   ['63e9fc610c0aff28bef14d2b', 'nyuszko']
// ]);

const BASE_PRODUCT_TYPE_ID = '63e9fc610c0aff28bef14d2b';

export class NyuszkoProduct {
  public baseProduct: string;
  public baseColor: Material[];
  public ears: Material[];
  public ribbon: Material[];

  constructor(
    baseProduct: string,
    baseColor: Material[],
    ears: Material[],
    ribbon: Material[]
  ) {
    this.baseProduct = baseProduct;
    this.baseColor = baseColor;
    this.ears = ears;
    this.ribbon = ribbon;
  }

  // public static getBaseProduct(id: BaseProductId): BaseProductType {
  //   return baseProductMap.get(id);
  // }

  public static setUpMaterials(
    sortedMaterials: SortedMaterials
  ): NyuszkoProduct {
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
