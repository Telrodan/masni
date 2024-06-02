import { Injectable, inject } from '@angular/core';

import { Observable, map } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import { Inspiration } from '@core/store/inspiration/inspiration.model';
import { createFormDataFromObject } from '@shared/util/create-form-data-from-object.util';
import { ApiService } from './api.service';

const ROUTE_PREFIX = 'inspirations';

@Injectable({
    providedIn: 'root'
})
export class InspirationService {
    private readonly apiService = inject(ApiService);

    addInspiration$(inspiration: Inspiration): Observable<Inspiration> {
        const inspirationFormData = createFormDataFromObject(inspiration);

        return this.apiService
            .post<ApiResponse<Inspiration>>(`${ROUTE_PREFIX}/addOne`, inspirationFormData)
            .pipe(map((inspirationDTO) => inspirationDTO.data));
    }

    updateInspiration$(inspiration: Inspiration): Observable<Inspiration> {
        const inspirationFormData = createFormDataFromObject(inspiration);

        return this.apiService
            .patch<ApiResponse<Inspiration>>(
                `${ROUTE_PREFIX}/updateOne/${inspiration.id}`,
                inspirationFormData
            )
            .pipe(map((inspirationDTO) => inspirationDTO.data));
    }

    deleteInspiration$(id: string): Observable<null> {
        return this.apiService.delete<null>(`${ROUTE_PREFIX}/deleteOne`, id);
    }

    getInspirations$(): Observable<Inspiration[]> {
        return this.apiService
            .get<ApiResponse<Inspiration[]>>(`${ROUTE_PREFIX}/getAll`)
            .pipe(map((inspirationsDTO) => inspirationsDTO.data));
    }
}
