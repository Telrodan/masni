import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragPreview,
    CdkDropList,
    moveItemInArray
} from '@angular/cdk/drag-drop';

import { Observable, combineLatest, filter, map, switchMap, tap } from 'rxjs';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';

import { Question } from '@core/models/question.model';
import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import { CategoryService } from '@core/services/category.service';
import { Log } from '@core/models/log.model';
import { LogService } from '@core/services/log.service';
import { QuestionService } from '@core/services/question.service';
import {
    addImagesToFormAndSetPreview,
    removeImagesFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Category } from '@core/store/category/category.model';
import { Product, BackendProduct } from '@core/store/product/product.model';

interface ProductData extends Product {
    logs: Log[];
}

@Component({
    selector: 'nyk-edit-product',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        DropdownModule,
        InputTextareaModule,
        ButtonModule,
        RadioButtonModule,
        SpinnerComponent,
        EditorModule,
        InputTextModule,
        DividerModule,
        InputSwitchModule,
        CdkDropList,
        CdkDrag,
        CdkDragPreview,
        TableModule
    ],
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class EditProductComponent implements OnInit {
    @HostBinding('class') class = 'nyk-edit-product';

    product$: Observable<ProductData>;
    categories$: Observable<Category[]>;
    inspirationCategories$: Observable<Category[]>;
    questions$: Observable<Question[]>;
    productId: string;
    isLoading = false;
    questions: Question[];
    selectedQuestions: Question[] = [];
    editProductForm: FormGroup;
    imagesPreview: string[] = [];

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private questionService: QuestionService,
        private logService: LogService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.product$ = this.route.params.pipe(
            switchMap((params) =>
                combineLatest([
                    this.productService.getProductById$(params['id']),
                    this.logService.getItemLogsByItemId$(params['id'])
                ])
            ),
            filter((product) => !!product),
            map(([product, logs]) => ({
                ...product,
                logs: logs.sort(
                    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                )
            })),
            tap((product) => {
                this.productId = product.id;
                this.selectedQuestions = product.questions;
                this.editProductForm = this.fb.group({
                    name: [product.name, Validators.required],
                    categoryId: [product.category.id, Validators.required],
                    inspirationCategoryId: [product?.inspirationCategory?.id],
                    shortDescription: [product.shortDescription, Validators.required],
                    description: [product.description, Validators.required],
                    isCustom: [product.isCustom, Validators.required],
                    isDollDress: [product.isDollDress, Validators.required],
                    isDressable: [product.isDressable, Validators.required],
                    isFeatured: [product.isFeatured, Validators.required],
                    isNameEmbroideryAvailable: [
                        product.isNameEmbroideryAvailable,
                        Validators.required
                    ],
                    selectedQuestion: [null],
                    questions: this.fb.array<string>(product.questions.map((q) => q.id)),
                    images: [product.images, Validators.required],
                    price: [product.price, Validators.required],
                    discountedPrice: [product.discountedPrice, Validators.required],
                    stock: [product.stock, Validators.required]
                });

                this.imagesPreview = product.images;
            })
        );

        this.categories$ = this.categoryService
            .getProductCategories$()
            .pipe(map((categories) => categories.filter((category) => category.isSubCategory)));

        this.questions$ = this.questionService.getQuestions$().pipe(
            tap((questions) => {
                this.questions = questions;
            })
        );

        this.inspirationCategories$ = this.categoryService.getInspirationCategories$();
    }

    drop(event: CdkDragDrop<{ image: string }[]>): void {
        moveItemInArray(this.editProductForm.value.images, event.previousIndex, event.currentIndex);
    }

    addQuestion(id: string): void {
        if (id) {
            this.editProductForm.value.questions.push(id);
            const selectedQuestion = this.questions.find((question) => question.id === id);
            this.selectedQuestions.push(selectedQuestion);
            this.toastr.success('Kérdés hozzáadva');
            this.editProductForm.get('selectedQuestion').patchValue('');
        } else {
            this.toastr.info('Válassz egy kérdést');
        }
    }

    deleteQuestion(id: string, index: number): void {
        this.editProductForm.value.questions = this.editProductForm.value.questions.filter(
            (questionId: string) => questionId !== id
        );
        this.selectedQuestions.splice(index, 1);
        this.editProductForm.markAsDirty();
        this.toastr.success('Kérdés törölve');
    }

    async onImagePicked(event: Event): Promise<void> {
        this.imagesPreview = await addImagesToFormAndSetPreview(event, this.editProductForm);
        this.changeDetectorRef.detectChanges();
    }

    onImageClear(imageInput: HTMLInputElement): void {
        this.imagesPreview = removeImagesFromFormAndInputAndClearPreview(
            this.editProductForm,
            imageInput
        );
    }

    onEditProduct(): void {
        if (this.editProductForm.valid) {
            const product: BackendProduct = {
                categoryId: this.editProductForm.value.categoryId,
                inspirationCategoryId: this.editProductForm.value?.inspirationCategoryId,
                name: this.editProductForm.value.name,
                shortDescription: this.editProductForm.value.shortDescription,
                description: this.editProductForm.value.description,
                questions: this.editProductForm.value.questions,
                isCustom: this.editProductForm.value.isCustom,
                isDollDress: this.editProductForm.value.isDollDress,
                isDressable: this.editProductForm.value.isDressable,
                isFeatured: this.editProductForm.value.isFeatured,
                isNameEmbroideryAvailable: this.editProductForm.value.isNameEmbroideryAvailable,
                images: this.editProductForm.value.images,
                price: this.editProductForm.value.price,
                discountedPrice: this.editProductForm.value.discountedPrice,
                stock: this.editProductForm.value.stock
            };
            if (product.name) {
                this.isLoading = true;
                console.log(product);
                this.productService
                    .updateProduct$(product, this.productId)
                    .pipe(
                        tap((product) => {
                            this.isLoading = false;
                            this.toastr.success(`${product.name} termék módosítva`);
                            this.router.navigate(['/admin/products']);
                        })
                    )
                    .subscribe();
            } else {
                this.toastr.info('Kérlek adj meg egy termék nevet');
            }
        } else {
            this.toastr.info('Kérlek töltsd ki az összes mezőt');
        }
    }
}
