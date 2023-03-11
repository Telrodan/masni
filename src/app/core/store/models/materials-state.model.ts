import { MaterialInterface } from '@core/models/material.model';
import { SortedMaterialsInterface } from '@core/models/sorted-materials.model';

export interface MaterialsStateInterface {
  materials: MaterialInterface[];
  sortedMaterials: SortedMaterialsInterface;
  error: string | null;
}
