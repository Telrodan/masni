import { createReducer, on } from '@ngrx/store';

import { cloneDeep } from 'lodash';

import { InspirationAction } from './inspiration.actions';

export const inspirationInitialState = {
    inspirations: [],
    isBusy: false
};

export const inspirationReducers = createReducer(
    inspirationInitialState,
    on(InspirationAction.getInspirations, (state) => ({
        ...state,
        isBusy: true
    })),

    on(InspirationAction.getInspirationsSuccess, (state, action) => ({
        ...state,
        inspirations: [...action.inspirations],
        isBusy: false
    })),

    on(InspirationAction.addInspiration, (state) => ({
        ...state,
        isBusy: true
    })),

    on(InspirationAction.addInspirationSuccess, (state, action) => ({
        ...state,
        inspirations: [...state.inspirations, action.inspiration],
        isBusy: false
    })),

    on(InspirationAction.updateInspiration, (state) => ({
        ...state,
        isBusy: true
    })),

    on(InspirationAction.updateInspirationSuccess, (state, action) => {
        const stateClone = cloneDeep(state);
        const inspirationIndex = stateClone.inspirations.findIndex(
            (inspiration) => inspiration.id === action.inspiration.id
        );

        stateClone.inspirations[inspirationIndex] = action.inspiration;

        return {
            ...stateClone,
            isBusy: false
        };
    }),

    on(InspirationAction.deleteInspiration, (state) => ({
        ...state,
        isBusy: true
    })),

    on(InspirationAction.deleteInspirationSuccess, (state, action) => ({
        ...state,
        inspirations: state.inspirations.filter((inspiration) => inspiration.id !== action.id),
        isBusy: false
    }))
);
