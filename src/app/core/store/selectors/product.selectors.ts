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
  selectProductState,
  (state) => state.products.filter((product) => product.isCustom)
);

export const selectFeaturedProducts = createSelector(
  selectProductState,
  (state) =>
    state.products.filter((product) => product.isFeatured && product.stock > 0)
);

export const selectProductById = (id: string) =>
  createSelector(selectAllProducts, (products) => {
    const index = products.findIndex((product) => product.id === id);
    return products[index];
  });
