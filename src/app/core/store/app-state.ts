import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '../../../environments/environment';
import { AppState } from './app-state.model';
import { categoryReducers } from './category';

export const appState: ActionReducerMap<AppState> = {
    category: categoryReducers
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
