import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, filter, tap } from 'rxjs';

import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import { Category } from '@core/models/category.model';
import { selectAllCategories } from '@core/store';
import { capitalize } from 'src/app/shared/util/first-letter-capital';

@UntilDestroy()
@Component({
  selector: 'mhd-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  categories$: Observable<Category[]>;

  addProductForm: FormGroup;
  imagesPreview: string[] = [];

  constructor(
    private store$: Store,
    private dialogRef: MatDialogRef<AddProductComponent>,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initAddProductForm();

    this.categories$ = this.store$.select(selectAllCategories).pipe(
      filter((categories) => !!categories),
      untilDestroyed(this)
    );
  }

  async onImagePicked(event: Event): Promise<void> {
    this.imagesPreview = [];
    const files = Array.from((event.target as HTMLInputElement).files);
    this.addProductForm.patchValue({ images: files });
    this.addProductForm.get('images').updateValueAndValidity();

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
    this.addProductForm.value.images = null;
    this.addProductForm.patchValue({ images: null });
    this.addProductForm.get('images').updateValueAndValidity();
  }

  initAddProductForm(): void {
    this.addProductForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      shortDescription: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      images: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      stock: new FormControl(null, Validators.required)
    });
  }

  onAddProduct(): void {
    if (this.addProductForm.valid) {
      const product = new FormData();
      product.append('name', this.addProductForm.value.name);
      product.append('categoryId', this.addProductForm.value.category);
      product.append(
        'shortDescription',
        this.addProductForm.value.shortDescription
      );
      product.append('description', this.addProductForm.value.description);

      this.addProductForm.value.images.map((image: string) => {
        product.append('images', image);
      });
      product.append('price', this.addProductForm.value.price);
      product.append('stock', this.addProductForm.value.stock);

      this.productService
        .addProduct$(product)
        .pipe(
          tap(() => {
            this.toastr.success(
              `${capitalize(this.addProductForm.value.name)} hozzáadva`
            );
            this.dialogRef.close();
          })
        )
        .subscribe();
    }
  }
}
