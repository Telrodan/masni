import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '@core/models/category.model';
import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import { selectAllCategories } from '@core/store';
import { Store } from '@ngrx/store';
import { Observable, filter, tap } from 'rxjs';

@Component({
  selector: 'mhd-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  editProductForm: FormGroup;
  categories$: Observable<Category[]>;
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

    this.categories$ = this.store$
      .select(selectAllCategories)
      .pipe(filter((categories) => !!categories));
  }

  onClose(): void {
    this.dialogRef.close();
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

  onUpdateProduct(): void {}

  initEditProductForm(product: Product): void {
    this.editProductForm = new FormGroup({
      categoryId: new FormControl(product.categoryId, Validators.required),
      name: new FormControl(product.name, Validators.required),
      shortDescription: new FormControl(
        product.shortDescription,
        Validators.required
      ),
      description: new FormControl(product.description, Validators.required),
      price: new FormControl(product.price, Validators.required),
      stock: new FormControl(product.stock, Validators.required)
    });
  }
}
