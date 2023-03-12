import { materialReducers } from '@core/store';
import { MaterialState } from '@core/store/models/material-state.model';
import { ProductState } from '@core/store/models/product-state.model';
import { ShoppingCartState } from '@core/store/models/shopping-cart-state.model';
import { productReducers } from '@core/store/reducers/product.reducers';
import { shoppingCartReducers } from '@core/store/reducers/shopping-cart.reducers';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppState {
  materials: MaterialState;
  shoppingCart: ShoppingCartState;
  products: ProductState;
}

export const reducers: ActionReducerMap<AppState> = {
  materials: materialReducers,
  shoppingCart: shoppingCartReducers,
  products: productReducers
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
