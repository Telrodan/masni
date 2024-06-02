import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { Category, CategoryOrderData } from '@core/store/category/category.model';
import { NavbarMenuItem } from '@core/models/navbar-menu-item.model';
import { createFormDataFromObject } from '@shared/util/create-form-data-from-object.util';

const ROUTE_PREFIX = 'categories';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly apiService = inject(ApiService);

    addCategory$(category: Category): Observable<Category> {
        const categoryFormData = createFormDataFromObject(category);

        return this.apiService
            .post<ApiResponse<Category>>(`${ROUTE_PREFIX}/addOne`, categoryFormData)
            .pipe(map((categoryDTO) => categoryDTO.data));
    }

    updateCategory$(category: Category): Observable<Category> {
        const categoryFormData = createFormDataFromObject(category);

        return this.apiService
            .patch<ApiResponse<Category>>(
                `${ROUTE_PREFIX}/updateOne/${category.id}`,
                categoryFormData
            )
            .pipe(map((categoryDTO) => categoryDTO.data));
    }

    deleteCategory$(id: string): Observable<string> {
        return this.apiService
            .delete<ApiResponse<string>>(`${ROUTE_PREFIX}/deleteOne`, id)
            .pipe(map((categoryDTO) => categoryDTO.data));
    }

    getCategories$(): Observable<Category[]> {
        return this.apiService
            .get<ApiResponse<Category[]>>(`${ROUTE_PREFIX}/getAll`)
            .pipe(map((categoriesDTO) => categoriesDTO.data));
    }

    updateCategoriesOrder$(categoryOrderData: CategoryOrderData): Observable<null> {
        return this.apiService
            .patch<ApiResponse<null>>(`${ROUTE_PREFIX}/updateOrder`, categoryOrderData)
            .pipe(map((categoryDTO) => categoryDTO.data));
    }

    getNavbarMenu$() {
        return this.apiService
            .get<ApiResponse<NavbarMenuItem[]>>(`${ROUTE_PREFIX}/navbarMenu`)
            .pipe(map((navbarDTO) => navbarDTO.data));
    }
}
