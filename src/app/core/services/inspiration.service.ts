import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, map, tap } from 'rxjs';

import {
  addInspiration,
  addItemToCategory,
  deleteInspiration,
  deleteItemFromCategory,
  moveItemBetweenCategories,
  updateInspiration
} from '@core/store';
import { Inspiration, RawInspiration } from '@core/models/inspiration.model';
import { ApiResponse } from '@core/models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InspirationService {
  constructor(private apiService: ApiService, private store: Store) {}

  addInspiration$(inspiration: RawInspiration): Observable<Inspiration> {
    const inspirationFormData = new FormData();
    inspirationFormData.append('inspiration', JSON.stringify(inspiration));
    inspirationFormData.append('image', inspiration.image);

    return this.apiService
      .post<ApiResponse<Inspiration>>('inspiration/addOne', inspirationFormData)
      .pipe(
        map((inspirationDTO) => inspirationDTO.data),
        tap((inspiration) => {
          this.store.dispatch(addInspiration({ inspiration }));
          this.store.dispatch(
            addItemToCategory({
              item: inspiration
            })
          );
        })
      );
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
      .pipe(
        map((inspirationDTO) => inspirationDTO.data),
        tap((inspiration) => {
          this.store.dispatch(updateInspiration({ inspiration }));
          this.store.dispatch(
            moveItemBetweenCategories({
              item: inspiration
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
          this.store.dispatch(deleteItemFromCategory({ item: inspiration }));
        })
      );
  }

  getInspirations$(): Observable<Inspiration[]> {
    return this.apiService
      .get<ApiResponse<Inspiration[]>>('inspiration/getAll')
      .pipe(map((inspirationsDTO) => inspirationsDTO.data));
  }
}
