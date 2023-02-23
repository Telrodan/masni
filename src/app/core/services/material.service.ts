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

  constructor(private apiService: ApiService) {}

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
        }),
        tap((materials) => {
          this.materials = materials;
        })
      );
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

  public getExtraPriceById(materialId: string): number {
    let extraPrice = 0;
    const material = this.materials.find(
      (material) => material.id === materialId
    );
    if (!material) return extraPrice;
    extraPrice = material.extra;
    return extraPrice;
  }

  public getMaterialNameById(materialId: string): string {
    const material = this.materials.find(
      (material) => material.id === materialId
    );
    if (!material) return materialId;
    return material.name;
  }
}
