import { CategoryType } from '@core/enums/category-type.enum';
import { Product } from '@core/models/product.model';
import { AppState } from '@core/store/app-state';

import { createSelector } from '@ngrx/store';

export const selectCategoryState = (state: AppState) => state.category;

export const selectAllCategories = createSelector(
  selectCategoryState,
  (state) => state.categories
);

export const selectMaterialCategories = createSelector(
  selectCategoryState,
  (state) =>
    state.categories.filter(
      (category) => category.type === CategoryType.MATERIAL_CATEGORY
    )
);

export const selectInspirationCategories = createSelector(
  selectCategoryState,
  (state) =>
    state.categories.filter(
      (category) => category.type === CategoryType.INSPIRATION_CATEGORY
    )
);

export const selectProductCategories = createSelector(
  selectCategoryState,
  (state) =>
    state.categories.filter(
      (category) => category.type === CategoryType.PRODUCT_CATEGORY
    )
);

export const selectCategoryById = (id: string) =>
  createSelector(selectAllCategories, (categories) =>
    categories.find((category) => category.id === id)
  );

export const selectProductCategoryWithAvailableProductsByCategoryId = (
  id: string
) =>
  createSelector(selectProductCategories, (categories) => {
    const category = categories.find((category) => category.id === id);
    return {
      ...category,
      items: (category.items as Product[]).filter((item) => item.stock > 0)
    };
  });
