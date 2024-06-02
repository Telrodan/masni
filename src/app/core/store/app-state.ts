import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '../../../environments/environment';
import { AppState } from './app-state.model';
import { categoryReducers } from './category';
import { materialReducers } from './material/material.reducers';
import { logReducers } from './log/log.reducers';
import { inspirationReducers } from './inspiration';
import { productReducers } from './product';

export const appState: ActionReducerMap<AppState> = {
    category: categoryReducers,
    product: productReducers,
    material: materialReducers,
    log: logReducers,
    inspiration: inspirationReducers
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
