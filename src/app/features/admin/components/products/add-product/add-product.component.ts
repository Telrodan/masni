import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

import { Observable, map, tap } from 'rxjs';
import { EditorModule } from 'primeng/editor';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';

import { BackendProduct } from '@core/models/product.model';
import { Question } from '@core/models/question.model';
import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import { CategoryService } from '@core/services/category.service';
import { QuestionService } from '@core/services/question.service';
import {
    addImagesToFormAndSetPreview,
    removeImagesFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ProductCategory, Category } from '@core/store/category/category.model';

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
        CdkDragPreview
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
    inspirationCategories$: Observable<Category[]>;
    isLoading = false;
    questions: Question[];
    selectedQuestions: Question[] = [];
    imagesPreview: string[] = [];
    addProductForm = this.fb.group({
        name: ['', Validators.required],
        categoryId: ['', Validators.required],
        inspirationCategoryId: [undefined],
        shortDescription: ['', Validators.required],
        description: ['', Validators.required],
        isCustom: [false, Validators.required],
        isDollDress: [false, Validators.required],
        isDressable: [false, Validators.required],
        isFeatured: [false, Validators.required],
        isNameEmbroideryAvailable: [false, Validators.required],
        selectedQuestion: [null],
        questions: this.fb.array<string>([]),
        images: [[], Validators.required],
        price: [0, Validators.required],
        discountedPrice: [0, Validators.required],
        stock: [0, Validators.required]
    });

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private questionService: QuestionService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private toastr: ToastrService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.productSubCategories$ = this.categoryService
            .getProductCategories$()
            .pipe(map((categories) => categories.filter((category) => category.isSubCategory)));

        this.inspirationCategories$ = this.categoryService.getInspirationCategories$();

        this.questions$ = this.questionService.getQuestions$().pipe(
            tap((questions) => {
                this.questions = questions;
            })
        );
    }

    addQuestion(id: string): void {
        if (id) {
            this.addProductForm.value.questions.push(id);
            const selectedQuestion = this.questions.find((question) => question.id === id);
            this.selectedQuestions.push(selectedQuestion);
            this.toastr.success('Kérdés hozzáadva');
            this.addProductForm.get('selectedQuestion').patchValue('');
        } else {
            this.toastr.info('Válassz egy kérdést');
        }
    }

    deleteQuestion(id: string, index: number): void {
        this.selectedQuestions.splice(index, 1);
        this.addProductForm.value.questions = this.addProductForm.value.questions.filter(
            (questionId) => questionId !== id
        );

        this.toastr.success('Kérdés törölve');
    }

    async onImagePicked(event: Event): Promise<void> {
        console.log((event.target as HTMLInputElement).files);
        this.imagesPreview = await addImagesToFormAndSetPreview(event, this.addProductForm);
        this.changeDetectorRef.markForCheck();

        if (this.imagesPreview.length > 4) {
            this.toastr.info('Maximum 4 képet tölthetsz fel');
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

    onAddProduct(): void {
        if (this.addProductForm.valid) {
            const product: BackendProduct = {
                name: this.addProductForm.value.name,
                categoryId: this.addProductForm.value.categoryId,
                inspirationCategoryId: this.addProductForm.value.inspirationCategoryId,
                shortDescription: this.addProductForm.value.shortDescription,
                isCustom: this.addProductForm.value.isCustom,
                isDollDress: this.addProductForm.value.isDollDress,
                isDressable: this.addProductForm.value.isDressable,
                isFeatured: this.addProductForm.value.isFeatured,
                isNameEmbroideryAvailable: this.addProductForm.value.isNameEmbroideryAvailable,
                description: this.addProductForm.value.description,
                questions: this.addProductForm.value.questions,
                images: this.addProductForm.value.images,
                price: this.addProductForm.value.price,
                discountedPrice: this.addProductForm.value.discountedPrice,
                stock: this.addProductForm.value.stock
            };

            if (product.name) {
                this.isLoading = true;
                this.productService
                    .addProduct$(product)
                    .pipe(
                        tap(() => {
                            this.isLoading = false;
                            this.toastr.success(`${product.name} hozzáadva`);
                            this.router.navigate(['/admin/products']);
                        })
                    )
                    .subscribe();
            } else {
                this.toastr.info('Kérlek add meg a termék nevét');
            }
        } else {
            this.toastr.info('Kérlek töltsd ki az összes mezőt');
        }
    }
}
