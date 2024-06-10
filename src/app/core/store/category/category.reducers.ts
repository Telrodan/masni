import { createReducer, on } from '@ngrx/store';

import { cloneDeep } from 'lodash';

import { CategoryState, ProductCategory } from './category.model';
import { CategoryAction } from './category.actions';

export const categoryInitialState: CategoryState = {
    categories: [],
    navbarMenu: [],
    isBusy: false
};

export const categoryReducers = createReducer(
    categoryInitialState,
    on(CategoryAction.getCategories, (state) => ({
        ...state,
        isBusy: true
    })),

    on(CategoryAction.getCategoriesSuccess, (state, action) => ({
        ...state,
        categories: [...action.categories],
        isBusy: false
    })),

    on(CategoryAction.getNavbarMenu, (state) => ({
        ...state,
        isBusy: true
    })),

    on(CategoryAction.getNavbarMenuSuccess, (state, action) => ({
        ...state,
        navbarMenu: action.navbarMenu,
        isBusy: false
    })),

    on(CategoryAction.addCategory, (state) => ({
        ...state,
        isBusy: true
    })),

    on(CategoryAction.addCategorySuccess, (state, action) => {
        const stateClone = cloneDeep(state);

        // if (!action.category.isMainCategory) {
        //     const parentCategoryIndex = stateClone.categories.findIndex(
        //         (category) => category.id === action.category.parentCategory.id
        //     );

        //     stateClone.categories[parentCategoryIndex].subCategories.push(
        //         action.category as ProductCategory
        //     );
        // }

        return {
            ...stateClone,
            categories: [...stateClone.categories, action.category],
            isBusy: false
        };
    }),

    on(CategoryAction.updateCategory, (state) => ({
        ...state,
        isBusy: true
    })),

    on(CategoryAction.updateCategorySuccess, (state, action) => ({
        ...state,
        categories: state.categories.map((category) =>
            category.id === action.category.id ? action.category : category
        ),
        isBusy: false
    })),

    on(CategoryAction.updateCategoriesOrder, (state) => ({
        ...state,
        isBusy: true
    })),

    on(CategoryAction.updateCategoriesOrderSuccess, (state, action) => ({
        ...state,
        categories: action.categories,
        isBusy: false
    })),

    on(CategoryAction.deleteCategory, (state) => ({
        ...state,
        isBusy: true
    })),

    on(CategoryAction.deleteCategorySuccess, (state, action) => {
        const stateClone = cloneDeep(state);

        const category = stateClone.categories.find((category) => category.id === action.id);

        // if (!category.isMainCategory) {
        //     const parentCategoryIndex = stateClone.categories.findIndex(
        //         (c) => c.id === category.parentCategory.id
        //     );

        //     stateClone.categories[parentCategoryIndex].subCategories = stateClone.categories[
        //         parentCategoryIndex
        //     ].subCategories.filter((subCategory) => subCategory.id !== action.id);
        // }

        return {
            ...stateClone,
            categories: stateClone.categories.filter((category) => category.id !== action.id),
            isBusy: false
        };
    }),

    on(CategoryAction.deleteItemFromCategory, (state, action) => {
        const stateClone = cloneDeep(state);

        // const categoryIndex = stateClone.categories.findIndex(
        //     (category) => category.id === action.categoryId
        // );
        // const items = stateClone.categories[categoryIndex].items;
        // const itemIndex = items.findIndex((item) => item.id === action.itemId);
        // items.splice(itemIndex, 1);

        // stateClone.categories[categoryIndex].items = items;

        return {
            ...stateClone
        };
    })
);
