import { Question } from '@core/models/question.model';
import { StatusTypes } from '../status-types';

export interface QuestionState {
  questions: Question[];
  status: StatusTypes;
}
