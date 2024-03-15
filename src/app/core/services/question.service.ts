import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { Question, BackendQuestion } from '@core/models/question.model';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    constructor(private apiService: ApiService) {}

    addQuestion$(question: BackendQuestion): Observable<Question> {
        return this.apiService
            .post<ApiResponse<Question>>('question/addOne', question)
            .pipe(map((questionDTO) => questionDTO.data));
    }

    updateQuestion$(
        id: string,
        question: BackendQuestion
    ): Observable<Question> {
        return this.apiService
            .patch<ApiResponse<Question>>(`question/updateOne/${id}`, question)
            .pipe(map((questionDTO) => questionDTO.data));
    }

    getQuestions$(): Observable<Question[]> {
        return this.apiService
            .get<ApiResponse<Question[]>>('question/getAllQuestions')
            .pipe(map((questionsDTO) => questionsDTO.data));
    }

    getQuestionById$(id: string): Observable<Question> {
        return this.apiService
            .get<ApiResponse<Question>>(`question/getQuestionById/${id}`)
            .pipe(map((questionDTO) => questionDTO.data));
    }

    deleteQuestion$(id: string): Observable<null> {
        return this.apiService.delete<null>('question/deleteOne', id).pipe();
    }
}
