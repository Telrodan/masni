import { QuestionType } from '@core/enums/question-type.enum';

export interface BackendQuestion {
    type: QuestionType;
    name: string;
    question: string;
    materialCategories?: string[];
    options?: QuestionOption[];
}

export interface QuestionOption {
    id?: string;
    materialId?: string;
    name: string;
    extraPrice: number;
    slug: string;
}

export interface Question {
    id: string;
    type: QuestionType;
    name: string;
    question: string;
    materialCategories: string[];
    options: QuestionOption[];
    updatedAt: Date;
    createdAt: Date;
}
