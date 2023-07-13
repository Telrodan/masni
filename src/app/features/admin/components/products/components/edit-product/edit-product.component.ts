import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable, filter, tap } from 'rxjs';

import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import { Category } from '@core/models/category.model';
import { Product } from '@core/models/product.model';
import { selectAllCategories } from '@core/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'mhd-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  categories$: Observable<Category[]>;
  editProductForm: FormGroup;
  imagesPreview: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private store$: Store,
    private dialogRef: MatDialogRef<EditProductComponent>,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initEditProductForm(this.data);
    this.imagesPreview = this.data.images;

    this.categories$ = this.store$.select(selectAllCategories).pipe(
      filter((categories) => !!categories),
      untilDestroyed(this)
    );
  }

  async onImagesPicked(event: Event): Promise<void> {
    this.imagesPreview = [];
    const files = Array.from((event.target as HTMLInputElement).files);
    this.editProductForm.patchValue({ images: files });
    this.editProductForm.get('images').updateValueAndValidity();

    if (files && files[0]) {
      const numberOfFiles = files.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.imagesPreview.push(e.target.result);
        };

        reader.readAsDataURL(files[i]);
      }
    }
  }

  onImageClear(): void {
    this.imagesPreview = [];
    this.editProductForm.value.images = null;
    this.editProductForm.patchValue({ images: null });
    this.editProductForm.get('images').updateValueAndValidity();
  }

  onEditProduct(): void {
    if (this.editProductForm.valid) {
      const editedProduct = new FormData();
      editedProduct.append('name', this.editProductForm.value.name);
      editedProduct.append('categoryId', this.editProductForm.value.category);
      editedProduct.append(
        'shortDescription',
        this.editProductForm.value.shortDescription
      );
      editedProduct.append(
        'description',
        this.editProductForm.value.description
      );

      this.editProductForm.value.images.map((image: string) => {
        editedProduct.append('images', image);
      });
      editedProduct.append('price', this.editProductForm.value.price);
      editedProduct.append(
        'discountedPrice',
        this.editProductForm.value.discountedPrice
      );
      editedProduct.append('stock', this.editProductForm.value.stock);

      this.productService
        .updateProduct$(editedProduct, this.data.id)
        .pipe(
          tap((product) => {
            this.toastr.success(`${product.name} termék módosítva`);
            this.dialogRef.close();
          })
        )
        .subscribe();
    }
  }

  initEditProductForm(product: Product): void {
    this.editProductForm = new FormGroup({
      category: new FormControl(product.categoryId, Validators.required),
      name: new FormControl(product.name, Validators.required),
      shortDescription: new FormControl(
        product.shortDescription,
        Validators.required
      ),
      description: new FormControl(product.description, Validators.required),
      images: new FormControl(product.images, Validators.required),
      price: new FormControl(product.price, Validators.required),
      discountedPrice: new FormControl(
        product.discountedPrice,
        Validators.required
      ),
      stock: new FormControl(product.stock, Validators.required)
    });
  }
}
