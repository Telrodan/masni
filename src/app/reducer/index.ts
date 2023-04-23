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
  productReducers
} from '@core/store';

import { environment } from '../../environments/environment';
import { OrderState } from '@core/store/models/order-state.model';
import { orderReducers } from '@core/store/reducers/order.reducers';

export interface AppState {
  material: MaterialState;
  shoppingCart: ShoppingCartState;
  product: ProductState;
  category: CategoryState;
  user: UserState;
  order: OrderState;
}

export const reducers: ActionReducerMap<AppState> = {
  material: materialReducers,
  shoppingCart: shoppingCartReducers,
  product: productReducers,
  category: categoryReducers,
  user: userReducers,
  order: orderReducers
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
