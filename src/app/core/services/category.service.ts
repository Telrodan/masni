import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';

import { ApiService } from './api.service';
import { CategoryOrderData } from '@features/admin/components/categories/order-categories/order-categories.component';
import { createFormDataFromObject } from '@shared/util/create-form-data-from-object.util';
import { NavbarMenuItem } from '@core/models/navbar-menu-item.model';
import {
    Category,
    ProductCategory,
    InspirationCategory,
    MaterialCategory
} from '@core/store/category/category.model';

const ROUTE_SUFFIX = 'categories';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private apiService: ApiService) {}

    addCategory$(category: Category): Observable<Category> {
        const categoryFormData = createFormDataFromObject(category);

        return this.apiService
            .post<ApiResponse<Category>>(`${ROUTE_SUFFIX}/addOne`, categoryFormData)
            .pipe(map((categoryDTO) => categoryDTO.data));
    }

    updateCategory$(category: Category): Observable<Category> {
        const categoryFormData = createFormDataFromObject(category);

        return this.apiService
            .patch<ApiResponse<Category>>(
                `${ROUTE_SUFFIX}/updateOne/${category.id}`,
                categoryFormData
            )
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

    updateCategoriesOrder$(categoryOrderData: CategoryOrderData): Observable<null> {
        return this.apiService
            .patch<ApiResponse<null>>(`${ROUTE_SUFFIX}/updateOrder`, categoryOrderData)
            .pipe(map((categoryDTO) => categoryDTO.data));
    }

    deleteCategory$(id: string): Observable<ApiResponse<string>> {
        return this.apiService.delete<ApiResponse<string>>('categories/deleteOne', id);
    }

    getNavbarMenu$() {
        return this.apiService
            .get<ApiResponse<NavbarMenuItem[]>>(`${ROUTE_SUFFIX}/navbarMenu`)
            .pipe(map((navbarDTO) => navbarDTO.data));
    }
}
