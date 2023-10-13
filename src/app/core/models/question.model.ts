import { QuestionType } from '@core/enums/question-type.enum';

import { QuestionOption } from './question-option.model';
import { Category } from './category.model';

export interface RawQuestion {
  type: QuestionType;
  name: string;
  question: string;
  materialCategories?: string[];
  options?: QuestionOption[];
}

export interface Question {
  id?: string;
  type: QuestionType;
  name: string;
  question: string;
  materialCategories?: Category[];
  options: QuestionOption[];
  updatedAt: Date;
  createdAt: Date;
}
