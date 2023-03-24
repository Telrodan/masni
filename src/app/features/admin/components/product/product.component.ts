import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '@core/models/category.model';
import { CategoryService } from '@core/services/category.service';
import { ProductService } from '@core/services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  categories$: Observable<Category[]>;
  uploadedFiles = [];
  productForm: FormGroup;
  images;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
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

  onAdd() {
    const product = new FormData();
    product.append('categoryId', this.productForm.get('categoryId').value);
    product.append('name', this.productForm.get('name').value);
    product.append('description', this.productForm.get('description').value);
    for (const img of this.images) {
      product.append('images', img);
    }
    product.append('price', this.productForm.get('price').value);
    product.append('stock', this.productForm.get('stock').value);

    this.productService.addProduct(product);
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const files = event.target.files;
      this.images = files;
    }
  }
}
