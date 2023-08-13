import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { QuestionType } from '@core/enums/question-type.enum';
import {
  QuestionWithStringAnswer,
  QuestionWithStringAnswerOption
} from '@core/models/question-with-string-answer.model';
import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'mhd-add-question-with-string-answer',
  templateUrl: './add-question-with-string-answer.component.html',
  styleUrls: ['./add-question-with-string-answer.component.scss']
})
export class AddQuestionWithStringAnswerComponent implements OnInit {
  QuestionType = QuestionType;
  questionWithStringAnswerForm = this.fb.group({
    questionName: ['', Validators.required],
    question: ['', Validators.required],
    optionAnswer: [''],
    isExtraPrice: [false],
    extraPrice: [0],
    options: this.fb.array([], Validators.required)
  });
  options: QuestionWithStringAnswerOption[] = [];

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddQuestionWithStringAnswerComponent>
  ) {}

  ngOnInit(): void {
    this.questionService.submitButtonClick$
      .pipe(
        tap(() => this.onSubmit()),
        untilDestroyed(this)
      )
      .subscribe();
  }
  // this.questionWithStringAnswerForm.value.questionName
  addOption(): void {
    const options = this.questionWithStringAnswerForm.get(
      'options'
    ) as FormArray;

    const optionAnswer =
      this.questionWithStringAnswerForm.value.optionAnswer.trim();
    const extraPrice = this.questionWithStringAnswerForm.value.extraPrice;

    if (optionAnswer) {
      options.push(
        this.fb.group({
          option: [optionAnswer, Validators.required],
          extraPrice: [extraPrice > 0 ? extraPrice : 0],
          slug: [
            extraPrice > 0
              ? optionAnswer + ' +' + extraPrice + ' Ft'
              : optionAnswer
          ]
        })
      );
      this.toastr.success('Választási lehetőség hozzáadva');

      this.questionWithStringAnswerForm.get('optionAnswer').reset();
      this.questionWithStringAnswerForm.get('isExtraPrice').reset();
      this.questionWithStringAnswerForm.get('extraPrice').patchValue(0);
      this.options = options.value;
    } else {
      this.toastr.info('Kérlek adj meg egy választási lehetőséget');
    }
  }

  deleteOption(index: number): void {
    const options = this.questionWithStringAnswerForm.get(
      'options'
    ) as FormArray;

    options.removeAt(index);

    this.options = options.value;
  }

  onSubmit(): void {
    if (this.questionWithStringAnswerForm.valid) {
      const questionName =
        this.questionWithStringAnswerForm.value.questionName.trim();
      const question = this.questionWithStringAnswerForm.value.question.trim();

      const questionWithStringAnswer: QuestionWithStringAnswer = {
        questionType: QuestionType.QUESTION_WITH_STRING_ANSWER,
        questionName: questionName,
        question: question,
        options: this.questionWithStringAnswerForm.value
          .options as QuestionWithStringAnswerOption[]
      };

      this.questionService
        .addQuestionWithStringAnswer(questionWithStringAnswer)
        .pipe(
          tap(() => {
            this.toastr.success('Kérdés sikeresen hozzáadva');
            this.questionWithStringAnswerForm.reset();
            this.options = [];
            this.dialogRef.close();
          })
        )
        .subscribe();
    } else {
      this.toastr.info('Kérlek töltsd ki a kérdéshez szükséges mezőket');
    }
  }
}
