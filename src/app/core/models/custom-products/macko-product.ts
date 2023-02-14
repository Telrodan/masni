import { Material } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

const BASE_PRODUCT_TYPE_ID = '63e9fc610c0aff28bef14d2b';

export class MackoProduct {
  public baseProduct: string;
  public baseColor: Material[];
  public earsAndBodyColor: Material[];
  public noseColor: Material[];

  constructor(
    baseProduct: string,
    baseColor: Material[],
    earsAndBodyColor: Material[],
    noseColor: Material[]
  ) {
    this.baseProduct = baseProduct;
    this.baseColor = baseColor;
    this.earsAndBodyColor = earsAndBodyColor;
    this.noseColor = noseColor;
  }

  public static setUpMaterials(sortedMaterials: SortedMaterials): MackoProduct {
    return new MackoProduct(
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