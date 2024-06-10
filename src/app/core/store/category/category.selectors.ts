import { createSelector } from '@ngrx/store';

import { AppState } from '../app-state.model';
import {
    Category,
    CategoryType,
    InspirationCategory,
    MaterialCategory,
    ProductCategory
} from './category.model';
import { ProductSelector } from '../product';
import { MaterialSelector } from '../material';
import { InspirationSelector } from '../inspiration';

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
                    (category) => category.type === CategoryType.Product
                    // && category.isMainCategory
                ) as ProductCategory[]
        ),

    selectProductSubCategories: () =>
        createSelector(
            selectCategoryState,
            (categoryState): ProductCategory[] =>
                categoryState.categories.filter(
                    (category) => category.type === CategoryType.Product
                    // && !category.isMainCategory
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

    selectMaterialCategoryById: (categoryId: string) =>
        createSelector(
            selectCategoryState,
            (categoryState): MaterialCategory =>
                categoryState.categories.find(
                    (category) =>
                        category.type === CategoryType.Material && category.id === categoryId
                ) as MaterialCategory
        ),

    selectInspirationCategories: () =>
        createSelector(
            selectCategoryState,
            (categoryState): InspirationCategory[] =>
                categoryState.categories.filter(
                    (category) => category.type === CategoryType.Inspiration
                ) as InspirationCategory[]
        ),

    selectCategoryItemsCountById: (categoryId: string) =>
        createSelector(
            selectCategoryState,
            ProductSelector.selectProducts(),
            MaterialSelector.selectMaterials(),
            InspirationSelector.selectInspirations(),
            (categoryState, products, materials, inspirations): number => {
                const category = categoryState.categories.find(
                    (category) => category.id === categoryId
                );

                if (!category) {
                    return 0;
                }

                switch (category.type) {
                    case CategoryType.Product:
                        return products.filter((product) => product.categoryId === categoryId)
                            .length;

                    default:
                        return 0;
                }
            }
        ),

    selectCategorySubCategoriesCountById: (categoryId: string) =>
        createSelector(
            selectCategoryState,
            (categoryState): number =>
                categoryState.categories.filter((category) => category.parentId === categoryId)
                    .length
        ),

    isBusy: () =>
        createSelector(selectCategoryState, (categoryState): boolean => categoryState.isBusy)
};
