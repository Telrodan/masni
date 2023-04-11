import { Material } from '../material.model';
import { SortedMaterials } from '../sorted-materials.model';

export class MackoProduct {
  public baseColor: Material[];
  public earsAndBodyColor: Material[];
  public noseColor: Material[];

  constructor(
    baseColor: Material[],
    earsAndBodyColor: Material[],
    noseColor: Material[]
  ) {
    this.baseColor = baseColor;
    this.earsAndBodyColor = earsAndBodyColor;
    this.noseColor = noseColor;
  }

  public static setUpMaterials(sortedMaterials: SortedMaterials): MackoProduct {
    return new MackoProduct(
      sortedMaterials.plainCotton,
      [...sortedMaterials.plainCotton, ...sortedMaterials.patternedCotton],
      sortedMaterials.woolFelt
    );
  }
}
