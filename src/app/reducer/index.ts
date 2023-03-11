import { materialReducers } from '@core/store';
import { MaterialsStateInterface } from '@core/store/models/materials-state.model';
import { ShoppingCartState } from '@core/store/models/shopping-cart-state.model';
import { shoppingCartReducers } from '@core/store/reducers/shopping-cart.reducers';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppState {
  materials: MaterialsStateInterface;
  shoppingCart: ShoppingCartState;
}

export const reducers: ActionReducerMap<AppState> = {
  materials: materialReducers,
  shoppingCart: shoppingCartReducers
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
