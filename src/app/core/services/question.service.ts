import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { Question } from '@core/models/question.model';
import { Store } from '@ngrx/store';
import { addQuestion, deleteQuestion, updateQuestion } from '@core/store';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private apiService: ApiService, private store$: Store) {}

  addQuestion$(question: Question): Observable<Question> {
    return this.apiService
      .post<ApiResponse<Question>>('question/addOne', question)
      .pipe(
        map((questionDTO) => questionDTO.data),
        tap((question) => {
          this.store$.dispatch(addQuestion({ question }));
        })
      );
  }

  updateQuestion$(question: Question): Observable<Question> {
    return this.apiService
      .patch<ApiResponse<Question>>(
        `question/updateOne/${question.id}`,
        question
      )
      .pipe(
        map((questionDTO) => questionDTO.data),
        tap((question) => {
          this.store$.dispatch(updateQuestion({ question }));
        })
      );
  }

  getQuestions$(): Observable<Question[]> {
    return this.apiService
      .get<ApiResponse<Question[]>>('question/getAll')
      .pipe(map((questionsDTO) => questionsDTO.data));
  }

  deleteQuestion$(id: string): Observable<null> {
    return this.apiService.delete<null>('question/deleteOne', id).pipe(
      tap(() => {
        this.store$.dispatch(deleteQuestion({ id }));
      })
    );
  }
}
