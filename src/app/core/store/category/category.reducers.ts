import { createReducer, on } from '@ngrx/store';
import { CategoryState } from './category.model';
import { CategoryAction } from './category.actions';

export const categoryInitialState: CategoryState = {
    categories: [],
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
    }))
);
