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
import { Observable, switchMap, tap } from 'rxjs';
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
        InputNumberModule
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

    editProductForm: FormGroup;
    imagesPreview: string[] = [];

    private readonly store = inject(Store);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly toastr = inject(ToastrService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.product$ = this.route.params.pipe(
            switchMap((params: { id: string }) =>
                this.store.select(ProductSelector.selectProductById(params.id))
            ),
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

    onEditProduct(): void {
        if (!this.editProductForm.valid) {
            this.toastr.info('Kérlek töltsd ki az összes mezőt!');

            return;
        }

        const product = this.editProductForm.value as Product;

        this.store.dispatch(ProductAction.updateProduct({ product }));
        this.router.navigate(['/admin/products']);
    }
}
