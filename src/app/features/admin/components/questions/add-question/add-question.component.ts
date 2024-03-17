import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Observable, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';

import { QuestionType } from '@core/enums/question-type.enum';
import { Category, MaterialCategory } from '@core/models/category.model';
import { BackendQuestion } from '@core/models/question.model';
import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';
import { QuestionOption } from '@core/models/question.model';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { CategoryService } from '@core/services/category.service';
import { MaterialService } from '@core/services/material.service';

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

@Component({
    selector: 'nyk-add-question',
    standalone: true,
    imports: [
        CommonModule,
        DividerModule,
        ReactiveFormsModule,
        CheckboxModule,
        ButtonModule,
        DropdownModule,
        SelectButtonModule,
        RadioButtonModule,
        SpinnerComponent,
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

    categories$: Observable<Category[]>;
    categories: Category[] = [];
    selectedCategories: Category[] = [];
    isLoading = false;
    questionTypeHelper = QuestionType.QUESTION_WITH_STRING_ANSWER;
    questionTypeForm = this.fb.group({
        questionType: [this.questionTypeHelper, Validators.required]
    });
    addStringQuestionForm = this.fb.group({
        name: ['', Validators.required],
        question: ['', Validators.required],
        optionName: [''],
        options: this.fb.array<QuestionOption>([], Validators.required),
        extraPrice: [0, Validators.required]
    });
    addMaterialQuestionForm = this.fb.group({
        isOptional: [false],
        name: ['', Validators.required],
        question: ['', Validators.required],
        categoryId: [''],
        materialCategories: this.fb.array<string>([]),
        options: this.fb.array<QuestionOption>([], Validators.required)
    });

    readonly QuestionType = QuestionType;
    readonly questionTypeFormOptions = QUESTION_TYPE_FORM_OPTIONS;

    constructor(
        private questionService: QuestionService,
        private categoryService: CategoryService,
        private materialService: MaterialService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.categories$ = this.categoryService.getMaterialCategories$();

        this.questionTypeForm.valueChanges
            .pipe(
                tap((value) => {
                    this.questionTypeHelper = value.questionType;
                })
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

        const options = this.addStringQuestionForm.get('options') as FormArray;
        options.push(
            this.fb.group({
                name: option.name,
                extraPrice: option.extraPrice,
                slug: option.slug
            })
        );
        this.addStringQuestionForm.get('optionName').patchValue('');
        this.addStringQuestionForm.get('extraPrice').patchValue(0);
        this.toastr.success('Választási lehetőség hozzáadva');
    }

    deleteStringOption(index: number): void {
        const options = this.addStringQuestionForm.get('options') as FormArray;
        options.removeAt(index);
        this.toastr.success('Választási lehetőség törölve');
    }

    addMaterialOption(materialCategoryId: string): void {
        this.categoryService
            .getCategoryById$(materialCategoryId)
            .pipe(
                tap((category: MaterialCategory) => {
                    console.log(category);
                    this.addMaterialQuestionForm.value.materialCategories.push(
                        category.id
                    );
                    this.selectedCategories.push(category);
                    const options = this.addMaterialQuestionForm.get(
                        'options'
                    ) as FormArray;

                    category.items.forEach((material) => {
                        if (material.isAvailable) {
                            const option = this.fb.group({
                                materialId: material.id,
                                name: material.name,
                                extraPrice: material.extraPrice,
                                slug: material.extraPrice
                                    ? material.name +
                                      ' +' +
                                      material.extraPrice +
                                      ' Ft'
                                    : material.name
                            });
                            options.push(option);
                        }
                    });
                    this.changeDetectorRef.detectChanges();
                    this.toastr.success(`${category.name} kategória hozzáadva`);
                })
            )
            .subscribe();
    }

    deleteMaterialCategoryOption(categoryId: string, index: number): void {
        this.materialService
            .getMaterialsByCategoryId$(categoryId)
            .pipe(
                tap((materials) => {
                    const options = this.addMaterialQuestionForm.get(
                        'options'
                    ) as FormArray;
                    const materialIds = materials.map((item) => item.id);
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
                    this.changeDetectorRef.detectChanges();
                    this.toastr.success('Kategória törölve');
                })
            )
            .subscribe();
    }

    addQuestionWithStringAnswer(): void {
        const name = this.addStringQuestionForm.value.name.trim();
        const question = this.addStringQuestionForm.value.question.trim();
        const options = this.addStringQuestionForm.value.options;

        const questionObj: BackendQuestion = {
            type: QuestionType.QUESTION_WITH_STRING_ANSWER,
            name,
            question,
            options
        };
        this.isLoading = true;
        this.questionService
            .addQuestion$(questionObj)
            .pipe(
                tap(() => {
                    this.isLoading = false;
                    this.toastr.success('Kérdés sikeresen hozzáadva');
                    this.addStringQuestionForm.reset();
                    this.router.navigate(['/admin/questions']);
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

        const questionObj: BackendQuestion = {
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

        this.isLoading = true;
        this.questionService
            .addQuestion$(questionObj)
            .pipe(
                tap(() => {
                    this.isLoading = false;
                    this.toastr.success('Kérdés sikeresen hozzáadva');
                    this.addMaterialQuestionForm.reset();
                    this.router.navigate(['/admin/questions']);
                })
            )
            .subscribe();
    }

    onSubmit(): void {
        if (
            this.questionTypeHelper ===
                QuestionType.QUESTION_WITH_STRING_ANSWER &&
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
