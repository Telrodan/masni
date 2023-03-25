import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { map, Observable, pipe, tap } from 'rxjs';

import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { Category } from '@core/models/category.model';
import { addCategory, deleteCategory, updateCategory } from '@core/store';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService, private store: Store) {}

  addCategory$(categoryName: string): Observable<Category> {
    const category = { categoryName };
    return this.apiService
      .post<ApiResponse<Category>>('category', category)
      .pipe(
        map((categoryDTO) => categoryDTO.data),
        tap((category) => {
          console.log(category);
          category.products = [];
          this.store.dispatch(addCategory({ category }));
        })
      );
  }

  getAllCategory$(): Observable<Category[]> {
    return this.apiService
      .get<ApiResponse<Category[]>>('category')
      .pipe(map((categoriesDTO) => categoriesDTO.data));
  }

  updateCategory$(category: Category): Observable<Category> {
    return this.apiService
      .patch<ApiResponse<Category>>(`category/${category._id}`, category)
      .pipe(
        map((categoriesDTO) => categoriesDTO.data),
        tap(() => {
          this.store.dispatch(updateCategory({ category }));
        })
      );
  }

  deleteCategory$(id: string): Observable<null> {
    return this.apiService.delete<null>('category', id).pipe(
      tap(() => {
        this.store.dispatch(deleteCategory({ id }));
      })
    );
  }
}
