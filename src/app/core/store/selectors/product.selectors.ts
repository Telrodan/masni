import { createSelector } from '@ngrx/store';
import { AppState } from '@core/store/app-state';
import { selectAllQuestion } from './question.selectors';
import * as _ from 'lodash';

export const selectProductState = (state: AppState) => state.products;

export const selectAllProducts = createSelector(
  selectProductState,
  (state) => state.allProducts
);

export const selectAvailableProducts = createSelector(
  selectProductState,
  (state) => state.availableProducts
);

export const selectProductsWithQuestions = createSelector(
  selectAllProducts,
  selectAllQuestion,
  (products, questions) => {
    console.log('products', products);

    const clonedProducts = _.cloneDeep(products);
    clonedProducts.forEach((product) => {
      questions.forEach((question) => {
        if (product.questionIds.includes(question.id)) {
          product.questions.push(question);
        }
      });
    });
    return clonedProducts;
  }
);

export const selectCustomProductByName = (name: string) =>
  createSelector(selectAllProducts, (products) =>
    products.find((product) => {
      if (product.category === 'egyedi termékek' && product.name === name) {
        return product;
      } else {
        return null;
      }
    })
  );

export const productByIdSelector = (productId: string) =>
  createSelector(selectAllProducts, (products) => {
    const result = products.find((product) => product.id === productId);
    return result;
  });
