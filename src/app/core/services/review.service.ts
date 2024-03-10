import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BackendReview, Review } from '@core/models/review.model';
import { ApiResponse } from '@core/models/api-response.model';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    constructor(private apiService: ApiService) {}

    addReview$(review: BackendReview): Observable<Review> {
        return this.apiService
            .post<ApiResponse<Review>>('review/addReview', review)
            .pipe(map((reviewDTO) => reviewDTO.data));
    }
}
