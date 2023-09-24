import { Product } from '@core/models/product.model';
import { createAction, props } from '@ngrx/store';

export enum ProductActionTypes {
  GET_PRODUCTS = '[Products] Get Products',
  GET_PRODUCTS_SUCCESS = '[Products] Get Products Success',
  GET_PRODUCTS_ERROR = '[Products] Get Products Error',
  ADD_PRODUCT = '[Products] Add Product',
  DELETE_PRODUCT = '[Products] Delete Product',
  UPDATE_PRODUCT = '[Products] Update Product',
  REMOVE_QUESTION_FROM_PRODUCT = '[Products] Remove Question From Product'
}

export const getProducts = createAction(ProductActionTypes.GET_PRODUCTS);

export const getProductsSuccess = createAction(
  ProductActionTypes.GET_PRODUCTS_SUCCESS,
  props<{ products: Product[] }>()
);

export const getProductsError = createAction(
  ProductActionTypes.GET_PRODUCTS_ERROR
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

export const removeQuestionFromProduct = createAction(
  ProductActionTypes.REMOVE_QUESTION_FROM_PRODUCT,
  props<{ id: string }>()
);
