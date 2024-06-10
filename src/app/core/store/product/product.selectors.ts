import { createSelector } from '@ngrx/store';

import { AppState } from '../app-state.model';

const selectProductState = (state: AppState) => state.product;

export const ProductSelector = {
    selectProducts: () =>
        createSelector(selectProductState, (productState) => productState.products),

    selectProductById: (id: string) =>
        createSelector(selectProductState, (productState) =>
            productState.products.find((product) => product.id === id)
        ),

    selectProductsByCategoryId: (categoryId: string) =>
        createSelector(selectProductState, (productState) =>
            productState.products.filter((product) => product.categoryId === categoryId)
        ),

    isBusy: () => createSelector(selectProductState, (productState): boolean => productState.isBusy)
};
