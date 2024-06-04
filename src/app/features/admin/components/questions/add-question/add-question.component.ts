import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    inject
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription, map, startWith, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';

import {
    Question,
    QuestionType,
    QuestionTypeFormOption
} from '@core/store/question/question.model';
import { ToastrService } from '@core/services/toastr.service';
import { QuestionOption } from '@core/store/question/question.model';
import { MaterialCategory } from '@core/store/category/category.model';
import { QuestionAction } from '@core/store/question';
import { CategorySelector } from '@core/store/category';
import { MaterialSelector } from '@core/store/material';

@Component({
    selector: 'nyk-add-question',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CheckboxModule,
        ButtonModule,
        DropdownModule,
        SelectButtonModule,
        RadioButtonModule,
        InputTextModule,
        InputNumberModule,
        InputSwitchModule
    ],
    templateUrl: './add-question.component.html',
    styleUrls: ['./add-question.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddQuestionComponent implements OnInit {
    @HostBinding('class') hostClass = 'nyk-add-question';

    materialCategories$: Observable<MaterialCategory[]>;
    questionType$: Observable<QuestionType>;

    questionTypeForm: FormGroup;
    questionTypeFormOptions: QuestionTypeFormOption[];
    addCustomQuestionForm: FormGroup;
    addMaterialQuestionForm: FormGroup;
    selectedCategories: MaterialCategory[] = [];

    readonly QuestionType = QuestionType;

    private readonly store = inject(Store);
    private readonly fb = inject(FormBuilder);
    private readonly toastr = inject(ToastrService);
    private readonly router = inject(Router);

    ngOnInit(): void {
        this.questionTypeFormOptions = [
            {
                label: 'Kérdés egyedi válaszokkal',
                value: QuestionType.Custom
            },
            {
                label: 'Kérdés minta kategóriákkal',
                value: QuestionType.Material
            }
        ];

        this.questionTypeForm = this.fb.group({
            questionType: [QuestionType.Custom, Validators.required]
        });

        this.questionType$ = this.questionTypeForm.valueChanges.pipe(
            startWith(this.questionTypeForm.value),
            map(({ questionType }) => questionType)
        );

        this.addCustomQuestionForm = this.fb.group({
            isOptional: [false],
            name: [undefined, Validators.required],
            question: [undefined, Validators.required],
            optionName: [undefined],
            options: this.fb.array<QuestionOption>([], Validators.required),
            extraPrice: [0, Validators.required]
        });

        this.addMaterialQuestionForm = this.fb.group({
            isOptional: [false],
            name: [undefined, Validators.required],
            question: [undefined, Validators.required],
            category: [undefined],
            materialCategories: this.fb.array<string>([]),
            options: this.fb.array<QuestionOption>([], Validators.required)
        });

        this.materialCategories$ = this.store.select(CategorySelector.selectMaterialCategories());
    }

    onAddCustomOption(): void {
        const { optionName, extraPrice } = this.addCustomQuestionForm.value;
        const option: QuestionOption = {
            name: optionName,
            extraPrice,
            nameWithExtra: extraPrice ? optionName + ' +' + extraPrice + ' Ft' : optionName
        };

        (this.addCustomQuestionForm.get('options') as FormArray).push(
            this.fb.group({
                name: option.name,
                extraPrice: option.extraPrice,
                nameWithExtra: option.nameWithExtra
            })
        );
        this.addCustomQuestionForm.get('optionName').patchValue(undefined);
        this.addCustomQuestionForm.get('extraPrice').patchValue(0);
        this.toastr.success(`${option.name} opció hozzáadva.`);
    }

    onDeleteCustomOption(index: number): void {
        const deletedOption = (this.addCustomQuestionForm.get('options') as FormArray).at(index)
            .value as QuestionOption;
        (this.addCustomQuestionForm.get('options') as FormArray).removeAt(index);
        this.toastr.success(`${deletedOption.name} opció törölve.`);
    }

    addMaterialOption(materialCategoryId: string): void {
        const option$ = this.store
            .select(CategorySelector.selectMaterialCategoryById(materialCategoryId))
            .pipe(
                tap((category) => {
                    const isAlreadyAdded = this.selectedCategories.some(
                        (selectedCategory) => selectedCategory.id === category.id
                    );

                    if (isAlreadyAdded) {
                        this.toastr.warn('Kategória már hozzáadva.');

                        return;
                    }

                    this.addMaterialQuestionForm.value.materialCategories.push(category.id);
                    this.selectedCategories.push(category);
                    category.items.forEach((material) => {
                        if (material.isAvailable) {
                            const option = this.fb.group({
                                materialId: material.id,
                                name: material.name,
                                extraPrice: material.extraPrice,
                                nameWithExtra: material.extraPrice
                                    ? material.name + ' +' + material.extraPrice + ' Ft'
                                    : material.name
                            });
                            (this.addMaterialQuestionForm.get('options') as FormArray).push(option);
                        }
                    });
                    this.toastr.success(`${category.name} kategória hozzáadva.`);
                })
            )
            .subscribe();

        option$.unsubscribe();
    }

    deleteMaterialCategoryOption(categoryId: string, index: number): void {
        const deleteOption$ = this.store
            .select(MaterialSelector.selectMaterialsByCategoryId(categoryId))
            .pipe(
                tap((materials) => {
                    const options = this.addMaterialQuestionForm.get('options') as FormArray;
                    const materialIds = materials.map((material) => material.id);
                    const materialOptions = options.controls.filter((control) =>
                        materialIds.includes(control.value.materialId)
                    );
                    materialOptions.forEach((option) => {
                        options.removeAt(options.controls.indexOf(option));
                    });
                    this.addMaterialQuestionForm.value.materialCategories.splice(index, 1);
                    this.selectedCategories.splice(index, 1);
                    this.toastr.success('Kategória törölve.');
                })
            )
            .subscribe();

        deleteOption$.unsubscribe();
    }

    onSubmit(questionType: QuestionType): void {
        let newQuestion: Question;
        if (questionType === QuestionType.Custom && this.addCustomQuestionForm.valid) {
            const { name, question, options, isOptional } = this.addCustomQuestionForm.value;

            newQuestion = {
                isOptional,
                type: QuestionType.Custom,
                name,
                question,
                options
            };

            this.store.dispatch(QuestionAction.addQuestion({ question: newQuestion }));
            this.router.navigate(['/admin/questions']);

            return;
        }

        if (questionType === QuestionType.Material && this.addMaterialQuestionForm.valid) {
            const { name, question, materialCategories, options, isOptional } =
                this.addMaterialQuestionForm.value;

            newQuestion = {
                isOptional,
                type: QuestionType.Material,
                name,
                question,
                materialCategories,
                options
            };

            this.store.dispatch(QuestionAction.addQuestion({ question: newQuestion }));
            this.router.navigate(['/admin/questions']);

            return;
        }

        this.toastr.info('Kérlek töltsd ki a szükséges mezőket.');
    }
}
