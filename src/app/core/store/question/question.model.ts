import { MaterialCategory } from '../category/category.model';

export interface QuestionState {
    questions: Question[];
    isBusy: boolean;
}

export enum QuestionType {
    Custom = 'custom',
    Material = 'material'
}

export interface QuestionTypeFormOption {
    label: string;
    value: QuestionType;
}

export interface QuestionOption {
    materialId?: string;
    name: string;
    extraPrice: number;
    nameWithExtra?: string;
}

export interface Question {
    id?: string;
    type: QuestionType;
    name: string;
    question: string;
    materialCategories?: MaterialCategory[];
    options?: QuestionOption[];
    isOptional?: boolean;
    updatedAt?: Date;
    createdAt?: Date;
}
