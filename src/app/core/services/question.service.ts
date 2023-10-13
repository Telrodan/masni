import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { Question, RawQuestion } from '@core/models/question.model';
import { Store } from '@ngrx/store';
import {
  addQuestion,
  deleteQuestion,
  removeQuestionFromProduct,
  updateProductsQuestion,
  updateQuestion
} from '@core/store';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private apiService: ApiService, private store$: Store) {}

  addQuestion$(question: RawQuestion): Observable<Question> {
    return this.apiService
      .post<ApiResponse<Question>>('question/addOne', question)
      .pipe(
        map((questionDTO) => questionDTO.data),
        tap((question) => {
          this.store$.dispatch(addQuestion({ question }));
        })
      );
  }

  updateQuestion$(id: string, question: RawQuestion): Observable<Question> {
    return this.apiService
      .patch<ApiResponse<Question>>(`question/updateOne/${id}`, question)
      .pipe(
        map((questionDTO) => questionDTO.data),
        tap((question) => {
          console.log(question);
          this.store$.dispatch(updateQuestion({ question }));
          this.store$.dispatch(updateProductsQuestion({ question }));
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
        this.store$.dispatch(removeQuestionFromProduct({ id }));
      })
    );
  }
}
