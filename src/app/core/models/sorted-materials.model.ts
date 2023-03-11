import { MaterialInterface } from './material.model';

export interface SortedMaterialsInterface {
  patternedCotton: MaterialInterface[];
  plainCotton: MaterialInterface[];
  plainLinen: MaterialInterface[];
  doubleGauze: MaterialInterface[];
  minkyPlus: MaterialInterface[];
  ribbon: MaterialInterface[];
  woolFelt: MaterialInterface[];
  baseProduct: MaterialInterface[];
}

export class SortedMaterials implements SortedMaterialsInterface {
  public patternedCotton: MaterialInterface[];
  public plainCotton: MaterialInterface[];
  public plainLinen: MaterialInterface[];
  public doubleGauze: MaterialInterface[];
  public minkyPlus: MaterialInterface[];
  public ribbon: MaterialInterface[];
  public woolFelt: MaterialInterface[];
  public baseProduct: MaterialInterface[];

  constructor(
    patternedCotton: MaterialInterface[],
    plainCotton: MaterialInterface[],
    plainLinen: MaterialInterface[],
    doubleGauze: MaterialInterface[],
    minkyPlus: MaterialInterface[],
    ribbon: MaterialInterface[],
    woolFelt: MaterialInterface[],
    baseProduct: MaterialInterface[]
  ) {
    this.patternedCotton = patternedCotton;
    this.plainCotton = plainCotton;
    this.plainLinen = plainLinen;
    this.doubleGauze = doubleGauze;
    this.minkyPlus = minkyPlus;
    this.ribbon = ribbon;
    this.woolFelt = woolFelt;
    this.baseProduct = baseProduct;
  }

  private static sorter(
    materials: MaterialInterface[],
    category: string
  ): MaterialInterface[] {
    return materials.filter((material) => material.category === category);
  }

  public static sortMaterials(materials: MaterialInterface[]): SortedMaterials {
    return new SortedMaterials(
      this.sorter(materials, 'patternedCotton'),
      this.sorter(materials, 'plainCotton'),
      this.sorter(materials, 'plainLinen'),
      this.sorter(materials, 'doubleGauze'),
      this.sorter(materials, 'minkyPlus'),
      this.sorter(materials, 'ribbon'),
      this.sorter(materials, 'woolFelt'),
      this.sorter(materials, 'baseProduct')
    );
  }
}
