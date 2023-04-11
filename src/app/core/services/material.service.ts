import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { map, Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { Material } from '@core/models/material.model';
import { materialExtraByNameSelector } from '@core/store/selectors/material.selector';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  constructor(private apiService: ApiService, private store$: Store) {}

  fetchMaterials$(): Observable<Material[]> {
    return this.apiService
      .get<ApiResponse<Material[]>>('materials')
      .pipe(map((materialsDTO) => materialsDTO.data));
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
