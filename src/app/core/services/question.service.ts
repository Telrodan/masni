import { Injectable, inject } from '@angular/core';

import { Observable, map } from 'rxjs';

import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { Question } from '@core/store/question/question.model';

const ROUTE_PREFIX = 'questions';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    private readonly apiService = inject(ApiService);

    addQuestion$(question: Question): Observable<Question> {
        return this.apiService
            .post<ApiResponse<Question>>(`${ROUTE_PREFIX}/addOne`, question)
            .pipe(map((questionDTO) => questionDTO.data));
    }

    updateQuestion$(question: Question): Observable<Question> {
        return this.apiService
            .patch<ApiResponse<Question>>(`${ROUTE_PREFIX}/updateOne/${question.id}`, question)
            .pipe(map((questionDTO) => questionDTO.data));
    }

    deleteQuestion$(id: string): Observable<null> {
        return this.apiService.delete<null>(`${ROUTE_PREFIX}/deleteOne`, id);
    }

    getQuestions$(): Observable<Question[]> {
        return this.apiService
            .get<ApiResponse<Question[]>>(`${ROUTE_PREFIX}/getAll`)
            .pipe(map((questionsDTO) => questionsDTO.data));
    }
}
