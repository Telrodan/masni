import { createSelector } from '@ngrx/store';
import { AppState } from '@core/store/app-state';

export const selectProductState = (state: AppState) => state.products;

export const selectAllProducts = createSelector(
  selectProductState,
  (state) => state.allProducts
);

export const selectAvailableProducts = createSelector(
  selectProductState,
  (state) => state.availableProducts
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
