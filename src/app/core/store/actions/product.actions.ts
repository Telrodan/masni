import { Product } from '@core/models/product.model';
import { createAction, props } from '@ngrx/store';

export enum ProductActionTypes {
  GET_PRODUCTS = '[Products] Get Products',
  GET_PRODUCTS_SUCCESS = '[Products] Get Products Success',
  ADD_PRODUCT = '[Products] Add Product',
  DELETE_PRODUCT = '[Products] Delete Product',
  UPDATE_PRODUCT = '[Products] Update Product'
}

export const getProducts = createAction(ProductActionTypes.GET_PRODUCTS);

export const getProductsSuccess = createAction(
  ProductActionTypes.GET_PRODUCTS_SUCCESS,
  props<{ products: Product[] }>()
);

export const addProduct = createAction(
  ProductActionTypes.ADD_PRODUCT,
  props<{ product: Product }>()
);

export const deleteProduct = createAction(
  ProductActionTypes.DELETE_PRODUCT,
  props<{ product: Product }>()
);

export const updateProduct = createAction(
  ProductActionTypes.UPDATE_PRODUCT,
  props<{ product: Product }>()
);
