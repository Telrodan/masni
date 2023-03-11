import { MaterialInterface } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

const BASE_PRODUCT_TYPE_ID = '63eb94a421e3dfdd574de130';

export class MackoProduct {
  public baseProduct: string;
  public baseColor: MaterialInterface[];
  public earsAndBodyColor: MaterialInterface[];
  public noseColor: MaterialInterface[];

  constructor(
    baseProduct: string,
    baseColor: MaterialInterface[],
    earsAndBodyColor: MaterialInterface[],
    noseColor: MaterialInterface[]
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
      [...sortedMaterials.plainCotton, ...sortedMaterials.patternedCotton],
      sortedMaterials.woolFelt
    );
  }
}
