import { createSelector } from '@ngrx/store';
import { AppState } from '@core/store/app-state';

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
  selectAvailableProducts,
  (products) => products.filter((product) => product.isCustom)
);

export const selectFeaturedProducts = createSelector(
  selectAvailableProducts,
  (products) => products.filter((product) => product.isFeatured)
);

export const selectDollDresses = createSelector(
  selectAvailableProducts,
  (products) => {
    return products.filter((product) => product.isDollDress);
  }
);

export const selectProductById = (id: string) =>
  createSelector(selectAvailableProducts, (products) =>
    products.find((product) => product.id === id)
  );
