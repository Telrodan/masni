import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/reducer';

export const selectProductState = (state: AppState) => state.products;

export const productsSelector = createSelector(
  selectProductState,
  (state) => state.products
);

export const availableProductsSelector = createSelector(
  selectProductState,
  (state) => state.availableProducts
);

export const productByIdSelector = (productId: string) =>
  createSelector(availableProductsSelector, (products) => {
    const result = products.find((product) => product._id === productId);
    return result;
  });
