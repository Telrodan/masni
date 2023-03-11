import { MaterialInterface } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

const BASE_PRODUCT = 'mackó';

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
      BASE_PRODUCT,
      sortedMaterials.plainCotton,
      [...sortedMaterials.plainCotton, ...sortedMaterials.patternedCotton],
      sortedMaterials.woolFelt
    );
  }
}
