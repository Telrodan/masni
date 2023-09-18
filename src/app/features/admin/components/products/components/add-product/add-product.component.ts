import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, filter, tap } from 'rxjs';

import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import { Category } from '@core/models/category.model';
import { selectProductCategories } from '@core/store';
import { capitalize } from 'src/app/shared/util/first-letter-capital';
import { Product } from '@core/models/product.model';
import { addImagesToFormAndSetPreview } from '@shared/util/image-upload-helpers';

@UntilDestroy()
@Component({
  selector: 'mhd-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  categories$: Observable<Category[]>;

  // name: new FormControl(null, Validators.required),
  // category: new FormControl(null, Validators.required),
  // shortDescription: new FormControl(null, Validators.required),
  // description: new FormControl(null, Validators.required),
  // images: new FormControl(null, Validators.required),
  // price: new FormControl(null, Validators.required),
  // discountedPrice: new FormControl(0, Validators.required),
  // stock: new FormControl(null, Validators.required)

  addProductForm = this.fb.group({
    name: ['', Validators.required],
    categoryId: ['', Validators.required],
    shortDescription: ['', Validators.required],
    description: ['', Validators.required],
    images: [[], Validators.required],
    price: [0, Validators.required],
    discountedPrice: [0, Validators.required],
    stock: [0, Validators.required]
  });

  imagesPreview: string[] = [];

  constructor(
    private store$: Store,
    private dialogRef: MatDialogRef<AddProductComponent>,
    private productService: ProductService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.categories$ = this.store$.select(selectProductCategories).pipe(
      filter((categories) => !!categories),
      untilDestroyed(this)
    );
  }

  onImagePicked(event: Event): void {
    this.imagesPreview = addImagesToFormAndSetPreview(
      event,
      this.addProductForm
    );
  }

  onImageClear(): void {
    this.imagesPreview = [];
    this.addProductForm.value.images = null;
    this.addProductForm.patchValue({ images: null });
    this.addProductForm.get('images').updateValueAndValidity();
  }

  onAddProduct(): void {
    //   if (this.addProductForm.valid) {
    //     const product: Product = {
    //       name: this.addProductForm.value.name,
    //       categoryId: this.addProductForm.value.categoryId,
    //       shortDescription: this.addProductForm.value.shortDescription,
    //       description: this.addProductForm.value.description,
    //       images: this.addProductForm.value.images,
    //       price: this.addProductForm.value.price,
    //       discountedPrice: this.addProductForm.value.discountedPrice,
    //       stock: this.addProductForm.value.stock
    //     };
    //     }
    //     const product = new FormData();
    //     product.append('name', this.addProductForm.value.name);
    //     product.append('categoryId', this.addProductForm.value.category);
    //     product.append(
    //       'shortDescription',
    //       this.addProductForm.value.shortDescription
    //     );
    //     product.append('description', this.addProductForm.value.description);
    //     this.addProductForm.value.images.map((image: string) => {
    //       product.append('images', image);
    //     });
    //     product.append('price', this.addProductForm.value.price);
    //     product.append(
    //       'discountedPrice',
    //       this.addProductForm.value.discountedPrice
    //     );
    //     product.append('stock', this.addProductForm.value.stock);
    //     this.productService
    //       .addProduct$(product)
    //       .pipe(
    //         tap(() => {
    //           this.toastr.success(
    //             `${capitalize(this.addProductForm.value.name)} hozzáadva`
    //           );
    //           this.dialogRef.close();
    //         })
    //       )
    //       .subscribe();
    // }
  }
}
