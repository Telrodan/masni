import { Route } from '@angular/router';

const questionsComponent = () =>
  import('./questions.component').then((m) => m.QuestionsComponent);

const addQuestionComponent = () =>
  import('./add-question/add-question.component').then(
    (m) => m.AddQuestionComponent
  );

const editQuestionComponent = () =>
  import('./edit-question/edit-question.component').then(
    (m) => m.EditQuestionComponent
  );

export default [
  {
    path: '',
    redirectTo: 'all',
    pathMatch: 'full'
  },
  {
    path: 'all',
    loadComponent: questionsComponent
  },
  {
    path: 'add',
    loadComponent: addQuestionComponent
  },
  {
    path: 'edit/:id',
    loadComponent: editQuestionComponent
  }
] as Route[];
