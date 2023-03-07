import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import {
  coreReducer,
  CoreState
} from '../core/core-ngrx/reducers/core.reducers';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppState {
  core: CoreState;
}

export const reducers: ActionReducerMap<AppState> = {
  core: coreReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
