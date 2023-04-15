import { Material } from './material.model';

export class SortedMaterials {
  public patternedCotton: Material[];
  public plainCotton: Material[];
  public doubleGauze: Material[];
  public minkyPlus: Material[];
  public ribbon: Material[];
  public woolFelt: Material[];

  constructor(
    patternedCotton: Material[],
    plainCotton: Material[],
    doubleGauze: Material[],
    minkyPlus: Material[],
    ribbon: Material[],
    woolFelt: Material[]
  ) {
    this.patternedCotton = patternedCotton;
    this.plainCotton = plainCotton;
    this.doubleGauze = doubleGauze;
    this.minkyPlus = minkyPlus;
    this.ribbon = ribbon;
    this.woolFelt = woolFelt;
  }

  private static sorter(materials: Material[], category: string): Material[] {
    return materials.filter((material) => material.category === category);
  }

  public static sortMaterials(materials: Material[]): SortedMaterials {
    return new SortedMaterials(
      this.sorter(materials, 'patternedCotton'),
      this.sorter(materials, 'plainCotton'),
      this.sorter(materials, 'doubleGauze'),
      this.sorter(materials, 'minkyPlus'),
      this.sorter(materials, 'ribbon'),
      this.sorter(materials, 'woolFelt')
    );
  }
}
