import { Material } from '@core/models/material.model';
import { StatusTypes } from '../status-types';

export interface MaterialState {
  materials: Material[];
  status: StatusTypes;
}
