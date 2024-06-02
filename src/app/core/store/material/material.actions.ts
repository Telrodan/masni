import { createAction, props } from '@ngrx/store';

import { Material } from './material.model';

const ACTION_PREFIX = '[Material]';

export const MaterialAction = {
    getMaterials: createAction(`${ACTION_PREFIX} Get Materials`),

    getMaterialsSuccess: createAction(
        `${ACTION_PREFIX} Get Materials Success`,
        props<{ materials: Material[] }>()
    ),

    addMaterial: createAction(`${ACTION_PREFIX} Add Material`, props<{ material: Material }>()),

    addMaterialSuccess: createAction(
        `${ACTION_PREFIX} Add Material Success`,
        props<{ material: Material }>()
    ),

    updateMaterial: createAction(
        `${ACTION_PREFIX} Update Material`,
        props<{ material: Material }>()
    ),

    updateMaterialSuccess: createAction(
        `${ACTION_PREFIX} Update Material Success`,
        props<{ material: Material }>()
    ),

    deleteMaterial: createAction(
        `${ACTION_PREFIX} Delete Material`,
        props<{ id: string; name: string }>()
    ),

    deleteMaterialSuccess: createAction(
        `${ACTION_PREFIX} Delete Material Success`,
        props<{ id: string }>()
    )
};
