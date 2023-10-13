import { createAction, props } from '@ngrx/store';

import { Material } from '@core/models/material.model';
import { Question } from '@core/models/question.model';

export enum QuestionActionTypes {
  GET_QUESTIONS = '[Question] Get Questions',
  GET_QUESTIONS_SUCCESS = '[Question] Get Questions Success',
  GET_QUESTIONS_ERROR = '[Question] Get Questions Error',
  ADD_QUESTION = '[Question] Add Question',
  DELETE_QUESTION = '[Question] Delete Question',
  UPDATE_QUESTION = '[Question] Update Question',
  DELETE_MATERIAL_QUESTION_OPTION = '[Question] Delete Material Question Option',
  ADD_MATERIAL_QUESTION_OPTION = '[Question] Add Material Question Option'
}

export const getQuestions = createAction(QuestionActionTypes.GET_QUESTIONS);

export const getQuestionsSuccess = createAction(
  QuestionActionTypes.GET_QUESTIONS_SUCCESS,
  props<{ questions: Question[] }>()
);

export const getQuestionsError = createAction(
  QuestionActionTypes.GET_QUESTIONS_ERROR
);

export const addQuestion = createAction(
  QuestionActionTypes.ADD_QUESTION,
  props<{ question: Question }>()
);

export const deleteQuestion = createAction(
  QuestionActionTypes.DELETE_QUESTION,
  props<{ id: string }>()
);

export const updateQuestion = createAction(
  QuestionActionTypes.UPDATE_QUESTION,
  props<{ question: Question }>()
);

export const deleteMaterialQuestionOption = createAction(
  QuestionActionTypes.DELETE_MATERIAL_QUESTION_OPTION,
  props<{ material: Material }>()
);

export const addMaterialQuestionOption = createAction(
  QuestionActionTypes.ADD_MATERIAL_QUESTION_OPTION,
  props<{ material: Material }>()
);
