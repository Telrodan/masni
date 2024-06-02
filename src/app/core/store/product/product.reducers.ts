import { createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import { ProductAction } from './product.actions';
import { ProductState } from './product.model';

export const productInitialState: ProductState = {
    products: [],
    isBusy: false
};

export const productReducers = createReducer(
    productInitialState,
    on(ProductAction.getProducts, (state) => ({
        ...state,
        isBusy: true
    })),

    on(ProductAction.getProductsSuccess, (state, action) => ({
        ...state,
        products: [...action.products],
        isBusy: false
    })),

    on(ProductAction.addProduct, (state) => ({
        ...state,
        isBusy: true
    })),

    on(ProductAction.addProductSuccess, (state, action) => ({
        ...state,
        products: [...state.products, action.product],
        isBusy: false
    })),

    on(ProductAction.updateProduct, (state) => ({
        ...state,
        isBusy: true
    })),

    on(ProductAction.updateProductSuccess, (state, action) => {
        const stateClone = cloneDeep(state);
        const productIndex = stateClone.products.findIndex(
            (product) => product.id === action.product.id
        );

        stateClone.products[productIndex] = action.product;

        return {
            ...stateClone,
            isBusy: false
        };
    }),

    on(ProductAction.deleteProduct, (state) => ({
        ...state,
        isBusy: true
    })),

    on(ProductAction.deleteProductSuccess, (state, action) => ({
        ...state,
        products: state.products.filter((product) => product.id !== action.id),
        isBusy: false
    }))
);
