import { CategoryType } from '@core/enums/category-type.enum';
import { AppState } from '@core/store/app-state';

import { createSelector } from '@ngrx/store';

export const selectCategoryState = (state: AppState) => state.categories;

export const selectAllCategories = createSelector(
  selectCategoryState,
  (state) => state.categories
);

export const selectItemCategoryNameByItemId = (itemId: string) =>
  createSelector(selectAllCategories, (categories) => {
    const category = categories.find((category) =>
      category.items.includes(itemId)
    );
    console.log(category);
    return category?.name;
  });

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
