import { categoryReducers, materialReducers, userReducers } from '@core/store';
import { CategoryState } from '@core/store/models/category-state.model';
import { MaterialState } from '@core/store/models/material-state.model';
import { ProductState } from '@core/store/models/product-state.model';
import { ShoppingCartState } from '@core/store/models/shopping-cart-state.model';
import { UserState } from '@core/store/models/user-state.model';
import { productReducers } from '@core/store/reducers/product.reducers';
import { shoppingCartReducers } from '@core/store/reducers/shopping-cart.reducers';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppState {
  materials: MaterialState;
  shoppingCart: ShoppingCartState;
  products: ProductState;
  categories: CategoryState;
  user: UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  materials: materialReducers,
  shoppingCart: shoppingCartReducers,
  products: productReducers,
  categories: categoryReducers,
  user: userReducers
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
