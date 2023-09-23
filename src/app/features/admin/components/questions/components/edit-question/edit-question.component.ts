import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionType } from '@core/enums/question-type.enum';
import { Category } from '@core/models/category.model';
import { Option, Question } from '@core/models/question.model';
import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';
import {
  selectMaterialCategories,
  selectMaterialsByCategoryId,
  selectMaterialsByCategoryIds
} from '@core/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, map, switchMap, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mhd-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {
  readonly questionType = QuestionType;

  editStringQuestionForm: FormGroup;
  editMaterialQuestionForm: FormGroup;

  categories$: Observable<Category[]>;
  categories: Category[] = [];

  materialOptions = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Question,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditQuestionComponent>,
    private questionService: QuestionService,
    private toastr: ToastrService,
    private store$: Store
  ) {
    this.editStringQuestionForm = this.fb.group({
      questionName: [this.data.questionName, Validators.required],
      question: [this.data.question, Validators.required],
      optionName: [''],
      options: this.fb.array<Option>(this.data.options),
      isExtraPrice: [false],
      extraPrice: [0]
    });

    this.editMaterialQuestionForm = this.fb.group({
      questionName: [this.data.questionName, Validators.required],
      question: [this.data.question, Validators.required],
      categoryId: [''],
      materialCategoryIds: this.fb.array<string>(this.data.materialCategoryIds),
      categories: [[]]
    });
  }

  ngOnInit(): void {
    this.categories$ = this.store$.select(selectMaterialCategories).pipe(
      switchMap((categories) =>
        this.store$
          .select(selectMaterialsByCategoryIds(this.data.materialCategoryIds))
          .pipe(
            tap((items) => {
              this.categories = categories;
              const selectedCategories = this.categories.filter((category) =>
                this.data.materialCategoryIds.includes(category.id)
              );
              this.editMaterialQuestionForm
                .get('categories')
                .patchValue(selectedCategories);

              this.materialOptions = items.map((item) => item.name);
            }),
            map(() => categories)
          )
      ),
      untilDestroyed(this)
    );
  }

  addStringOption(): void {
    const optionName = this.editStringQuestionForm.value.optionName.trim();
    const extraPrice = this.editStringQuestionForm.value.extraPrice;
    const option: Option = {
      optionName,
      extraPrice,
      slug: extraPrice ? optionName + ' +' + extraPrice + ' Ft' : optionName
    };

    if (option.optionName) {
      this.editStringQuestionForm.value.options.push(option);
      this.editStringQuestionForm.get('optionName').patchValue('');
      this.editStringQuestionForm.get('isExtraPrice').patchValue(false);
      this.editStringQuestionForm.get('extraPrice').patchValue(0);
      this.toastr.success('Választási lehetőség hozzáadva');
    } else {
      this.toastr.info('Kérlek adj meg egy választási lehetőséget');
    }
  }

  deleteStringOption(index: number): void {
    const options = this.editStringQuestionForm.get('options') as FormArray;
    options.removeAt(index);
  }

  addMaterialOption(): void {
    const categoryId = this.editMaterialQuestionForm.value.categoryId;
    const index = this.categories.findIndex(
      (category) => category.id === categoryId
    );
    const category = this.categories[index];
    this.editMaterialQuestionForm.value.materialCategoryIds.push(category.id);
    this.editMaterialQuestionForm.value.categories.push(category);

    this.store$
      .select(selectMaterialsByCategoryId(category.id))
      .pipe(
        tap((items) => {
          this.materialOptions = [
            ...this.materialOptions,
            ...items.filter((item) => item.isAvailable).map((item) => item.name)
          ];
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  deleteMaterialCategoryOption(categoryId: string, index: number): void {
    this.store$
      .select(selectMaterialsByCategoryId(categoryId))
      .pipe(
        tap((items) => {
          const deletedMaterialNames = items.map((item) => item.name);
          this.materialOptions = this.materialOptions.filter(
            (materialOption) => !deletedMaterialNames.includes(materialOption)
          );
          this.editMaterialQuestionForm.value.materialCategoryIds.splice(
            index,
            1
          );
          this.editMaterialQuestionForm.value.categories.splice(index, 1);
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  editQuestionWithStringAnser(): void {
    const questionName = this.editStringQuestionForm.value.questionName.trim();
    const question = this.editStringQuestionForm.value.question.trim();
    const options = this.editStringQuestionForm.value.options;

    const questionData: Question = {
      id: this.data.id,
      questionType: QuestionType.QUESTION_WITH_STRING_ANSWER,
      questionName,
      question,
      options
    };

    this.questionService
      .updateQuestion$(questionData)
      .pipe(
        tap(() => {
          this.toastr.success('Kérdés sikeresen hozzáadva');
          this.editStringQuestionForm.reset();
          this.dialogRef.close();
        })
      )
      .subscribe();
  }

  editQuestionWithMaterialCategoryAnswer(): void {
    const questionName =
      this.editMaterialQuestionForm.value.questionName.trim();
    const question = this.editMaterialQuestionForm.value.question.trim();
    const materialCategoryIds = this.editMaterialQuestionForm.value
      .materialCategoryIds as string[];

    const questionData: Question = {
      id: this.data.id,
      questionType: QuestionType.QUESTION_WITH_MATERIAL_CATEGORY_ANSWER,
      questionName,
      question,
      materialCategoryIds
    };

    this.questionService
      .updateQuestion$(questionData)
      .pipe(
        tap(() => {
          this.toastr.success('Kérdés sikeresen hozzáadva');
          this.editMaterialQuestionForm.reset();
          this.dialogRef.close();
        })
      )
      .subscribe();
  }

  onSubmit(): void {
    if (this.data.questionType === QuestionType.QUESTION_WITH_STRING_ANSWER) {
      if (
        this.editStringQuestionForm.valid &&
        this.editStringQuestionForm.value.options.length
      ) {
        this.editQuestionWithStringAnser();
      } else {
        this.toastr.info('Kérlek töltsd ki a kérdéshez szükséges mezőket');
      }
    } else {
      if (
        this.editMaterialQuestionForm.valid &&
        this.editMaterialQuestionForm.value.materialCategoryIds.length
      ) {
        this.editQuestionWithMaterialCategoryAnswer();
      } else {
        this.toastr.info('Kérlek töltsd ki a kérdéshez szükséges mezőket');
      }
    }
  }
}
