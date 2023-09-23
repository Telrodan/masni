import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { QuestionType } from '@core/enums/question-type.enum';
import { Category } from '@core/models/category.model';
import { Option, Question } from '@core/models/question.model';
import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';
import {
  selectMaterialCategories,
  selectMaterialsByCategoryId
} from '@core/store';

const QUESTION_TYPE_FORM_OPTIONS = [
  {
    label: 'Kérdés hozzáadható válaszokkal',
    value: QuestionType.QUESTION_WITH_STRING_ANSWER
  },
  {
    label: 'Kérdés hozzáadható anyag kategóriákkal',
    value: QuestionType.QUESTION_WITH_MATERIAL_CATEGORY_ANSWER
  }
];

@UntilDestroy()
@Component({
  selector: 'mhd-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
  readonly questionType = QuestionType;
  readonly questionTypeFormOptions = QUESTION_TYPE_FORM_OPTIONS;

  addStringQuestionForm = this.fb.group({
    questionName: ['', Validators.required],
    question: ['', Validators.required],
    optionName: [''],
    options: this.fb.array<Option[]>([]),
    isExtraPrice: [false],
    extraPrice: [0]
  });
  addMaterialQuestionForm = this.fb.group({
    questionName: ['', Validators.required],
    question: ['', Validators.required],
    categoryId: [''],
    materialCategoryIds: this.fb.array<string[]>([]),
    categories: this.fb.array<Category[]>([])
  });

  categories$: Observable<Category[]>;
  categories: Category[] = [];

  questionTypeHelper = QuestionType.QUESTION_WITH_STRING_ANSWER;
  questionTypeForm = this.fb.group({
    questionType: [this.questionTypeHelper, Validators.required]
  });

  materialOptions = [];

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddQuestionComponent>,
    private store$: Store
  ) {}

  ngOnInit(): void {
    this.categories$ = this.store$.select(selectMaterialCategories).pipe(
      tap((categories) => {
        this.categories = categories;
      }),
      untilDestroyed(this)
    );

    this.questionTypeForm.valueChanges
      .pipe(
        tap((value) => {
          this.questionTypeHelper = value.questionType;
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  addStringOption(): void {
    const optionName = this.addStringQuestionForm.value.optionName.trim();
    const extraPrice = this.addStringQuestionForm.value.extraPrice;
    const option: Option = {
      optionName,
      extraPrice,
      slug: extraPrice ? optionName + ' +' + extraPrice + ' Ft' : optionName
    };

    if (option.optionName) {
      this.addStringQuestionForm.value.options.push(option);
      this.addStringQuestionForm.get('optionName').patchValue('');
      this.addStringQuestionForm.get('isExtraPrice').patchValue(false);
      this.addStringQuestionForm.get('extraPrice').patchValue(0);
      this.toastr.success('Választási lehetőség hozzáadva');
    } else {
      this.toastr.info('Kérlek adj meg egy választási lehetőséget');
    }
  }

  deleteStringOption(index: number): void {
    const options = this.addStringQuestionForm.get('options') as FormArray;
    options.removeAt(index);
  }

  addMaterialOption(): void {
    const categoryId = this.addMaterialQuestionForm.value.categoryId;
    const index = this.categories.findIndex(
      (category) => category.id === categoryId
    );
    const category = this.categories[index];
    this.addMaterialQuestionForm.value.materialCategoryIds.push(category.id);
    this.addMaterialQuestionForm.value.categories.push(category);

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
          this.addMaterialQuestionForm.value.materialCategoryIds.splice(
            index,
            1
          );
          this.addMaterialQuestionForm.value.categories.splice(index, 1);
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  addQuestionWithStringAnswer(): void {
    const questionName = this.addStringQuestionForm.value.questionName.trim();
    const question = this.addStringQuestionForm.value.question.trim();
    const options = this.addStringQuestionForm.value.options;

    const questionObj: Question = {
      questionType: QuestionType.QUESTION_WITH_STRING_ANSWER,
      questionName,
      question,
      options
    };

    this.questionService
      .addQuestion$(questionObj)
      .pipe(
        tap(() => {
          this.toastr.success('Kérdés sikeresen hozzáadva');
          this.addStringQuestionForm.reset();
          this.dialogRef.close();
        })
      )
      .subscribe();
  }

  addQuestionWithMaterialCategoryAnswer(): void {
    const questionName = this.addMaterialQuestionForm.value.questionName.trim();
    const question = this.addMaterialQuestionForm.value.question.trim();
    const materialCategoryIds =
      this.addMaterialQuestionForm.value.materialCategoryIds;

    const questionObj: Question = {
      questionType: QuestionType.QUESTION_WITH_MATERIAL_CATEGORY_ANSWER,
      questionName,
      question,
      materialCategoryIds
    };

    this.questionService
      .addQuestion$(questionObj)
      .pipe(
        tap(() => {
          this.toastr.success('Kérdés sikeresen hozzáadva');
          this.dialogRef.close();
          this.addMaterialQuestionForm.reset();
        })
      )
      .subscribe();
  }

  onSubmit(): void {
    if (this.questionTypeHelper === QuestionType.QUESTION_WITH_STRING_ANSWER) {
      if (
        this.addStringQuestionForm.valid &&
        this.addStringQuestionForm.value.options.length
      ) {
        this.addQuestionWithStringAnswer();
      } else {
        this.toastr.info('Kérlek töltsd ki a kérdéshez szükséges mezőket');
      }
    } else if (
      this.questionTypeHelper ===
      QuestionType.QUESTION_WITH_MATERIAL_CATEGORY_ANSWER
    ) {
      if (
        this.addMaterialQuestionForm.valid &&
        this.addMaterialQuestionForm.value.materialCategoryIds.length
      ) {
        this.addQuestionWithMaterialCategoryAnswer();
      } else {
        this.toastr.info('Kérlek töltsd ki a kérdéshez szükséges mezőket');
      }
    }
  }
}
