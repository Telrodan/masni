import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state.model';

const selectQuestionState = (state: AppState) => state.question;

export const QuestionSelector = {
    selectQuestions: () =>
        createSelector(selectQuestionState, (questionState) => questionState.questions),

    selectQuestionById: (id: string) =>
        createSelector(selectQuestionState, (questionState) =>
            questionState.questions.find((question) => question.id === id)
        ),

    isBusy: () =>
        createSelector(selectQuestionState, (questionState): boolean => questionState.isBusy)
};
