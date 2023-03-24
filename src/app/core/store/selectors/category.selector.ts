import { AppState } from 'src/app/reducer';

import { createSelector } from '@ngrx/store';

export const selectCategoryState = (state: AppState) => state.categories;

export const categoriesSelector = createSelector(
  selectCategoryState,
  (state) => state.categories
);
