import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import { ApiService } from './api.service';
import { Material } from '@core/store/material/material.model';
import { createFormDataFromObject } from '@shared/util/create-form-data-from-object.util';

const ROUTE_PREFIX = 'materials';

@Injectable({
    providedIn: 'root'
})
export class MaterialService {
    constructor(private apiService: ApiService) {}

    addMaterial$(material: Material): Observable<Material> {
        const materialFormData = createFormDataFromObject(material);

        return this.apiService
            .post<ApiResponse<Material>>(`${ROUTE_PREFIX}/addOne`, materialFormData)
            .pipe(map((materialDTO) => materialDTO.data));
    }

    updateMaterial$(material: Material): Observable<Material> {
        const materialFormData = createFormDataFromObject(material);

        return this.apiService
            .patch<ApiResponse<Material>>(
                `${ROUTE_PREFIX}/updateOne/${material.id}`,
                materialFormData
            )
            .pipe(map((materialDTO) => materialDTO.data));
    }

    deleteMaterial$(id: string): Observable<null> {
        return this.apiService.delete<null>(`${ROUTE_PREFIX}/deleteOne`, id);
    }

    getMaterials$(): Observable<Material[]> {
        return this.apiService
            .get<ApiResponse<Material[]>>(`${ROUTE_PREFIX}/getAll`)
            .pipe(map((materialsDTO) => materialsDTO.data));
    }
}
