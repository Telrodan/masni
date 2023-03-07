import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { filter, map, tap } from 'rxjs';

import { ApiService } from './api.service';
import coreActions from '../core-ngrx/actions';
import coreSelectors from '../core-ngrx/selectors';
import { Material } from '../models/material.model';
import { SortedMaterials } from '../models/sorted-materials.model';

interface MaterialsBackendInterface {
  data: {
    materials: Material[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  constructor(private apiService: ApiService, private store$: Store) {}

  public getMaterialsStore(): void {
    this.apiService
      .get<MaterialsBackendInterface>('materials')
      .pipe(
        map((materialsDTO) => {
          const materials = materialsDTO.data.materials.map(
            (rawMaterial: any) => {
              return Material.fromDTO(rawMaterial);
            }
          );
          return materials;
        }),
        filter((materials) => !!materials),
        tap((materials) => {
          const sortedMaterials: SortedMaterials =
            SortedMaterials.sortMaterials(materials);
          this.store$.dispatch(coreActions.setMaterials({ materials }));
          this.store$.dispatch(
            coreActions.setSortedMaterials({ sortedMaterials })
          );
          return materials;
        })
      )
      .subscribe();
  }

  public getExtraPriceById(materialId: string): number {
    let result = 0;
    this.store$
      .select(coreSelectors.selectMaterialExtraPriceById(materialId))
      .pipe(
        tap((extraPrice) => {
          result = extraPrice;
        })
      )
      .subscribe();

    return result;
  }

  public getMaterialNameById(materialId: string): string {
    let result = '';
    this.store$
      .select(coreSelectors.selectMaterialNameById(materialId))
      .pipe(
        tap((materialName) => {
          result = materialName;
        })
      )
      .subscribe();
    return result;
  }
}
