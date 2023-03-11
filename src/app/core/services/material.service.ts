import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { filter, map, Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { MaterialInterface } from '../models/material.model';
import { SortedMaterials } from '../models/sorted-materials.model';
import { selectMaterialExtraPriceByName } from '@core/store/selectors/core.selectors';
import { materialExtraByNameSelector } from '@core/store/selectors/material.selector';

interface MaterialsBackendInterface {
  data: {
    materials: MaterialInterface[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  constructor(private apiService: ApiService, private store$: Store) {}

  public getMaterials(): Observable<MaterialInterface[]> {
    return this.apiService
      .get<MaterialsBackendInterface>('materials')
      .pipe(map((materialsDTO) => materialsDTO.data.materials));
  }

  public setMaterialsStore(): Observable<MaterialInterface[]> {
    return this.apiService.get<MaterialsBackendInterface>('materials').pipe(
      map((materialsDTO) => {
        const { materials } = materialsDTO.data;
        return materials;
      }),
      filter((materials) => !!materials),
      tap((materials) => {
        const sortedMaterials: SortedMaterials =
          SortedMaterials.sortMaterials(materials);
        // this.store$.dispatch(LoadMaterials({ materials }));
      })
    );
  }

  public getExtraPriceByName(name: string): number {
    let result = 0;
    this.store$
      .select(materialExtraByNameSelector(name))
      .pipe(
        tap((extraPrice) => {
          result = extraPrice;
        })
      )
      .subscribe();

    return result;
  }

  // public getMaterialNameById(materialId: string): string {
  //   let result = '';
  //   this.store$
  //     .select(coreSelectors.selectMaterialNameById(materialId))
  //     .pipe(
  //       tap((materialName) => {
  //         result = materialName;
  //       })
  //     )
  //     .subscribe();
  //   return result;
  // }
}
