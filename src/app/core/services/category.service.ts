import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';

import { addCategory, deleteCategory, updateCategory } from '@core/store';
import { ApiResponse } from '@core/models/api-response.model';
import { Category } from '@core/models/category.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService, private store: Store) {}

  addCategory$(category: FormData): Observable<Category> {
    return this.apiService
      .post<ApiResponse<Category>>('category/addOne', category)
      .pipe(
        map((categoryDTO) => categoryDTO.data),
        tap((category) => {
          this.store.dispatch(addCategory({ category }));
        })
      );
  }

  updateCategory$(
    category: FormData,
    categoryId: string
  ): Observable<Category> {
    return this.apiService
      .patch<ApiResponse<Category>>(
        `category/updateOne/${categoryId}`,
        category
      )
      .pipe(
        map((categoriesDTO) => categoriesDTO.data),
        tap((category) => {
          this.store.dispatch(updateCategory({ category }));
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

  getCategories$(): Observable<Category[]> {
    return this.apiService
      .get<ApiResponse<Category[]>>('category/getAll')
      .pipe(map((categoriesDTO) => categoriesDTO.data));
  }
}
