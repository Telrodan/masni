import { Inspiration } from '@core/models/inspiration.model';
import { StatusTypes } from '../status-types';

export interface InspirationState {
  inspirations: Inspiration[];
  status: StatusTypes;
}
