import { createAction, props } from '@ngrx/store';

import { Inspiration } from './inspiration.model';

const ACTION_PREFIX = '[Inspiration]';

export const InspirationAction = {
    getInspirations: createAction(`${ACTION_PREFIX} Get Inspirations`),

    getInspirationsSuccess: createAction(
        `${ACTION_PREFIX} Get Inspirations Success`,
        props<{ inspirations: Inspiration[] }>()
    ),

    addInspiration: createAction(
        `${ACTION_PREFIX} Add Inspiration`,
        props<{ inspiration: Inspiration }>()
    ),

    addInspirationSuccess: createAction(
        `${ACTION_PREFIX} Add Inspiration Success`,
        props<{ inspiration: Inspiration }>()
    ),

    updateInspiration: createAction(
        `${ACTION_PREFIX} Update Inspiration`,
        props<{ inspiration: Inspiration }>()
    ),

    updateInspirationSuccess: createAction(
        `${ACTION_PREFIX} Update Inspiration Success`,
        props<{ inspiration: Inspiration }>()
    ),

    deleteInspiration: createAction(
        `${ACTION_PREFIX} Delete Inspiration`,
        props<{ id: string; name: string }>()
    ),

    deleteInspirationSuccess: createAction(
        `${ACTION_PREFIX} Delete Inspiration Success`,
        props<{ id: string }>()
    )
};
