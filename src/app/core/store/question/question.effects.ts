import { Injectable, inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';

import { QuestionAction } from './question.actions';
import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';

@Injectable()
export class QuestionEffects {
    private readonly actions$ = inject(Actions);
    private readonly questionService = inject(QuestionService);
    private readonly toastr = inject(ToastrService);

    addQuestion$ = createEffect(() =>
        this.actions$.pipe(
            ofType(QuestionAction.addQuestion),
            exhaustMap((action) =>
                this.questionService.addQuestion$(action.question).pipe(
                    map((question) => {
                        this.toastr.success('Kérdés sikeresen hozzáadva.');
                        return QuestionAction.addQuestionSuccess({ question });
                    })
                )
            )
        )
    );

    updateQuestion$ = createEffect(() =>
        this.actions$.pipe(
            ofType(QuestionAction.updateQuestion),
            exhaustMap((action) =>
                this.questionService.updateQuestion$(action.question).pipe(
                    map((question) => {
                        this.toastr.success(`${question.name} sikeresen frissítve.`);
                        return QuestionAction.updateQuestionSuccess({ question });
                    })
                )
            )
        )
    );

    deleteQuestion$ = createEffect(() =>
        this.actions$.pipe(
            ofType(QuestionAction.deleteQuestion),
            exhaustMap((action) =>
                this.questionService.deleteQuestion$(action.id).pipe(
                    map(() => {
                        this.toastr.success(`${action.id} sikeresen törölve.`);
                        return QuestionAction.deleteQuestionSuccess({ id: action.id });
                    })
                )
            )
        )
    );

    getQuestions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(QuestionAction.getQuestions),
            exhaustMap(() =>
                this.questionService
                    .getQuestions$()
                    .pipe(map((questions) => QuestionAction.getQuestionsSuccess({ questions })))
            )
        )
    );
}
