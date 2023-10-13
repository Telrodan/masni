import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';

import { StatusTypes } from '../status-types';
import {
  addMaterialQuestionOption,
  addQuestion,
  deleteMaterialQuestionOption,
  deleteQuestion,
  getQuestions,
  getQuestionsError,
  getQuestionsSuccess,
  updateQuestion
} from '../actions';
import { QuestionState } from '../models/question-state.model';

export const questionInitialState: QuestionState = {
  questions: [],
  status: StatusTypes.INIT
};

export const questionReducers = createReducer(
  questionInitialState,
  on(getQuestions, (state) => ({
    ...state,
    status: StatusTypes.LOADING
  })),

  on(getQuestionsSuccess, (state, action) => {
    return {
      ...state,
      questions: [...action.questions],
      status: StatusTypes.LOADED
    };
  }),

  on(getQuestionsError, (state) => ({
    ...state,
    status: StatusTypes.ERROR
  })),

  on(addQuestion, (state, action) => ({
    ...state,
    questions: [...state.questions, action.question]
  })),

  on(updateQuestion, (state, action) => {
    const index = state.questions.findIndex(
      (item) => item.id === action.question.id
    );
    const questions = [...state.questions];
    questions[index] = action.question;
    return {
      ...state,
      questions
    };
  }),

  on(deleteQuestion, (state, action) => {
    const index = state.questions.findIndex((item) => item.id === action.id);
    const questions = [...state.questions];
    questions.splice(index, 1);
    return {
      ...state,
      questions
    };
  }),

  on(deleteMaterialQuestionOption, (state, action) => {
    const questions = _.cloneDeep(state.questions);
    questions.forEach((question) => {
      question.options = question.options.filter(
        (option) => option.materialId !== action.material.id
      );
    });
    return {
      ...state,
      questions
    };
  }),

  on(addMaterialQuestionOption, (state, action) => {
    const questions = _.cloneDeep(state.questions);
    questions.forEach((question) => {
      const optionMaterialIds = question.options.map(
        (option) => option.materialId
      );
      const optionMaterialCategoryIds = question.materialCategories.map(
        (category) => category.id
      );

      if (
        !optionMaterialIds.includes(action.material.id) &&
        optionMaterialCategoryIds.includes(action.material.category.id)
      ) {
        question.options.push({
          materialId: action.material.id,
          name: action.material.name,
          extraPrice: action.material.extraPrice,
          slug: action.material.extraPrice
            ? action.material.name + ' +' + action.material.extraPrice + ' Ft'
            : action.material.name
        });
      }
    });

    return {
      ...state,
      questions
    };
  })
);
