import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/reducer';

export const selectProductState = (state: AppState) => state.products;

export const productsSelector = createSelector(
  selectProductState,
  (state) => state.products
);

export const productByIdSelector = (productId: string) =>
  createSelector(productsSelector, (products) => {
    const result = products.find((product) => product._id === productId);
    return result;
  });
