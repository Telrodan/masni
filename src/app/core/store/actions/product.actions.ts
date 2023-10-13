import { Category } from '@core/models/category.model';
import { Material } from '@core/models/material.model';
import { Product } from '@core/models/product.model';
import { Question } from '@core/models/question.model';
import { createAction, props } from '@ngrx/store';

export enum ProductActionTypes {
  GET_PRODUCTS = '[Products] Get Products',
  GET_PRODUCTS_SUCCESS = '[Products] Get Products Success',
  GET_PRODUCTS_ERROR = '[Products] Get Products Error',
  ADD_PRODUCT = '[Products] Add Product',
  DELETE_PRODUCT = '[Products] Delete Product',
  UPDATE_PRODUCT = '[Products] Update Product',
  REMOVE_QUESTION_FROM_PRODUCT = '[Products] Remove Question From Product',
  UPDATE_PRODUCTS_CATEGORY = '[Products] Update Products Category',
  UPDATE_PRODUCTS_QUESTION = '[Products] Update Products Question',
  DELETE_PRODUCT_QUESTION_MATERIAL_OPTION = '[Products] Delete Product Question Material Option',
  ADD_MATERIAL_QUESTION_OPTION_TO_PRODUCT = '[Products] Add Material Question Option To Product'
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

export const updateProductsCategory = createAction(
  ProductActionTypes.UPDATE_PRODUCTS_CATEGORY,
  props<{ category: Category }>()
);

export const updateProductsQuestion = createAction(
  ProductActionTypes.UPDATE_PRODUCTS_QUESTION,
  props<{ question: Question }>()
);

export const deleteProductQuestionMaterialOption = createAction(
  ProductActionTypes.DELETE_PRODUCT_QUESTION_MATERIAL_OPTION,
  props<{ material: Material }>()
);

export const addMaterialQuestionOptionToProduct = createAction(
  ProductActionTypes.ADD_MATERIAL_QUESTION_OPTION_TO_PRODUCT,
  props<{ material: Material }>()
);
