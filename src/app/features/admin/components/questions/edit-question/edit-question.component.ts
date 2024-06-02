import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, combineLatest, filter, map, switchMap, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

import { QuestionType } from '@core/enums/question-type.enum';
// import { Category, MaterialCategory } from '@core/models/category.model';
import { QuestionOption } from '@core/models/question.model';
import { Question, BackendQuestion } from '@core/models/question.model';
import { QuestionService } from '@core/services/question.service';
import { Log } from '@core/store/log/log.model';
import { ToastrService } from '@core/services/toastr.service';
import { LogService } from '@core/services/log.service';
import { CategoryService } from '@core/services/category.service';
import { MaterialService } from '@core/services/material.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Category, MaterialCategory } from '@core/store/category/category.model';

interface QuestionData extends Question {
    logs: Log[];
}

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

    editStringQuestionForm: FormGroup;
    editMaterialQuestionForm: FormGroup;
    question$: Observable<QuestionData>;
    questionId: string;
    questionType: QuestionType;
    categories$: Observable<Category[]>;
    categories: Category[] = [];
    selectedCategories: Category[] = [];
    isLoading = false;

    readonly QuestionType = QuestionType;

    constructor(
        private questionService: QuestionService,
        private categoryService: CategoryService,
        private materialService: MaterialService,
        private logService: LogService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        // this.question$ = this.route.params.pipe(
        //     switchMap((params) =>
        //         combineLatest([
        //             this.questionService.getQuestionById$(params['id']),
        //             this.logService
        //                 .getItemLogsByItemId$(params['id'])
        //                 .pipe(
        //                     map((logs) =>
        //                         logs.sort(
        //                             (a, b) =>
        //                                 new Date(b.timestamp).getTime() -
        //                                 new Date(a.timestamp).getTime()
        //                         )
        //                     )
        //                 )
        //         ])
        //     ),
        //     filter((question) => !!question),
        //     map(([question, logs]) => ({
        //         ...question,
        //         logs
        //     })),
        //     tap((question) => {
        //         console.log(question);
        //         this.questionId = question.id;
        //         this.questionType = question.type;
        //         this.editStringQuestionForm = this.fb.group({
        //             name: [question.name, Validators.required],
        //             question: [question.question, Validators.required],
        //             optionName: [''],
        //             options: this.fb.array<QuestionOption>(question.options),
        //             extraPrice: [0]
        //         });
        //         this.editMaterialQuestionForm = this.fb.group({
        //             name: [question.name, Validators.required],
        //             question: [question.question, Validators.required],
        //             categoryId: [''],
        //             materialCategories: this.fb.array<string>(question.materialCategories),
        //             options: this.fb.array<QuestionOption>(question.options)
        //         });
        //     })
        // );
        // this.categories$ = this.categoryService.getMaterialCategories$().pipe(
        //     tap((categories) => {
        //         categories.forEach((category) => {
        //             this.categories = categories;
        //             if (
        //                 this.editMaterialQuestionForm.value.materialCategories.find(
        //                     (id: string) => id === category.id
        //                 )
        //             ) {
        //                 this.selectedCategories.push(category);
        //             }
        //         });
        //     })
        // );
    }

    addStringOption(): void {
        const name = this.editStringQuestionForm.value.optionName.trim();
        const extraPrice = this.editStringQuestionForm.value.extraPrice;
        const option: QuestionOption = {
            name,
            extraPrice,
            slug: extraPrice ? name + ' +' + extraPrice + ' Ft' : name
        };

        const options = this.editStringQuestionForm.get('options') as FormArray;
        options.push(
            this.fb.group({
                name: option.name,
                extraPrice: option.extraPrice,
                slug: option.slug
            })
        );
        this.editStringQuestionForm.get('optionName').patchValue('');
        this.editStringQuestionForm.get('extraPrice').patchValue(0);
        this.toastr.success('Választási lehetőség hozzáadva');
    }

    deleteStringOption(index: number): void {
        const options = this.editStringQuestionForm.get('options') as FormArray;
        options.removeAt(index);
        this.toastr.success('Választási lehetőség törölve');
    }

    addMaterialOption(materialCategoryId: string): void {
        // this.categoryService
        //     .getCategoryById$(materialCategoryId)
        //     .pipe(
        //         tap((category: MaterialCategory) => {
        //             console.log(category);
        //             this.editMaterialQuestionForm.value.materialCategories.push(category.id);
        //             this.selectedCategories.push(category);
        //             const options = this.editMaterialQuestionForm.get('options') as FormArray;
        //             category.items.forEach((material) => {
        //                 if (material.isAvailable) {
        //                     const option = this.fb.group({
        //                         materialId: material.id,
        //                         name: material.name,
        //                         extraPrice: material.extraPrice,
        //                         slug: material.extraPrice
        //                             ? material.name + ' +' + material.extraPrice + ' Ft'
        //                             : material.name
        //                     });
        //                     options.push(option);
        //                 }
        //             });
        //             this.changeDetectorRef.detectChanges();
        //             this.toastr.success(`${category.name} kategória hozzáadva`);
        //         })
        //     )
        //     .subscribe();
    }

    deleteMaterialCategoryOption(categoryId: string, index: number): void {
        // this.materialService
        //     .getMaterialsByCategoryId$(categoryId)
        //     .pipe(
        //         tap((materials) => {
        //             const options = this.editMaterialQuestionForm.get('options') as FormArray;
        //             const materialIds = materials.map((item) => item.id);
        //             const materialOptions = options.controls.filter((control) =>
        //                 materialIds.includes(control.value.materialId)
        //             );
        //             materialOptions.forEach((option) => {
        //                 options.removeAt(options.controls.indexOf(option));
        //             });
        //             this.editMaterialQuestionForm.value.materialCategories.splice(index, 1);
        //             this.selectedCategories.splice(index, 1);
        //             this.changeDetectorRef.detectChanges();
        //             this.toastr.success('Kategória törölve');
        //         })
        //     )
        //     .subscribe();
    }

    editQuestionWithStringAnser(): void {
        const name = this.editStringQuestionForm.value.name.trim();
        const question = this.editStringQuestionForm.value.question.trim();
        const options = this.editStringQuestionForm.value.options;

        const questionData: BackendQuestion = {
            type: QuestionType.QUESTION_WITH_STRING_ANSWER,
            name,
            question,
            options
        };

        this.isLoading = true;

        this.questionService
            .updateQuestion$(this.questionId, questionData)
            .pipe(
                tap(() => {
                    this.isLoading = false;
                    this.toastr.success('Kérdés sikeresen módosítva');
                    this.editStringQuestionForm.reset();
                    this.router.navigate(['/admin/questions']);
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

        const questionData: BackendQuestion = {
            type: QuestionType.QUESTION_WITH_MATERIAL_CATEGORY_ANSWER,
            name,
            question,
            materialCategories,
            options
        };

        this.isLoading = true;
        this.questionService
            .updateQuestion$(this.questionId, questionData)
            .pipe(
                tap(() => {
                    this.isLoading = false;
                    this.toastr.success('Kérdés sikeresen módosítva');
                    this.editMaterialQuestionForm.reset();
                    this.router.navigate(['/admin/questions']);
                })
            )
            .subscribe();
    }

    onSubmit(): void {
        if (this.questionType === QuestionType.QUESTION_WITH_STRING_ANSWER) {
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
