import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

import { CategoryService } from '@core/services/category.service';
import { ProductService } from '@core/services/product.service';
import { Category } from '@core/models/category.model';
import { ToastrService } from '@core/services/toastr.service';
import { MatDialogRef } from '@angular/material/dialog';

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
    private dialogRef: MatDialogRef<AddProductComponent>,
    private categoryService: CategoryService,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories$();
    this.initForm();
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

  initForm(): void {
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
    console.log(this.addProductForm.get('category').value);
    if (this.addProductForm.valid) {
      const product = new FormData();
      product.append('category', this.addProductForm.get('category').value);
      product.append('name', this.addProductForm.get('name').value);
      product.append(
        'shortDescription',
        this.addProductForm.get('shortDescription').value
      );
      product.append(
        'description',
        this.addProductForm.get('description').value
      );
      this.addProductForm.get('images').value.map((image) => {
        product.append('images', image);
      });
      product.append('price', this.addProductForm.get('price').value);
      product.append('stock', this.addProductForm.get('stock').value);
      product.append('categoryId', this.addProductForm.get('category').value);

      this.productService
        .addProduct$(product)
        .pipe(
          tap(() => {
            this.toastr.success(
              `${this.addProductForm.get('name').value} hozzáadva`
            );
            this.dialogRef.close();
          })
        )
        .subscribe();
    }
  }
}
