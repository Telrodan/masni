import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    inject
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragPreview,
    CdkDropList,
    moveItemInArray
} from '@angular/cdk/drag-drop';

import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { EditorModule } from 'primeng/editor';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

import { ToastrService } from '@core/services/toastr.service';
import {
    addImagesToFormAndSetPreview,
    removeImagesFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ProductCategory } from '@core/store/category/category.model';
import { CategorySelector } from '@core/store/category';
import { Product } from '@core/store/product/product.model';
import { ProductAction } from '@core/store/product';
import { Question, QuestionSelector } from '@core/store/question';

@Component({
    selector: 'nyk-add-product',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        DropdownModule,
        InputTextareaModule,
        ButtonModule,
        RadioButtonModule,
        InputTextModule,
        SpinnerComponent,
        DividerModule,
        InputSwitchModule,
        EditorModule,
        FormsModule,
        CdkDropList,
        CdkDrag,
        CdkDragPreview,
        InputNumberModule
    ],
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductComponent implements OnInit {
    @HostBinding('class') class = 'nyk-add-product';

    productSubCategories$: Observable<ProductCategory[]>;
    questions$: Observable<Question[]>;

    imagesPreview: string[] = [];
    selectedQuestions: Question[] = [];
    addProductForm: FormGroup;

    private readonly store = inject(Store);
    private readonly fb = inject(FormBuilder);
    private readonly toastr = inject(ToastrService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly router = inject(Router);

    ngOnInit(): void {
        this.productSubCategories$ = this.store.select(
            CategorySelector.selectProductSubCategories()
        );

        this.questions$ = this.store.select(QuestionSelector.selectQuestions());

        this.addProductForm = this.fb.group({
            name: ['', Validators.required],
            category: ['', Validators.required],
            shortDescription: ['', Validators.required],
            description: ['', Validators.required],
            images: [[], Validators.required],
            price: [0, Validators.required],
            discountedPrice: [0, Validators.required],
            stock: [0, Validators.required],
            isCustom: [false, Validators.required],
            questions: this.fb.array<string>([]),
            selectedQuestion: [undefined],
            isNameEmbroideryAvailable: [false, Validators.required],
            isDollDress: [false, Validators.required],
            isDressable: [false, Validators.required],
            isFeatured: [false, Validators.required],
            inspirationCategoryId: ['']
        });
    }

    async onImagePicked(event: Event): Promise<void> {
        this.imagesPreview = await addImagesToFormAndSetPreview(event, this.addProductForm);
        this.changeDetectorRef.detectChanges();

        if (this.imagesPreview.length > 4) {
            this.toastr.info('Maximum 4 képet tölthetsz fel!');
            this.imagesPreview = removeImagesFromFormAndInputAndClearPreview(
                this.addProductForm,
                event.target as HTMLInputElement
            );
        }
    }

    onImageClear(imageInput: HTMLInputElement): void {
        this.imagesPreview = removeImagesFromFormAndInputAndClearPreview(
            this.addProductForm,
            imageInput
        );
    }

    drop(event: CdkDragDrop<{ image: string }[]>) {
        moveItemInArray(this.imagesPreview, event.previousIndex, event.currentIndex);
        moveItemInArray(this.addProductForm.value.images, event.previousIndex, event.currentIndex);
    }

    onAddQuestion(questionId: string) {
        const question$$ = this.store
            .select(QuestionSelector.selectQuestionById(questionId))
            .pipe(
                tap((question) => {
                    this.selectedQuestions.push(question);
                    this.addProductForm.value.questions.push(question.id);
                    this.toastr.success(`${question.name} kérdés hozzáadva.`);
                })
            )
            .subscribe();

        question$$.unsubscribe();
    }

    onDeleteQuestion(questionId: string, index: number) {
        const question$$ = this.store
            .select(QuestionSelector.selectQuestionById(questionId))
            .pipe(
                tap((question) => {
                    this.selectedQuestions = this.selectedQuestions.filter(
                        (selectedQuestion) => selectedQuestion.id !== question.id
                    );
                    this.addProductForm.value.questions.splice(index, 1);
                    this.toastr.success(`${question.name} kérdés törölve.`);
                })
            )
            .subscribe();

        question$$.unsubscribe();
    }

    onAddProduct(): void {
        if (!this.addProductForm.valid) {
            this.toastr.info('Kérlek töltsd ki az összes mezőt');

            return;
        }

        const product = this.addProductForm.value as Product;

        if (product.questions.length === 0) {
            delete product.questions;
        }

        this.store.dispatch(ProductAction.addProduct({ product }));
        this.router.navigate(['/admin/products']);
    }
}
