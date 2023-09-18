import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { QuestionType } from '@core/enums/question-type.enum';
import { Category } from '@core/models/category.model';
import { Option, Question } from '@core/models/question.model';

import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';
import {
    selectMaterialCategories,
    selectMaterialsByCategoryId
} from '@core/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, tap, filter } from 'rxjs';

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

    addStringQuestionForm: FormGroup;
    addMaterialQuestionForm: FormGroup;

    categories$: Observable<Category[]>;
    categories: Category[] = [];

    questionTypeForm: FormGroup;
    questionTypeHelper = QuestionType.QUESTION_WITH_STRING_ANSWER;

    materialOptions = [];

    constructor(
        private fb: FormBuilder,
        private questionService: QuestionService,
        private toastr: ToastrService,
        private dialogRef: MatDialogRef<AddQuestionComponent>,
        private store$: Store
    ) {
        this.questionTypeForm = this.fb.group({
            questionType: [this.questionTypeHelper, Validators.required]
        });
        this.addStringQuestionForm = this.fb.group({
            questionName: ['', Validators.required],
            question: ['', Validators.required],
            optionName: [''],
            options: this.fb.array<Option[]>([], Validators.required),
            isExtraPrice: [false],
            extraPrice: [0]
        });
        this.addMaterialQuestionForm = this.fb.group({
            questionName: ['', Validators.required],
            question: ['', Validators.required],
            categoryId: [''],
            materialCategoryIds: [[], Validators.required],
            categories: [[]]
        });
    }

    ngOnInit(): void {
        this.categories$ = this.store$.select(selectMaterialCategories).pipe(
            filter((categories) => !!categories),
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
        const slug = extraPrice
            ? optionName + ' +' + extraPrice + ' Ft'
            : optionName;

        if (optionName) {
            (this.addStringQuestionForm.get('options') as FormArray).push(
                this.fb.group({
                    optionName,
                    extraPrice,
                    slug
                })
            );
            this.addStringQuestionForm.get('optionName').reset();
            this.addStringQuestionForm.get('isExtraPrice').reset();
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

        this.addMaterialQuestionForm.value.materialCategoryIds.push(
            this.categories[index].id
        );
        this.addMaterialQuestionForm
            .get('materialCategoryIds')
            .updateValueAndValidity();

        this.addMaterialQuestionForm.value.categories.push(
            this.categories[index]
        );

        this.store$
            .select(selectMaterialsByCategoryId(categoryId))
            .pipe(
                tap((items) => {
                    this.materialOptions = items.map((item) => item.name);
                    this.addMaterialQuestionForm.get('categoryId').reset();
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
                        (materialOption) =>
                            !deletedMaterialNames.includes(materialOption)
                    );

                    this.addMaterialQuestionForm.value.materialCategoryIds.splice(
                        index,
                        1
                    );

                    this.addMaterialQuestionForm.value.categories.splice(
                        index,
                        1
                    );
                }),
                untilDestroyed(this)
            )
            .subscribe();
    }

    onSubmit(): void {
        if (
            this.questionTypeHelper === QuestionType.QUESTION_WITH_STRING_ANSWER
        ) {
            if (this.addStringQuestionForm.valid) {
                const questionName =
                    this.addStringQuestionForm.value.questionName.trim();
                const question =
                    this.addStringQuestionForm.value.question.trim();
                const options = this.addStringQuestionForm.value
                    .options as Option[];

                const questionData: Question = {
                    questionType: QuestionType.QUESTION_WITH_STRING_ANSWER,
                    questionName,
                    question,
                    options
                };

                this.questionService
                    .addQuestion$(questionData)
                    .pipe(
                        tap(() => {
                            this.toastr.success('Kérdés sikeresen hozzáadva');
                            this.addStringQuestionForm.reset();
                            this.dialogRef.close();
                        })
                    )
                    .subscribe();
            } else {
                this.toastr.info(
                    'Kérlek töltsd ki a kérdéshez szükséges mezőket'
                );
            }
        } else {
            if (this.addMaterialQuestionForm.valid) {
                const questionName =
                    this.addMaterialQuestionForm.value.questionName.trim();
                const question =
                    this.addMaterialQuestionForm.value.question.trim();
                const materialCategoryIds =
                    this.addMaterialQuestionForm.value.materialCategoryIds;

                const questionData: Question = {
                    questionType:
                        QuestionType.QUESTION_WITH_MATERIAL_CATEGORY_ANSWER,
                    questionName,
                    question,
                    materialCategoryIds
                };

                this.questionService
                    .addQuestion$(questionData)
                    .pipe(
                        tap(() => {
                            this.toastr.success('Kérdés sikeresen hozzáadva');
                            this.dialogRef.close();
                            this.addMaterialQuestionForm.reset();
                        })
                    )
                    .subscribe();
            } else {
                this.toastr.info(
                    'Kérlek töltsd ki a kérdéshez szükséges mezőket'
                );
            }
        }
    }
}
