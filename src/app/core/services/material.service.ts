import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { map, Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { Material, RawMaterial } from '@core/models/material.model';
import { ApiResponse } from '@core/models/api-response.model';
import {
  addItemToCategory,
  addMaterial,
  addMaterialQuestionOption,
  addMaterialQuestionOptionToProduct,
  deleteItemFromCategory,
  deleteMaterial,
  deleteMaterialQuestionOption,
  deleteProductQuestionMaterialOption,
  moveItemBetweenCategories,
  updateMaterial
} from '@core/store';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  constructor(private apiService: ApiService, private store: Store) {}

  addMaterial$(material: RawMaterial): Observable<Material> {
    const materialFormData = new FormData();
    materialFormData.append('material', JSON.stringify(material));
    materialFormData.append('image', material.image);

    return this.apiService
      .post<ApiResponse<Material>>('material/addOne', materialFormData)
      .pipe(
        map((material) => material.data),
        tap((material) => {
          this.store.dispatch(addMaterial({ material }));
          this.store.dispatch(
            addItemToCategory({
              item: material
            })
          );
          this.store.dispatch(addMaterialQuestionOption({ material }));
          this.store.dispatch(addMaterialQuestionOptionToProduct({ material }));
        })
      );
  }

  updateMaterial$(
    material: RawMaterial,
    materialId: string
  ): Observable<Material> {
    const materialFormData = new FormData();
    materialFormData.append('material', JSON.stringify(material));
    materialFormData.append('image', material.image);

    return this.apiService
      .patch<ApiResponse<Material>>(
        `material/updateOne/${materialId}`,
        materialFormData
      )
      .pipe(
        map((materialDTO) => materialDTO.data),
        tap((material) => {
          this.store.dispatch(updateMaterial({ material }));
          this.store.dispatch(
            moveItemBetweenCategories({
              item: material
            })
          );
          if (!material.isAvailable) {
            this.store.dispatch(
              deleteProductQuestionMaterialOption({ material })
            );
            this.store.dispatch(deleteMaterialQuestionOption({ material }));
          } else {
            this.store.dispatch(addMaterialQuestionOption({ material }));
            this.store.dispatch(
              addMaterialQuestionOptionToProduct({ material })
            );
          }
        })
      );
  }

  deleteMaterial$(material: Material): Observable<null> {
    return this.apiService.delete<null>('material/deleteOne', material.id).pipe(
      tap(() => {
        this.store.dispatch(deleteMaterial({ material }));
        this.store.dispatch(deleteItemFromCategory({ item: material }));
        this.store.dispatch(deleteProductQuestionMaterialOption({ material }));
      })
    );
  }

  getMaterials$(): Observable<Material[]> {
    return this.apiService
      .get<ApiResponse<Material[]>>('material/getAll')
      .pipe(map((materialsDTO) => materialsDTO.data));
  }
}
