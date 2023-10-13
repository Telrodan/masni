import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';

export const selectQuestionState = (state: AppState) => state.question;

export const selectAllQuestion = createSelector(
  selectQuestionState,
  (state) => state.questions
);

export const selectQuestionOptionExtraPriceByOptionId = (id: string) =>
  createSelector(selectAllQuestion, (questions) => {
    let optionExtraPrice = 0;
    questions.forEach((question) => {
      question.options.forEach((option) => {
        if (option._id === id) {
          optionExtraPrice = option.extraPrice;
        }
      });
    });
    return optionExtraPrice;
  });
