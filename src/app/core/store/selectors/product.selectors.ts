import { createSelector } from '@ngrx/store';
import { AppState } from '@core/store/app-state';
import { selectAllQuestion } from './question.selectors';
import * as _ from 'lodash';

export const selectProductState = (state: AppState) => state.product;

export const selectAllProducts = createSelector(
  selectProductState,
  (state) => state.products
);

export const selectAvailableProducts = createSelector(
  selectProductState,
  (state) => state.products.filter((product) => product.stock > 0)
);

export const selectCustomProducts = createSelector(
  selectProductState,
  (state) => state.products.filter((product) => product.isCustom)
);

export const selectFeaturedProducts = createSelector(
  selectProductState,
  (state) =>
    state.products.filter((product) => product.isFeatured && product.stock > 0)
);

// export const selectProductsWithQuestions = createSelector(
//   selectAllProducts,
//   selectAllQuestion,
//   (products, questions) => {
//     const clonedProducts = _.cloneDeep(products);
//     clonedProducts.forEach((product) => {
//       questions.forEach((question) => {
//         if (product.questions.includes(question.id)) {
//           product.questions.push(question);
//         }
//       });
//     });
//     return clonedProducts;
//   }
// );

export const selectProductById = (id: string) =>
  createSelector(selectAllProducts, (products) => {
    const index = products.findIndex((product) => product.id === id);
    return products[index];
  });
