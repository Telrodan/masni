import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';

export const selectQuestionState = (state: AppState) => state.questions;

export const selectAllQuestion = createSelector(
  selectQuestionState,
  (state) => state.questions
);
