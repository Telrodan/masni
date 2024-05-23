import { Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import {
    Category,
    InspirationCategory,
    MaterialCategory,
    ProductCategory
} from '@core/models/category.model';
import { ApiService } from './api.service';
import { CategoryOrderData } from '@features/admin/components/categories/order-categories/order-categories.component';
import { createFormDataFromObject } from '@shared/util/create-form-data-from-object.util';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private apiService: ApiService) {}

    addCategory$(category: Category): Observable<Category> {
        const categoryFormData = createFormDataFromObject(category);

        return this.apiService
            .post<ApiResponse<Category>>('categories/addOne', categoryFormData)
            .pipe(map((categoryDTO) => categoryDTO.data));
    }

    getCategoryById$(id: string): Observable<Category> {
        return this.apiService
            .get<ApiResponse<Category>>(`category/getCategoryById/${id}`)
            .pipe(map((categoryDTO) => categoryDTO.data));
    }

    getCategories$(): Observable<Category[]> {
        return this.apiService
            .get<ApiResponse<Category[]>>('categories/getAll')
            .pipe(map((categoriesDTO) => categoriesDTO.data));
    }

    getProductCategories$(): Observable<ProductCategory[]> {
        return this.apiService
            .get<ApiResponse<ProductCategory[]>>('category/getProductCategories')
            .pipe(map((categoriesDTO) => categoriesDTO.data));
    }

    getInspirationCategories$(): Observable<InspirationCategory[]> {
        return this.apiService
            .get<ApiResponse<InspirationCategory[]>>('category/getInspirationCategories')
            .pipe(map((categoriesDTO) => categoriesDTO.data));
    }

    getMaterialCategories$(): Observable<MaterialCategory[]> {
        return this.apiService
            .get<ApiResponse<MaterialCategory[]>>('category/getMaterialCategories')
            .pipe(map((categoriesDTO) => categoriesDTO.data));
    }

    updateCategory$(category: Category, categoryId: string): Observable<Category> {
        const categoryFormData = new FormData();
        categoryFormData.append('category', JSON.stringify(category));
        categoryFormData.append('image', category.image);

        return this.apiService
            .patch<ApiResponse<Category>>(`category/updateCategory/${categoryId}`, categoryFormData)
            .pipe(map((categoryDTO) => categoryDTO.data));
    }

    updateCategoriesOrder$(categoryOrderData: CategoryOrderData): Observable<null> {
        return this.apiService
            .patch<ApiResponse<null>>('category/updateCategoriesOrder', {
                categoryOrderData
            })
            .pipe(map((categoryDTO) => categoryDTO.data));
    }

    deleteCategory$(id: string): Observable<null> {
        return this.apiService.delete<null>('categories/deleteOne', id);
    }
}
