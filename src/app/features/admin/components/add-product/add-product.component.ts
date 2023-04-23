import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

import { CategoryService } from '@core/services/category.service';
import { ProductService } from '@core/services/product.service';
import { Category } from '@core/models/category.model';
import { ToastrService } from '@core/services/toastr.service';

@Component({
  selector: 'masni-handmade-dolls-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  categories$: Observable<Category[]>;
  productForm: FormGroup;
  imagesPreview: string[] = [];

  constructor(
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
    this.productForm.patchValue({ images: files });
    this.productForm.get('images').updateValueAndValidity();

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
    this.productForm = new FormGroup({
      categoryId: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      shortDescription: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      images: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      stock: new FormControl(null, Validators.required)
    });
  }

  onAddProduct(): void {
    if (this.productForm.valid) {
      const productData = new FormData();
      productData.append(
        'categoryId',
        this.productForm.get('categoryId').value
      );
      productData.append('name', this.productForm.get('name').value);
      productData.append(
        'shortDescription',
        this.productForm.get('shortDescription').value
      );
      productData.append(
        'description',
        this.productForm.get('description').value
      );
      this.productForm.get('images').value.map((image) => {
        productData.append('images', image);
      });
      productData.append('price', this.productForm.get('price').value);
      productData.append('stock', this.productForm.get('stock').value);

      this.productService
        .addProduct$(productData)
        .pipe(
          tap(() => {
            this.toastr.success(
              'Siker',
              `${this.productForm.get('name').value} hozzáadva`
            );
            this.productForm.reset();
          })
        )
        .subscribe();
    }
  }
}
