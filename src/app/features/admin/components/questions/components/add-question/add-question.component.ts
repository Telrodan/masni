import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { QuestionType } from '@core/enums/question-type.enum';
import { Option, Question } from '@core/models/question.model';

import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';
import { tap } from 'rxjs';

@Component({
  selector: 'mhd-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
  selectedQuestionType: QuestionType = QuestionType.QUESTION_WITH_STRING_ANSWER;

  QuestionType = QuestionType;
  questionTypeFormData = [
    {
      label: 'Kérdés hozzáadható válaszokkal',
      value: QuestionType.QUESTION_WITH_STRING_ANSWER
    },
    {
      label: 'Kérdés hozzáadható anyag kategóriákkal',
      value: QuestionType.QUESTION_WITH_MATERIAL_CATEGORY_ANSWER
    }
  ];
  questionTypeForm = this.fb.group({
    questionType: [this.questionTypeFormData[0].value, Validators.required]
  });

  addQuestionForm = this.fb.group({
    questionName: ['', Validators.required],
    question: ['', Validators.required],
    option: [''],
    isExtraPrice: [false],
    extraPrice: [0],
    options: this.fb.array<Option[]>([], Validators.required)
  });

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddQuestionComponent>
  ) {}

  ngOnInit(): void {
    this.questionTypeForm.valueChanges
      .pipe(
        tap((value) => {
          this.selectedQuestionType = value.questionType;
        })
      )
      .subscribe();
  }

  addOption(): void {
    const option = this.addQuestionForm.value.option.trim();
    const extraPrice = this.addQuestionForm.value.extraPrice;

    if (option) {
      (this.addQuestionForm.get('options') as FormArray).push(
        this.fb.group({
          option,
          extraPrice,
          slug: [extraPrice ? option + ' +' + extraPrice + ' Ft' : option]
        })
      );
      this.addQuestionForm.get('option').reset();
      this.addQuestionForm.get('isExtraPrice').reset();
      this.addQuestionForm.get('extraPrice').patchValue(0);
      this.toastr.success('Választási lehetőség hozzáadva');
    } else {
      this.toastr.info('Kérlek adj meg egy választási lehetőséget');
    }
  }

  deleteOption(index: number): void {
    const options = this.addQuestionForm.get('options') as FormArray;

    options.removeAt(index);
  }

  onSubmit(): void {
    if (this.addQuestionForm.valid) {
      const questionName = this.addQuestionForm.value.questionName.trim();
      const question = this.addQuestionForm.value.question.trim();

      const questionData: Question = {
        questionType: QuestionType.QUESTION_WITH_STRING_ANSWER,
        questionName,
        question,
        options: this.addQuestionForm.value.options as Option[]
      };

      this.questionService
        .addQuestion$(questionData)
        .pipe(
          tap(() => {
            this.toastr.success('Kérdés sikeresen hozzáadva');
            this.addQuestionForm.reset();
            this.dialogRef.close();
          })
        )
        .subscribe();
    } else {
      this.toastr.info('Kérlek töltsd ki a kérdéshez szükséges mezőket');
    }
  }
}
