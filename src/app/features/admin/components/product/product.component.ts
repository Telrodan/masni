import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '@core/models/category.model';
import { CategoryService } from '@core/services/category.service';
import { ProductService } from '@core/services/product.service';
import { MessageService } from 'primeng/api';
import { filter, Observable, tap } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  categories$: Observable<Category[]>;
  uploadedFiles = [];
  productForm: FormGroup;
  images: FileList;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategory$();
    this.initForm();
  }

  initForm(): void {
    this.productForm = new FormGroup({
      categoryId: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      stock: new FormControl(null, Validators.required)
    });
  }

  onAddProduct(): void {
    console.log(this.productForm.valid);
    if (this.productForm.valid) {
      const rawProduct = new FormData();
      rawProduct.append('categoryId', this.productForm.get('categoryId').value);
      rawProduct.append('name', this.productForm.get('name').value);
      rawProduct.append(
        'description',
        this.productForm.get('description').value
      );
      for (let i = 0; i < this.images.length; i++) {
        const image = this.images[i];
        rawProduct.append('images', image);
      }
      rawProduct.append('price', this.productForm.get('price').value);
      rawProduct.append('stock', this.productForm.get('stock').value);

      this.productService
        .addProduct(rawProduct)
        .pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Siker!',
              detail: `${this.productForm.get('name').value} hozzáadva`
            });
            this.productForm.reset();
          })
        )
        .subscribe();
    }
  }

  selectImage(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files.length > 0) {
      this.images = files;
    }
  }
}
