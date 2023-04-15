import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { map, Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { Material } from '@core/models/material.model';
import { materialExtraByNameSelector } from '@core/store/selectors/material.selectors';
import { ApiResponse } from '@core/models/api-response.model';
import { addMaterial, deleteMaterial, updateMaterial } from '@core/store';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  constructor(private apiService: ApiService, private store: Store) {}

  addMaterial$(material: any): Observable<Material> {
    return this.apiService
      .post<ApiResponse<Material>>('material/addOne', material)
      .pipe(
        map((material) => material.data),
        tap((material) => {
          this.store.dispatch(addMaterial({ material }));
        })
      );
  }

  updateMaterial$(material: Material): Observable<Material> {
    return this.apiService
      .patch<ApiResponse<Material>>(
        `material/updateOne/${material._id}`,
        material
      )
      .pipe(
        map((materialDTO) => materialDTO.data),
        tap((material) => {
          this.store.dispatch(updateMaterial({ material }));
        })
      );
  }

  deleteMaterial$(material: Material): Observable<null> {
    return this.apiService
      .delete<null>('material/deleteOne', material._id)
      .pipe(
        tap(() => {
          this.store.dispatch(deleteMaterial({ material }));
        })
      );
  }

  fetchMaterials$(): Observable<Material[]> {
    return this.apiService
      .get<ApiResponse<Material[]>>('material')
      .pipe(map((materialsDTO) => materialsDTO.data));
  }

  public getExtraPriceByName(name: string): number {
    let result = 0;
    this.store
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
