import { QuestionType } from '@core/enums/question-type.enum';

export interface QuestionWithStringAnswerOption {
  option: string;
  extraPrice: number;
  slug: string;
}

export interface QuestionWithStringAnswer {
  questionType: QuestionType;
  questionName: string;
  question: string;
  options: QuestionWithStringAnswerOption[];
}
