import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { QuestionType } from '@core/enums/question-type.enum';

import { QuestionService } from '@core/services/question.service';

@Component({
  selector: 'mhd-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent {
  QuestionType = QuestionType;
  questionOptions = [
    {
      label: 'Kérdés hozzáadható válaszokkal',
      value: QuestionType.QUESTION_WITH_STRING_ANSWER
    },
    {
      label: 'Kérdés hozzáadható igen-nem válaszokkal',
      value: QuestionType.QUESTION_WITH_BOOLEAN_ANSWER
    },
    {
      label: 'Kérdés hozzáadható anyag kategóriákkal',
      value: QuestionType.QUESTION_WITH_MATERIAL_ANSWER
    }
  ];

  selectQuestionTypeForm = this.fb.group({
    questionType: [this.questionOptions[0].value, Validators.required]
  });

  addQuestionForm = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private questionSerive: QuestionService
  ) {}

  onSubmit(): void {
    this.questionSerive.emitButtonClick();
  }
}
