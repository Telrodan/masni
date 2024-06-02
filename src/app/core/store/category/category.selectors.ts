import { createSelector } from '@ngrx/store';

import { AppState } from '../app-state.model';
import {
    Category,
    CategoryType,
    InspirationCategory,
    MaterialCategory,
    ProductCategory
} from './category.model';

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
        createSelector(
            selectCategoryState,
            (categoryState): ProductCategory[] =>
                categoryState.categories.filter(
                    (category) => category.type === CategoryType.Product && category.isMainCategory
                ) as ProductCategory[]
        ),

    selectProductSubCategories: () =>
        createSelector(
            selectCategoryState,
            (categoryState): ProductCategory[] =>
                categoryState.categories.filter(
                    (category) => category.type === CategoryType.Product && !category.isMainCategory
                ) as ProductCategory[]
        ),

    selectMaterialCategories: () =>
        createSelector(
            selectCategoryState,
            (categoryState): MaterialCategory[] =>
                categoryState.categories.filter(
                    (category) => category.type === CategoryType.Material
                ) as MaterialCategory[]
        ),

    selectInspirationCategories: () =>
        createSelector(
            selectCategoryState,
            (categoryState): InspirationCategory[] =>
                categoryState.categories.filter(
                    (category) => category.type === CategoryType.Inspiration
                ) as InspirationCategory[]
        ),

    isBusy: () =>
        createSelector(selectCategoryState, (categoryState): boolean => categoryState.isBusy)
};
