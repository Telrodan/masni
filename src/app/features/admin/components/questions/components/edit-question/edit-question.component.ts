import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionType } from '@core/enums/question-type.enum';
import { Option, Question } from '@core/models/question.model';
import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';
import { tap } from 'rxjs';

@Component({
  selector: 'mhd-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent {
  QuestionType = QuestionType;

  editQuestionForm = this.fb.group({
    questionName: [this.data.questionName, Validators.required],
    question: [this.data.question, Validators.required],
    option: [''],
    isExtraPrice: [false],
    extraPrice: [0],
    options: this.fb.array<Option>(this.data.options, Validators.required)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Question,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditQuestionComponent>,
    private questionService: QuestionService,
    private toastr: ToastrService
  ) {}

  addOption(): void {
    const option = this.editQuestionForm.value.option.trim();
    const extraPrice = this.editQuestionForm.value.extraPrice;

    if (option) {
      (this.editQuestionForm.get('options') as FormArray).push(
        this.fb.group({
          option,
          extraPrice,
          slug: [extraPrice ? option + ' +' + extraPrice + ' Ft' : option]
        })
      );
      this.editQuestionForm.get('option').reset();
      this.editQuestionForm.get('isExtraPrice').reset();
      this.editQuestionForm.get('extraPrice').patchValue(0);
      this.toastr.success('Választási lehetőség hozzáadva');
    } else {
      this.toastr.info('Kérlek adj meg egy választási lehetőséget');
    }
  }

  deleteOption(index: number): void {
    const options = this.editQuestionForm.get('options') as FormArray;

    options.removeAt(index);
  }

  // TODO: refactor
  onSubmit(): void {
    if (this.editQuestionForm.valid) {
      const questionName = this.editQuestionForm.value.questionName.trim();
      const question = this.editQuestionForm.value.question.trim();

      const questionData: Question = {
        id: this.data.id,
        questionType: QuestionType.QUESTION_WITH_STRING_ANSWER,
        questionName,
        question,
        options: this.editQuestionForm.value.options as Option[]
      };

      this.questionService
        .updateQuestion$(questionData)
        .pipe(
          tap(() => {
            this.toastr.success('Kérdés sikeresen hozzáadva');
            this.editQuestionForm.reset();
            this.dialogRef.close();
          })
        )
        .subscribe();
    } else {
      this.toastr.info('Kérlek töltsd ki a kérdéshez szükséges mezőket');
    }
  }
}
