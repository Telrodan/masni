import { Injectable } from '@angular/core';
import { QuestionWithStringAnswer } from '@core/models/question-with-string-answer.model';
import { Observable, Subject, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private buttonClickSubject = new Subject<void>();

  submitButtonClick$ = this.buttonClickSubject.asObservable();

  constructor(private apiService: ApiService) {}

  emitButtonClick(): void {
    this.buttonClickSubject.next();
  }

  addQuestionWithStringAnswer(
    question: QuestionWithStringAnswer
  ): Observable<QuestionWithStringAnswer> {
    return this.apiService
      .post<ApiResponse<QuestionWithStringAnswer>>(
        'question/addQuestionWithStringAnswer',
        question
      )
      .pipe(
        map((questionDTO) => questionDTO.data),
        tap((question) => {
          // TODO: dispatch action
        })
      );
  }
}
