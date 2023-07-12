import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { CategoryState } from '@core/store/models/category-state.model';
import { MaterialState } from '@core/store/models/material-state.model';
import { ProductState } from '@core/store/models/product-state.model';
import { ShoppingCartState } from '@core/store/models/shopping-cart-state.model';
import { UserState } from '@core/store/models/user-state.model';
import {
  categoryReducers,
  materialReducers,
  userReducers,
  shoppingCartReducers,
  productReducers,
  inspirationReducers
} from '@core/store';

import { environment } from '../../../environments/environment';
import { OrderState } from '@core/store/models/order-state.model';
import { orderReducers } from '@core/store/reducers/order.reducers';
import { InspirationState } from '@core/store/models/inspiration-state.model';

export interface AppState {
  material: MaterialState;
  inspiration: InspirationState;
  shoppingCart: ShoppingCartState;
  products: ProductState;
  categories: CategoryState;
  user: UserState;
  order: OrderState;
}

export const reducers: ActionReducerMap<AppState> = {
  material: materialReducers,
  inspiration: inspirationReducers,
  shoppingCart: shoppingCartReducers,
  products: productReducers,
  categories: categoryReducers,
  user: userReducers,
  order: orderReducers
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
