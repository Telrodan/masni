import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { QuestionType } from '@core/enums/question-type.enum';
import { Category } from '@core/models/category.model';
import { RawQuestion } from '@core/models/question.model';
import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';
import {
  selectMaterialCategories,
  selectMaterialsByCategoryId
} from '@core/store';
import { QuestionOption } from '@core/models/question-option.model';

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
  readonly QuestionType = QuestionType;
  readonly questionTypeFormOptions = QUESTION_TYPE_FORM_OPTIONS;

  addStringQuestionForm = this.fb.group({
    name: ['', Validators.required],
    question: ['', Validators.required],
    optionName: [''],
    options: this.fb.array<QuestionOption>([], Validators.required),
    isExtraPrice: [false],
    extraPrice: [0]
  });

  addMaterialQuestionForm = this.fb.group({
    isOptional: [false],
    name: ['', Validators.required],
    question: ['', Validators.required],
    categoryId: [''],
    materialCategories: this.fb.array<string>([]),
    options: this.fb.array<QuestionOption>([], Validators.required)
  });

  categories$: Observable<Category[]>;
  categories: Category[] = [];
  selectedCategories: Category[] = [];

  questionTypeHelper = QuestionType.QUESTION_WITH_STRING_ANSWER;
  questionTypeForm = this.fb.group({
    questionType: [this.questionTypeHelper, Validators.required]
  });

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
    const name = this.addStringQuestionForm.value.optionName.trim();
    const extraPrice = this.addStringQuestionForm.value.extraPrice;
    const option: QuestionOption = {
      name,
      extraPrice,
      slug: extraPrice ? name + ' +' + extraPrice + ' Ft' : name
    };

    if (option.name) {
      const options = this.addStringQuestionForm.get('options') as FormArray;
      options.push(
        this.fb.group({
          name: option.name,
          extraPrice: option.extraPrice,
          slug: option.slug
        })
      );
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
    const category = this.categories.find(
      (category) => category.id === categoryId
    );

    if (category) {
      this.addMaterialQuestionForm.value.materialCategories.push(category.id);
      this.selectedCategories.push(category);

      this.store$
        .select(selectMaterialsByCategoryId(category.id))
        .pipe(
          tap((materials) => {
            const options = this.addMaterialQuestionForm.get(
              'options'
            ) as FormArray;

            materials.forEach((material) => {
              if (material.isAvailable) {
                const option = this.fb.group({
                  materialId: material.id,
                  name: material.name,
                  extraPrice: material.extraPrice,
                  slug: material.extraPrice
                    ? material.name + ' +' + material.extraPrice + ' Ft'
                    : material.name
                });
                options.push(option);
              }
            });
          }),
          untilDestroyed(this)
        )
        .subscribe();
    } else {
      this.toastr.info('Kérlek válassz egy anyag kategóriát');
    }
  }

  deleteMaterialCategoryOption(categoryId: string, index: number): void {
    this.store$
      .select(selectMaterialsByCategoryId(categoryId))
      .pipe(
        tap((items) => {
          const options = this.addMaterialQuestionForm.get(
            'options'
          ) as FormArray;
          const materialIds = items.map((item) => item.id);
          const materialOptions = options.controls.filter((control) =>
            materialIds.includes(control.value.materialId)
          );
          materialOptions.forEach((option) => {
            options.removeAt(options.controls.indexOf(option));
          });

          this.addMaterialQuestionForm.value.materialCategories.splice(
            index,
            1
          );
          this.selectedCategories.splice(index, 1);
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  addQuestionWithStringAnswer(): void {
    const name = this.addStringQuestionForm.value.name.trim();
    const question = this.addStringQuestionForm.value.question.trim();
    const options = this.addStringQuestionForm.value.options;

    const questionObj: RawQuestion = {
      type: QuestionType.QUESTION_WITH_STRING_ANSWER,
      name,
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
    const name = this.addMaterialQuestionForm.value.name.trim();
    const question = this.addMaterialQuestionForm.value.question.trim();
    const materialCategories =
      this.addMaterialQuestionForm.value.materialCategories;
    const options = this.addMaterialQuestionForm.value.options;
    const questionObj: RawQuestion = {
      type: QuestionType.QUESTION_WITH_MATERIAL_CATEGORY_ANSWER,
      name,
      question,
      materialCategories,
      options
    };

    if (this.addMaterialQuestionForm.value.isOptional) {
      questionObj.options.unshift({
        name: 'Nem kérek!',
        extraPrice: 0,
        slug: 'Nem kérek!'
      });
    }

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
    if (
      this.questionTypeHelper === QuestionType.QUESTION_WITH_STRING_ANSWER &&
      this.addStringQuestionForm.valid
    ) {
      this.addQuestionWithStringAnswer();
    } else if (
      this.questionTypeHelper ===
        QuestionType.QUESTION_WITH_MATERIAL_CATEGORY_ANSWER &&
      this.addMaterialQuestionForm.valid
    ) {
      this.addQuestionWithMaterialCategoryAnswer();
    } else {
      this.toastr.info('Kérlek töltsd ki a kérdéshez szükséges mezőket');
    }
  }
}
