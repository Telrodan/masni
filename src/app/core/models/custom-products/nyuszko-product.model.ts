import { MaterialInterface } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

// type BaseProductType = 'nyuszko' | 'nyuszko-szundikendo';
// type BaseProductId = '63e9fc610c0aff28bef14d2b' | '63e9fc610c0aff28bef14d2c';
// const baseProductMap: Map<BaseProductId, BaseProductType> = new Map([
//   ['63e9fc610c0aff28bef14d2b', 'nyuszko']
// ]);

const BASE_PRODUCT = 'nyuszkó';

export class NyuszkoProduct {
  public baseProduct: string;
  public baseColor: MaterialInterface[];
  public earsColor: MaterialInterface[];
  public ribbonColor: MaterialInterface[];

  constructor(
    baseProduct: string,
    baseColor: MaterialInterface[],
    earsColor: MaterialInterface[],
    ribbonColor: MaterialInterface[]
  ) {
    this.baseProduct = baseProduct;
    this.baseColor = baseColor;
    this.earsColor = earsColor;
    this.ribbonColor = ribbonColor;
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
      sortedMaterials.ribbon
    );
  }
}
