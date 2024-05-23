import { createSelector } from '@ngrx/store';

import { AppState } from '../app-state.model';
import { Category } from '@core/models/category.model';

const selectCategoryState = (state: AppState) => state.category;

export const CategorySelector = {
    selectCategories: () =>
        createSelector(selectCategoryState, (categoryState) => categoryState.categories),

    selectCategoryById: (categoryId: string) =>
        createSelector(
            selectCategoryState,
            (categoryState): Category =>
                categoryState.categories.find((category) => category.id === categoryId)
        ),

    isBusy: () =>
        createSelector(selectCategoryState, (categoryState): boolean => categoryState.isBusy)
};
