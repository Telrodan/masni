import { createReducer, on } from '@ngrx/store';

import { cloneDeep } from 'lodash';

import { QuestionAction } from './question.actions';
import { QuestionState } from './question.model';

export const questionInitialState: QuestionState = {
    questions: [],
    isBusy: false
};

export const questionReducers = createReducer(
    questionInitialState,
    on(QuestionAction.getQuestions, (state) => ({
        ...state,
        isBusy: true
    })),

    on(QuestionAction.getQuestionsSuccess, (state, action) => ({
        ...state,
        questions: [...action.questions],
        isBusy: false
    })),

    on(QuestionAction.addQuestion, (state) => ({
        ...state,
        isBusy: true
    })),

    on(QuestionAction.addQuestionSuccess, (state, action) => ({
        ...state,
        questions: [...state.questions, action.question],
        isBusy: false
    })),

    on(QuestionAction.updateQuestion, (state) => ({
        ...state,
        isBusy: true
    })),

    on(QuestionAction.updateQuestionSuccess, (state, action) => {
        const stateClone = cloneDeep(state);
        const questionIndex = stateClone.questions.findIndex(
            (question) => question.id === action.question.id
        );

        stateClone.questions[questionIndex] = action.question;

        return {
            ...stateClone,
            isBusy: false
        };
    }),

    on(QuestionAction.deleteQuestion, (state) => ({
        ...state,
        isBusy: true
    })),

    on(QuestionAction.deleteQuestionSuccess, (state, action) => ({
        ...state,
        questions: state.questions.filter((question) => question.id !== action.id),
        isBusy: false
    }))
);
