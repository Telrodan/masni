import { AppState } from 'src/app/reducer';

import { createSelector } from '@ngrx/store';

export const selectCategoryState = (state: AppState) => state.categories;

export const selectAllCategories = createSelector(
  selectCategoryState,
  (state) => state.categories
);
