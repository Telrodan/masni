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
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, map, switchMap, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

import { QuestionOption, QuestionType } from '@core/store/question/question.model';
import { Question } from '@core/store/question/question.model';
import { ToastrService } from '@core/services/toastr.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { MaterialCategory } from '@core/store/category/category.model';
import { QuestionAction, QuestionSelector } from '@core/store/question';
import { CategorySelector } from '@core/store/category';
import { MaterialSelector } from '@core/store/material';
import { Log } from '@core/store/log';

@Component({
    selector: 'nyk-edit-question',
    standalone: true,
    imports: [
        CommonModule,
        DividerModule,
        ReactiveFormsModule,
        CheckboxModule,
        ButtonModule,
        DropdownModule,
        SpinnerComponent,
        InputTextModule,
        InputNumberModule,
        TableModule
    ],
    templateUrl: './edit-question.component.html',
    styleUrls: ['./edit-question.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditQuestionComponent implements OnInit {
    @HostBinding('class') hostClass = 'nyk-edit-question';

    question$: Observable<Question>;
    materialCategories$: Observable<MaterialCategory[]>;
    logs$: Observable<Log[]>;

    editCustomQuestionForm: FormGroup;
    editMaterialQuestionForm: FormGroup;
    selectedCategories: MaterialCategory[] = [];

    readonly QuestionType = QuestionType;

    private readonly store = inject(Store);
    private readonly fb = inject(FormBuilder);
    private readonly toastr = inject(ToastrService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    ngOnInit(): void {
        const questionId$ = this.route.params.pipe(map((params: { id: string }) => params.id));

        this.question$ = questionId$.pipe(
            switchMap((id) => this.store.select(QuestionSelector.selectQuestionById(id))),
            tap((question) => {
                if (!question) {
                    this.store.dispatch(QuestionAction.getQuestions());

                    return;
                }
                console.log('debug', question);
                this.editCustomQuestionForm = this.fb.group({
                    id: [question.id],
                    isOptional: [question.isOptional],
                    name: [question.name, Validators.required],
                    question: [question.question, Validators.required],
                    optionName: [''],
                    options: this.fb.array<QuestionOption>(question.options),
                    extraPrice: [0]
                });

                this.editMaterialQuestionForm = this.fb.group({
                    id: [question.id],
                    isOptional: [question.isOptional],
                    name: [question.name, Validators.required],
                    question: [question.question, Validators.required],
                    category: [null],
                    materialCategories: this.fb.array<string>(
                        question.materialCategories.map((category) => category.id)
                    ),
                    options: this.fb.array<QuestionOption>(question.options)
                });

                if (question.type === QuestionType.Material) {
                    this.selectedCategories = [...question.materialCategories];
                }
            })
        );

        this.materialCategories$ = this.store.select(CategorySelector.selectMaterialCategories());
    }

    onAddCustomOption(): void {
        const { optionName, extraPrice } = this.editCustomQuestionForm.value;
        const option: QuestionOption = {
            name: optionName,
            extraPrice,
            nameWithExtra: extraPrice ? optionName + ' +' + extraPrice + ' Ft' : optionName
        };

        (this.editCustomQuestionForm.get('options') as FormArray).push(
            this.fb.group({
                name: option.name,
                extraPrice: option.extraPrice,
                nameWithExtra: option.nameWithExtra
            })
        );
        this.editCustomQuestionForm.get('optionName').patchValue(undefined);
        this.editCustomQuestionForm.get('extraPrice').patchValue(0);
        this.toastr.success(`${option.name} opció hozzáadva.`);
    }

    onDeleteCustomOption(index: number): void {
        const deletedOption = (this.editCustomQuestionForm.get('options') as FormArray).at(index)
            .value as QuestionOption;
        (this.editCustomQuestionForm.get('options') as FormArray).removeAt(index);
        this.toastr.success(`${deletedOption.name} opció törölve.`);
    }

    onAddMaterialOption(materialCategoryId: string): void {
        console.log('debug', materialCategoryId);
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

                    this.editMaterialQuestionForm.value.materialCategories.push(category.id);
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
                            (this.editMaterialQuestionForm.get('options') as FormArray).push(
                                option
                            );
                        }
                    });
                    this.toastr.success(`${category.name} kategória hozzáadva.`);
                })
            )
            .subscribe();

        option$.unsubscribe();
    }

    onDeleteMaterialCategoryOption(categoryId: string, index: number): void {
        const deleteOption$ = this.store
            .select(MaterialSelector.selectMaterialsByCategoryId(categoryId))
            .pipe(
                tap((materials) => {
                    const options = this.editMaterialQuestionForm.get('options') as FormArray;
                    const materialIds = materials.map((material) => material.id);
                    const materialOptions = options.controls.filter((control) =>
                        materialIds.includes(control.value.materialId)
                    );
                    materialOptions.forEach((option) => {
                        options.removeAt(options.controls.indexOf(option));
                    });
                    this.editMaterialQuestionForm.value.materialCategories.splice(index, 1);
                    this.selectedCategories.splice(index, 1);
                    this.toastr.success('Kategória törölve.');
                })
            )
            .subscribe();

        deleteOption$.unsubscribe();
    }

    onSubmit(questionType: QuestionType): void {
        let updatedQuestion: Question;
        if (questionType === QuestionType.Custom && this.editCustomQuestionForm.valid) {
            const { id, name, question, options, isOptional } = this.editCustomQuestionForm.value;

            updatedQuestion = {
                id,
                isOptional,
                type: QuestionType.Custom,
                name,
                question,
                options
            };

            this.store.dispatch(QuestionAction.updateQuestion({ question: updatedQuestion }));
            this.router.navigate(['/admin/questions']);

            return;
        }

        if (questionType === QuestionType.Material && this.editMaterialQuestionForm.valid) {
            const { id, name, question, materialCategories, options, isOptional } =
                this.editMaterialQuestionForm.value;

            updatedQuestion = {
                id,
                isOptional,
                type: QuestionType.Material,
                name,
                question,
                materialCategories,
                options
            };

            this.store.dispatch(QuestionAction.updateQuestion({ question: updatedQuestion }));
            this.router.navigate(['/admin/questions']);

            return;
        }

        this.toastr.info('Kérlek töltsd ki a szükséges mezőket.');
    }
}
