import { Injectable } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { Question } from '@core/models/question.model';
import { Store } from '@ngrx/store';
import { addQuestion, deleteQuestion } from '@core/store';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private buttonClickSubject = new Subject<void>();

  submitButtonClick$ = this.buttonClickSubject.asObservable();

  constructor(private apiService: ApiService, private store$: Store) {}

  emitButtonClick(): void {
    this.buttonClickSubject.next();
  }

  addQuestion$(question: Question): Observable<Question> {
    return this.apiService
      .post<ApiResponse<Question>>('question/addQuestion', question)
      .pipe(
        map((questionDTO) => questionDTO.data),
        tap((question) => {
          this.store$.dispatch(addQuestion({ question }));
        })
      );
  }

  getQuestions$(): Observable<Question[]> {
    return this.apiService
      .get<ApiResponse<Question[]>>('question/getQuestions')
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
