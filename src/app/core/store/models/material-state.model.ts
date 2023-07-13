import { Material } from '@core/models/material.model';
import { SortedMaterials } from '@core/models/sorted-materials.model';
import { StatusTypes } from '../status-types';

export interface MaterialState {
  materials: Material[];
  availableMaterials: Material[];
  sortedMaterials: SortedMaterials;
  status: StatusTypes;
}
