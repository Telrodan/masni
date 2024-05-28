import { createReducer, on } from '@ngrx/store';
import { CategoryState } from './category.model';
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

    on(CategoryAction.addCategorySuccess, (state, action) => ({
        ...state,
        categories: [...state.categories, action.category],
        isBusy: false
    })),

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

    on(CategoryAction.deleteCategorySuccess, (state, action) => ({
        ...state,
        categories: state.categories.filter((category) => category.id !== action.id),
        isBusy: false
    }))
);
