import { Injectable } from '@angular/core';
import { QuestionService } from '@core/services/question.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, catchError, of } from 'rxjs';
import {
  getQuestions,
  getQuestionsError,
  getQuestionsSuccess
} from '../actions';

@Injectable()
export class QuestionEffects {
  constructor(
    private actions$: Actions,
    private questionService: QuestionService
  ) {}

  getQuestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getQuestions),
      exhaustMap(() =>
        this.questionService.getQuestions$().pipe(
          map((questions) => getQuestionsSuccess({ questions })),
          catchError(() => of(getQuestionsError()))
        )
      )
    )
  );
}
