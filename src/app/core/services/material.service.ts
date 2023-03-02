import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import coreSelectors from '../core-ngrx/selectors';
import { Material } from '../models/material.model';
import { SortedMaterials } from '../models/sorted-materials.model';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private materials: Material[];

  constructor(private apiService: ApiService, private store$: Store) {}

  public getMaterials$(): Observable<Material[]> {
    return this.apiService
      .get<{ data: { materials: Material[] } }>('materials')
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
      .get<{ data: { materials: Material[] } }>('materials')
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

  public getMaterialsStore$(): Observable<Material[]> {
    return this.apiService
      .get<{ data: { materials: Material[] } }>('materials')
      .pipe(
        map((materialsDTO) => {
          const materials = materialsDTO.data.materials.map(
            (rawMaterial: Material) => {
              return Material.fromDTO(rawMaterial);
            }
          );
          return materials;
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
    let result = null;
    this.store$
      .select(coreSelectors.selectMaterialById(materialId))
      .subscribe((respond) => {
        result = respond;
      });

    return result;
  }
}
