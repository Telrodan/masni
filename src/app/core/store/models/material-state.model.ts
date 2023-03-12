import { Material } from '@core/models/material.model';
import { SortedMaterials } from '@core/models/sorted-materials.model';

export interface MaterialState {
  materials: Material[];
  sortedMaterials: SortedMaterials;
}
