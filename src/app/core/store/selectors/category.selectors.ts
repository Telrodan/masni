import { AppState } from '@core/store/app-state';

import { createSelector } from '@ngrx/store';

export const selectCategoryState = (state: AppState) => state.categories;

export const selectAllCategories = createSelector(
  selectCategoryState,
  (state) => state.categories
);
