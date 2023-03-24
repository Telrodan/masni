import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/models/api-response.model';
import { Category } from '@core/models/category.model';
import { map, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  addCategory$(categoryName: string): Observable<Category> {
    const category = { categoryName };
    return this.apiService
      .post<ApiResponse<Category>>('category', category)
      .pipe(map((categoryDTO) => categoryDTO.data));
  }

  getAllCategory$(): Observable<Category[]> {
    return this.apiService
      .get<ApiResponse<Category[]>>('category')
      .pipe(map((categoriesDTO) => categoriesDTO.data));
  }

  deleteCategory$(id: string): Observable<null> {
    return this.apiService.delete<null>('category', id);
  }
}
