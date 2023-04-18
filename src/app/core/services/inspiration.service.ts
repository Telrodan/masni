import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Store } from '@ngrx/store';
import { Inspiration } from '@core/models/inspiration.model';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class InspirationService {
  constructor(private apiService: ApiService, private store: Store) {}

  addInspiration$(inspiration: FormData): Observable<Inspiration> {
    return this.apiService
      .post<ApiResponse<Inspiration>>('inspiration/addOne', inspiration)
      .pipe(map((inspirationDTO) => inspirationDTO.data));
  }

  deleteInspiration$(inspiration: Inspiration): Observable<null> {
    return this.apiService
      .delete<null>('inspiration/deleteOne', inspiration._id)
      .pipe();
  }

  fetchInspirations$(): Observable<Inspiration[]> {
    return this.apiService
      .get<ApiResponse<Inspiration[]>>('inspiration/getAll')
      .pipe(map((inspirationsDTO) => inspirationsDTO.data));
  }
}
