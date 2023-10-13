import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import { CategoryType } from '@core/enums/category-type.enum';
import { Category, RawCategory } from '@core/models/category.model';
import { ApiService } from './api.service';
import {
  addCategory,
  deleteCategory,
  updateCategory,
  updateInspirationsCategory,
  updateMaterialsCategory,
  updateProductsCategory
} from '@core/store';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService, private store: Store) {}

  getCategories$(): Observable<Category[]> {
    return this.apiService
      .get<ApiResponse<Category[]>>('category/getAll')
      .pipe(map((categoriesDTO) => categoriesDTO.data));
  }

  addCategory$(category: RawCategory): Observable<Category> {
    const categoryFormData = new FormData();
    categoryFormData.append('category', JSON.stringify(category));
    categoryFormData.append('image', category.image);

    return this.apiService
      .post<ApiResponse<Category>>('category/addOne', categoryFormData)
      .pipe(
        map((categoryDTO) => categoryDTO.data),
        tap((category) => {
          this.store.dispatch(addCategory({ category }));
        })
      );
  }

  updateCategory$(
    category: RawCategory,
    categoryId: string
  ): Observable<Category> {
    const categoryFormData = new FormData();
    categoryFormData.append('category', JSON.stringify(category));
    categoryFormData.append('image', category.image);

    return this.apiService
      .patch<ApiResponse<Category>>(
        `category/updateOne/${categoryId}`,
        categoryFormData
      )
      .pipe(
        map((categoriesDTO) => categoriesDTO.data),
        tap((category) => {
          this.store.dispatch(updateCategory({ category }));

          switch (category.type) {
            case CategoryType.PRODUCT_CATEGORY:
              this.store.dispatch(updateProductsCategory({ category }));
              break;
            case CategoryType.MATERIAL_CATEGORY:
              this.store.dispatch(updateMaterialsCategory({ category }));
              break;
            case CategoryType.INSPIRATION_CATEGORY:
              this.store.dispatch(updateInspirationsCategory({ category }));
              break;
          }
        })
      );
  }

  deleteCategory$(id: string): Observable<null> {
    return this.apiService.delete<null>('category/deleteOne', id).pipe(
      tap(() => {
        this.store.dispatch(deleteCategory({ id }));
      })
    );
  }
}
