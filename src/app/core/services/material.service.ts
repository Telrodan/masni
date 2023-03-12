import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { filter, map, Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { Material } from '../models/material.model';
import { SortedMaterials } from '../models/sorted-materials.model';
import { materialExtraByNameSelector } from '@core/store/selectors/material.selector';

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

  public getMaterials(): Observable<Material[]> {
    return this.apiService
      .get<MaterialsBackendInterface>('materials')
      .pipe(map((materialsDTO) => materialsDTO.data.materials));
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
}
