import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Material } from '../models/material.model';
import { SortedMaterials } from '../models/sorted-materials.model';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private materials: Material[];
  private sortedMaterials: SortedMaterials = {
    patternedCotton: [],
    plainCotton: [],
    plainLinen: [],
    doubleGauze: [],
    minkyPlus: [],
    ribbon: [],
    woolFelt: [],
    baseProduct: []
  };

  constructor(private apiService: ApiService) {}

  public getMaterials(): Material[] {
    return this.materials || [];
  }

  public getSortedMaterials(): SortedMaterials {
    return this.sortedMaterials;
  }

  public getExtraPriceById(materialId: string, materials: Material[]): number {
    let extraPrice = 0;
    const material = materials.find((material) => material.id === materialId);
    if (!material) return extraPrice;
    extraPrice = material.extra;
    return extraPrice;
  }

  public getMaterialNameById(
    materialId: string,
    materials: Material[]
  ): string {
    const material = materials.find((material) => material.id === materialId);
    if (!material) return undefined;
    return material.name;
  }

  public setSortedMaterials(materials: Material[]): void {
    materials.forEach((material) => {
      this.sortedMaterials[material.category].push(material);
    });
  }

  public getSortedMaterials$(): Observable<SortedMaterials> {
    return this.apiService
      .get$<{ data: { materials: Material[] } }>('materials')
      .pipe(
        map((materialsDTO) => {
          const materials = materialsDTO.data.materials.map(
            (rawMaterial: any) => {
              return Material.fromDTO(rawMaterial);
            }
          );
          const sortedMaterials: SortedMaterials =
            SortedMaterials.sortMaterials(materials);
          return sortedMaterials;
        })
      );
  }

  public getMaterials$(): Observable<Material[]> {
    return this.apiService
      .get$<{ data: { materials: Material[] } }>('materials')
      .pipe(
        map((materialsDTO) => {
          const materials = materialsDTO.data.materials.map(
            (rawMaterial: any) => {
              return Material.fromDTO(rawMaterial);
            }
          );
          return materials;
        })
      );
  }
}
