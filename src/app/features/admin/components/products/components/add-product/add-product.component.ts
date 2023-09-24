import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, tap } from 'rxjs';

import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import { Category } from '@core/models/category.model';
import { selectAllQuestion, selectProductCategories } from '@core/store';
import { addImagesToFormAndSetPreview } from '@shared/util/image-upload-helpers';
import { Question } from '@core/models/question.model';
import { Product } from '@core/models/product.model';

@UntilDestroy()
@Component({
  selector: 'mhd-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  categories$: Observable<Category[]>;

  questions: Question[];
  selectedQuestions: Question[] = [];

  addProductForm = this.fb.group({
    name: ['', Validators.required],
    categoryId: ['', Validators.required],
    shortDescription: ['', Validators.required],
    description: ['', Validators.required],
    isCustom: [false, Validators.required],
    isNameEmbroideryAvailable: [false, Validators.required],
    selectedQuestion: [null],
    questionIds: this.fb.array<string[]>([]),
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
    this.categories$ = this.store$
      .select(selectProductCategories)
      .pipe(untilDestroyed(this));

    this.store$
      .select(selectAllQuestion)
      .pipe(
        tap((questions) => {
          this.questions = questions;
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  addQuestion(): void {
    const id = this.addProductForm.value.selectedQuestion;
    if (id) {
      this.addProductForm.value.questionIds.push(id);
      const selectedQuestion = this.questions.find(
        (question) => question.id === id
      );
      this.selectedQuestions.push(selectedQuestion);
      this.toastr.success('Kérdés hozzáadva');
      this.addProductForm.get('selectedQuestion').patchValue('');
    } else {
      this.toastr.info('Válassz egy kérdést');
    }
  }

  deleteQuestion(id: string, index: number): void {
    this.selectedQuestions.splice(index, 1);
    this.addProductForm.value.questionIds =
      this.addProductForm.value.questionIds.filter(
        (questionId) => questionId !== id
      );

    this.toastr.success('Kérdés törölve');
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
    if (this.addProductForm.valid) {
      const product: Product = {
        categoryId: this.addProductForm.value.categoryId,
        name: this.addProductForm.value.name,
        shortDescription: this.addProductForm.value.shortDescription,
        description: this.addProductForm.value.description,
        questionIds: this.addProductForm.value.questionIds,
        isCustom: this.addProductForm.value.isCustom,
        isNameEmbroideryAvailable:
          this.addProductForm.value.isNameEmbroideryAvailable,
        images: this.addProductForm.value.images,
        price: this.addProductForm.value.price,
        discountedPrice: this.addProductForm.value.discountedPrice,
        stock: this.addProductForm.value.stock
      };

      const productFormData = new FormData();
      productFormData.append('product', JSON.stringify(product));
      product.images.forEach((image: string) => {
        productFormData.append('images', image);
      });

      this.productService
        .addProduct$(productFormData)
        .pipe(
          tap(() => {
            this.toastr.success(`${product.name} hozzáadva`);
            this.dialogRef.close();
          })
        )
        .subscribe();
    }
  }
}
