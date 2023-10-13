import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';

import { QuestionType } from '@core/enums/question-type.enum';
import { Category } from '@core/models/category.model';
import { QuestionOption } from '@core/models/question-option.model';
import { Question, RawQuestion } from '@core/models/question.model';
import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';
import {
  selectMaterialCategories,
  selectMaterialsByCategoryId
} from '@core/store';

@UntilDestroy()
@Component({
  selector: 'mhd-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditQuestionComponent implements OnInit {
  readonly questionType = QuestionType;

  editStringQuestionForm: FormGroup;
  editMaterialQuestionForm: FormGroup;

  categories$: Observable<Category[]>;
  categories: Category[] = [];
  selectedCategories: Category[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Question,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditQuestionComponent>,
    private questionService: QuestionService,
    private toastr: ToastrService,
    private store$: Store
  ) {
    this.editStringQuestionForm = this.fb.group({
      name: [this.data.name, Validators.required],
      question: [this.data.question, Validators.required],
      optionName: [''],
      options: this.fb.array<QuestionOption>(this.data.options),
      isExtraPrice: [false],
      extraPrice: [0]
    });

    this.editMaterialQuestionForm = this.fb.group({
      name: [this.data.name, Validators.required],
      question: [this.data.question, Validators.required],
      categoryId: [''],
      materialCategories: this.fb.array<string>(
        this.data.materialCategories.map((category) => category.id)
      ),
      options: this.fb.array<QuestionOption>(this.data.options)
    });
  }

  ngOnInit(): void {
    this.categories$ = this.store$.select(selectMaterialCategories).pipe(
      tap((categories) => {
        categories.forEach((category) => {
          this.categories = categories;
          if (
            this.editMaterialQuestionForm.value.materialCategories.find(
              (id: string) => id === category.id
            )
          ) {
            this.selectedCategories.push(category);
          }
        });
      }),
      untilDestroyed(this)
    );
  }

  addStringOption(): void {
    const name = this.editStringQuestionForm.value.optionName.trim();
    const extraPrice = this.editStringQuestionForm.value.extraPrice;
    const option: QuestionOption = {
      name,
      extraPrice,
      slug: extraPrice ? name + ' +' + extraPrice + ' Ft' : name
    };

    if (option.name) {
      const options = this.editStringQuestionForm.get('options') as FormArray;
      options.push(
        this.fb.group({
          name: option.name,
          extraPrice: option.extraPrice,
          slug: option.slug
        })
      );
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
    const category = this.categories.find(
      (category) => category.id === categoryId
    );

    if (category) {
      this.editMaterialQuestionForm.value.materialCategories.push(category.id);
      this.selectedCategories.push(category);

      this.store$
        .select(selectMaterialsByCategoryId(category.id))
        .pipe(
          tap((materials) => {
            const options = this.editMaterialQuestionForm.get(
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
          const options = this.editMaterialQuestionForm.get(
            'options'
          ) as FormArray;
          const materialIds = items.map((item) => item.id);
          const materialOptions = options.controls.filter((control) =>
            materialIds.includes(control.value.materialId)
          );
          materialOptions.forEach((option) => {
            options.removeAt(options.controls.indexOf(option));
          });

          this.editMaterialQuestionForm.value.materialCategories.splice(
            index,
            1
          );
          this.selectedCategories.splice(index, 1);
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  editQuestionWithStringAnser(): void {
    const name = this.editStringQuestionForm.value.name.trim();
    const question = this.editStringQuestionForm.value.question.trim();
    const options = this.editStringQuestionForm.value.options;

    const questionData: RawQuestion = {
      type: QuestionType.QUESTION_WITH_STRING_ANSWER,
      name,
      question,
      options
    };

    this.questionService
      .updateQuestion$(this.data.id, questionData)
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
    const name = this.editMaterialQuestionForm.value.name.trim();
    const question = this.editMaterialQuestionForm.value.question.trim();
    const materialCategories = this.editMaterialQuestionForm.value
      .materialCategories as string[];
    const options = this.editMaterialQuestionForm.value.options;

    const questionData: RawQuestion = {
      type: QuestionType.QUESTION_WITH_MATERIAL_CATEGORY_ANSWER,
      name,
      question,
      materialCategories,
      options
    };

    this.questionService
      .updateQuestion$(this.data.id, questionData)
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
    if (this.data.type === QuestionType.QUESTION_WITH_STRING_ANSWER) {
      if (this.editStringQuestionForm.valid) {
        this.editQuestionWithStringAnser();
      } else {
        this.toastr.info('Kérlek töltsd ki a kérdéshez szükséges mezőket');
      }
    } else {
      if (this.editMaterialQuestionForm.valid) {
        this.editQuestionWithMaterialCategoryAnswer();
      } else {
        this.toastr.info('Kérlek töltsd ki a kérdéshez szükséges mezőket');
      }
    }
  }
}
