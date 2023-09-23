import { QuestionType } from '@core/enums/question-type.enum';

export interface Option {
    id?: string;
    optionName: string;
    extraPrice: number;
    slug?: string;
}

export interface Question {
    id?: string;
    questionType: QuestionType;
    questionName: string;
    question: string;
    options?: Option[];
    materialCategoryIds?: string[];
}
