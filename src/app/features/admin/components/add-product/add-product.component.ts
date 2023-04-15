import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '@core/models/category.model';
import { CategoryService } from '@core/services/category.service';
import { ProductService } from '@core/services/product.service';
import { MessageService } from 'primeng/api';
import { filter, Observable, tap } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  categories$: Observable<Category[]>;
  uploadedFiles = [];
  productForm: FormGroup;
  imagesUrl: string[];

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  @ViewChild('images') images: ElementRef;

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategory$();
    this.initForm();

    // image upload
    const imageInput = document.getElementById('images');
    imageInput.addEventListener('fileUploadSuccess', (e) => {
      this.imagesUrl = [...e['detail']['files'].map((file) => file.cdnUrl)];
      console.log(this.imagesUrl);
    });
  }

  initForm(): void {
    this.productForm = new FormGroup({
      categoryId: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      shortDescription: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      stock: new FormControl(null, Validators.required)
    });
  }

  onAddProduct(): void {
    if (this.productForm.valid) {
      const rawProduct = { ...this.productForm.value, images: this.imagesUrl };
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
}
