import { QuestionType } from '@core/enums/question-type.enum';
import { QuestionOption } from './question-option.model';

export interface Question {
  id?: string;
  questionType: QuestionType;
  questionName: string;
  question: string;
  materialCategoryIds?: string[];
  options?: QuestionOption[];
  updatedAt?: Date;
  createdAt?: Date;
}
