import { Product } from '@core/models/product.model';
import { createAction, props } from '@ngrx/store';

export enum ProductActionTypes {
  GET_PRODUCTS = '[Products] Get Products',
  GET_PRODUCTS_SUCCESS = '[Products] Get Products Success'
}

export const getProducts = createAction(ProductActionTypes.GET_PRODUCTS);

export const getProductsSuccess = createAction(
  ProductActionTypes.GET_PRODUCTS_SUCCESS,
  props<{ products: Product[] }>()
);
