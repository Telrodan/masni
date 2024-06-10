import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    inject
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

import { Store } from '@ngrx/store';
import { Observable, map, switchMap, tap } from 'rxjs';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';

import { ToastrService } from '@core/services/toastr.service';
import {
    addImagesToFormAndSetPreview,
    removeImagesFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Category } from '@core/store/category/category.model';
import { Product } from '@core/store/product/product.model';
import { CategorySelector } from '@core/store/category';
import { ProductAction, ProductSelector } from '@core/store/product';
import { Log } from '@core/store/log/log.model';
import { LogSelector } from '@core/store/log/log.selectors';
import { ItemHistoryComponent } from '@shared/item-history/item-history.component';
import { Question, QuestionSelector } from '@core/store/question';

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
        TableModule,
        InputNumberModule,
        ItemHistoryComponent
    ],
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class EditProductComponent implements OnInit {
    @HostBinding('class') class = 'nyk-edit-product';

    product$: Observable<Product>;
    productSubCategories$: Observable<Category[]>;
    questions$: Observable<Question[]>;
    logs$: Observable<Log[]>;

    editProductForm: FormGroup;
    selectedQuestions: Question[] = [];
    imagesPreview: string[] = [];

    private readonly store = inject(Store);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly toastr = inject(ToastrService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    ngOnInit(): void {
        const productId$ = this.route.params.pipe(map((params: { id: string }) => params.id));

        this.product$ = productId$.pipe(
            switchMap((id) => this.store.select(ProductSelector.selectProductById(id))),
            tap((product) => {
                this.editProductForm = this.fb.group({
                    id: [product.id, Validators.required],
                    name: [product.name, Validators.required],
                    category: [product.category.id, Validators.required],
                    shortDescription: [product.shortDescription, Validators.required],
                    description: [product.description, Validators.required],
                    images: [product.images, Validators.required],
                    price: [product.price, Validators.required],
                    discountedPrice: [product.discountedPrice, Validators.required],
                    stock: [product.stock, Validators.required],
                    isCustom: [product.isCustom, Validators.required],
                    questions: this.fb.array<string>([]),
                    selectedQuestion: [undefined],
                    isNameEmbroideryAvailable: [
                        product.isNameEmbroideryAvailable,
                        Validators.required
                    ],
                    isDollDress: [product.isDollDress, Validators.required],
                    isDressable: [product.isDressable, Validators.required],
                    isFeatured: [product.isFeatured, Validators.required],
                    inspirationCategoryId: [product?.inspirationCategory?.id]
                });

                this.imagesPreview = product.images;
            })
        );

        this.productSubCategories$ = this.store.select(
            CategorySelector.selectProductSubCategories()
        );

        this.questions$ = this.store.select(QuestionSelector.selectQuestions());

        this.logs$ = productId$.pipe(
            switchMap((id) => this.store.select(LogSelector.selectLogsByItemId(id)))
        );
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

    drop(event: CdkDragDrop<{ image: string }[]>): void {
        moveItemInArray(this.imagesPreview, event.previousIndex, event.currentIndex);
        moveItemInArray(this.editProductForm.value.images, event.previousIndex, event.currentIndex);
    }

    onAddQuestion(questionId: string) {
        const question$$ = this.store
            .select(QuestionSelector.selectQuestionById(questionId))
            .pipe(
                tap((question) => {
                    this.selectedQuestions.push(question);
                    this.editProductForm.value.questions.push(question.id);
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
                    this.editProductForm.value.questions.splice(index, 1);
                    this.toastr.success(`${question.name} kérdés törölve.`);
                })
            )
            .subscribe();

        question$$.unsubscribe();
    }

    onEditProduct(): void {
        if (!this.editProductForm.valid) {
            this.toastr.info('Kérlek töltsd ki az összes mezőt!');

            return;
        }

        const product = this.editProductForm.value as Product;

        if (product.questions.length === 0) {
            delete product.questions;
        }

        this.store.dispatch(ProductAction.updateProduct({ product }));
        this.router.navigate(['/admin/products']);
    }
}
