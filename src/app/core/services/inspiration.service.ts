import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, map, tap } from 'rxjs';

import {
  addInspiration,
  addItemToCategory,
  deleteInspiration,
  moveItemBetweenCategories,
  updateInspiration
} from '@core/store';
import { Inspiration } from '@core/models/inspiration.model';
import { ApiResponse } from '@core/models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InspirationService {
  constructor(private apiService: ApiService, private store: Store) {}

  addInspiration$(inspiration: FormData): Observable<Inspiration> {
    return this.apiService
      .post<ApiResponse<Inspiration>>('inspiration/addOne', inspiration)
      .pipe(
        map((inspirationDTO) => inspirationDTO.data),
        tap((inspiration) => {
          this.store.dispatch(addInspiration({ inspiration }));
          this.store.dispatch(
            addItemToCategory({
              itemId: inspiration.id,
              categoryId: inspiration.categoryId
            })
          );
        })
      );
  }

  updateInspiration$(inspiration: FormData): Observable<Inspiration> {
    return this.apiService
      .patch<ApiResponse<Inspiration>>(
        `inspiration/updateOne/${inspiration.get('id')}`,
        inspiration
      )
      .pipe(
        map((inspirationDTO) => inspirationDTO.data),
        tap((inspiration) => {
          this.store.dispatch(updateInspiration({ inspiration }));
          this.store.dispatch(
            moveItemBetweenCategories({
              itemId: inspiration.id,
              categoryId: inspiration.categoryId
            })
          );
        })
      );
  }

  deleteInspiration$(inspiration: Inspiration): Observable<null> {
    return this.apiService
      .delete<null>('inspiration/deleteOne', inspiration.id)
      .pipe(
        tap(() => {
          this.store.dispatch(deleteInspiration({ id: inspiration.id }));
        })
      );
  }

  getInspirations$(): Observable<Inspiration[]> {
    return this.apiService
      .get<ApiResponse<Inspiration[]>>('inspiration/getAll')
      .pipe(map((inspirationsDTO) => inspirationsDTO.data));
  }
}
