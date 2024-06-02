import { createAction, props } from '@ngrx/store';

import { Product } from './product.model';

const ACTION_PREFIX = '[Product]';

export const ProductAction = {
    getProducts: createAction(`${ACTION_PREFIX} Get Products`),

    getProductsSuccess: createAction(
        `${ACTION_PREFIX} Get Products Success`,
        props<{ products: Product[] }>()
    ),

    addProduct: createAction(`${ACTION_PREFIX} Add Product`, props<{ product: Product }>()),

    addProductSuccess: createAction(
        `${ACTION_PREFIX} Add Product Success`,
        props<{ product: Product }>()
    ),

    updateProduct: createAction(`${ACTION_PREFIX} Update Product`, props<{ product: Product }>()),

    updateProductSuccess: createAction(
        `${ACTION_PREFIX} Update Product Success`,
        props<{ product: Product }>()
    ),

    deleteProduct: createAction(
        `${ACTION_PREFIX} Delete Product`,
        props<{ id: string; name: string }>()
    ),

    deleteProductSuccess: createAction(
        `${ACTION_PREFIX} Delete Product Success`,
        props<{ id: string }>()
    )
};
