import { createAction, props } from '@ngrx/store';

import { Question } from './question.model';

const ACTION_PREFIX = '[Question]';

export const QuestionAction = {
    getQuestions: createAction(`${ACTION_PREFIX} Get Questions`),

    getQuestionsSuccess: createAction(
        `${ACTION_PREFIX} Get Questions Success`,
        props<{ questions: Question[] }>()
    ),

    addQuestion: createAction(`${ACTION_PREFIX} Add Question`, props<{ question: Question }>()),

    addQuestionSuccess: createAction(
        `${ACTION_PREFIX} Add Question Success`,
        props<{ question: Question }>()
    ),

    updateQuestion: createAction(
        `${ACTION_PREFIX} Update Question`,
        props<{ question: Question }>()
    ),

    updateQuestionSuccess: createAction(
        `${ACTION_PREFIX} Update Question Success`,
        props<{ question: Question }>()
    ),

    deleteQuestion: createAction(
        `${ACTION_PREFIX} Delete Question`,
        props<{ id: string; name: string }>()
    ),

    deleteQuestionSuccess: createAction(
        `${ACTION_PREFIX} Delete Question Success`,
        props<{ id: string }>()
    )
};
