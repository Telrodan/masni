import { createSelector } from '@ngrx/store';

import { AppState } from '../app-state.model';
import { CategoryType } from '@core/enums/category-type.enum';
import { Category } from './category.model';

const selectCategoryState = (state: AppState) => state.category;

export const CategorySelector = {
    selectCategories: () =>
        createSelector(selectCategoryState, (categoryState) => categoryState.categories),

    selectNavbarMenu: () =>
        createSelector(selectCategoryState, (categoryState) => categoryState.navbarMenu),

    selectCategoryById: (categoryId: string) =>
        createSelector(
            selectCategoryState,
            (categoryState): Category =>
                categoryState.categories.find((category) => category.id === categoryId)
        ),

    selectMainProductCategories: () =>
        createSelector(selectCategoryState, (categoryState): Category[] =>
            categoryState.categories.filter(
                (category) => category.type === CategoryType.Product && !category.isSubCategory
            )
        ),

    isBusy: () =>
        createSelector(selectCategoryState, (categoryState): boolean => categoryState.isBusy)
};
