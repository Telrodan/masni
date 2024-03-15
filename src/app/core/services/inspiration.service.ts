import { Injectable } from '@angular/core';

import { Observable, map, tap } from 'rxjs';

import { Inspiration, RawInspiration } from '@core/models/inspiration.model';
import { ApiResponse } from '@core/models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class InspirationService {
    constructor(private apiService: ApiService) {}

    addInspiration$(inspiration: RawInspiration): Observable<Inspiration> {
        const inspirationFormData = new FormData();
        inspirationFormData.append('inspiration', JSON.stringify(inspiration));
        inspirationFormData.append('image', inspiration.image);

        return this.apiService
            .post<ApiResponse<Inspiration>>(
                'inspiration/addOne',
                inspirationFormData
            )
            .pipe(map((inspirationDTO) => inspirationDTO.data));
    }

    updateInspiration$(
        inspiration: RawInspiration,
        inspirationId: string
    ): Observable<Inspiration> {
        const inspirationFormData = new FormData();
        inspirationFormData.append('inspiration', JSON.stringify(inspiration));
        inspirationFormData.append('image', inspiration.image);

        return this.apiService
            .patch<ApiResponse<Inspiration>>(
                `inspiration/updateOne/${inspirationId}`,
                inspirationFormData
            )
            .pipe(map((inspirationDTO) => inspirationDTO.data));
    }

    deleteInspiration$(inspiration: Inspiration): Observable<null> {
        return this.apiService
            .delete<null>('inspiration/deleteOne', inspiration.id)
            .pipe();
    }

    getInspirations$(): Observable<Inspiration[]> {
        return this.apiService
            .get<ApiResponse<Inspiration[]>>('inspiration/getAll')
            .pipe(map((inspirationsDTO) => inspirationsDTO.data));
    }

    getInspirationById$(id: string): Observable<Inspiration> {
        return this.apiService
            .get<ApiResponse<Inspiration>>(
                `inspiration/getInspirationById/${id}`
            )
            .pipe(map((inspirationDTO) => inspirationDTO.data));
    }
}
