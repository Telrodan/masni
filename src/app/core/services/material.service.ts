import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { Material, BackendMaterial } from '@core/models/material.model';
import { ApiResponse } from '@core/models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class MaterialService {
    constructor(private apiService: ApiService) {}

    addMaterial$(material: BackendMaterial): Observable<Material> {
        const materialFormData = new FormData();
        materialFormData.append('material', JSON.stringify(material));
        materialFormData.append('image', material.image);

        return this.apiService
            .post<ApiResponse<Material>>('material/addOne', materialFormData)
            .pipe(map((material) => material.data));
    }

    updateMaterial$(
        material: BackendMaterial,
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
            .pipe(map((materialDTO) => materialDTO.data));
    }

    deleteMaterial$(material: Material): Observable<null> {
        return this.apiService.delete<null>('material/deleteOne', material.id);
    }

    getMaterials$(): Observable<Material[]> {
        return this.apiService
            .get<ApiResponse<Material[]>>('material/getAll')
            .pipe(map((materialsDTO) => materialsDTO.data));
    }

    getMaterialById$(id: string): Observable<Material> {
        return this.apiService
            .get<ApiResponse<Material>>(`material/getMaterialById/${id}`)
            .pipe(map((materialDTO) => materialDTO.data));
    }

    getMaterialsByCategoryId$(categoryId: string): Observable<Material[]> {
        return this.apiService
            .get<ApiResponse<Material[]>>(
                `material/getMaterialsByCategoryId/${categoryId}`
            )
            .pipe(map((materialsDTO) => materialsDTO.data));
    }
}
