import { createReducer, on } from '@ngrx/store';
import { StatusTypes } from '../status-types';
import {
  addQuestion,
  deleteQuestion,
  getQuestions,
  getQuestionsError,
  getQuestionsSuccess
} from '../actions';

export const questionInitialState = {
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

  on(deleteQuestion, (state, action) => {
    const index = state.questions.findIndex((item) => item.id === action.id);
    const questions = [...state.questions];
    questions.splice(index, 1);
    return {
      ...state,
      questions
    };
  })
);
