import { materialReducers } from '@core/store';
import { MaterialsStateInterface } from '@core/store/models/materials-state.model';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppState {
  materials: MaterialsStateInterface;
}

export const reducers: ActionReducerMap<AppState> = {
  materials: materialReducers
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
