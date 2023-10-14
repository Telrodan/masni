import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, tap } from 'rxjs';

import { RawProduct } from '@core/models/product.model';
import { Category } from '@core/models/category.model';
import { Question } from '@core/models/question.model';
import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import {
  selectAllQuestion,
  selectInspirationCategories,
  selectProductCategories
} from '@core/store';
import {
  addImagesToFormAndSetPreview,
  removeImagesFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';

@UntilDestroy()
@Component({
  selector: 'mhd-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  categories$: Observable<Category[]>;
  questions$: Observable<Question[]>;
  inspirationCategories$: Observable<Category[]>;

  questions: Question[];
  selectedQuestions: Question[] = [];

  addProductForm = this.fb.group({
    name: ['', Validators.required],
    categoryId: ['', Validators.required],
    inspirationCategoryId: ['', Validators.required],
    shortDescription: ['', Validators.required],
    description: ['', Validators.required],
    isCustom: [false, Validators.required],
    isDollDress: [false, Validators.required],
    isDressable: [false, Validators.required],
    isFeatured: [false, Validators.required],
    isNameEmbroideryAvailable: [false, Validators.required],
    selectedQuestion: [null],
    questions: this.fb.array<string>([]),
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

    this.questions$ = this.store$.select(selectAllQuestion).pipe(
      tap((questions) => {
        this.questions = questions;
      }),
      untilDestroyed(this)
    );

    this.inspirationCategories$ = this.store$
      .select(selectInspirationCategories)
      .pipe(untilDestroyed(this));
  }

  addQuestion(): void {
    const id = this.addProductForm.value.selectedQuestion;
    if (id) {
      this.addProductForm.value.questions.push(id);
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
    this.addProductForm.value.questions =
      this.addProductForm.value.questions.filter(
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

  onImageClear(imageInput: HTMLInputElement): void {
    this.imagesPreview = removeImagesFromFormAndInputAndClearPreview(
      this.addProductForm,
      imageInput
    );
  }

  onAddProduct(): void {
    if (this.addProductForm.valid) {
      const product: RawProduct = {
        name: this.addProductForm.value.name,
        categoryId: this.addProductForm.value.categoryId,
        inspirationCategoryId: this.addProductForm.value.inspirationCategoryId,
        shortDescription: this.addProductForm.value.shortDescription,
        isCustom: this.addProductForm.value.isCustom,
        isDollDress: this.addProductForm.value.isDollDress,
        isDressable: this.addProductForm.value.isDressable,
        isFeatured: this.addProductForm.value.isFeatured,
        isNameEmbroideryAvailable:
          this.addProductForm.value.isNameEmbroideryAvailable,
        description: this.addProductForm.value.description,
        questions: this.addProductForm.value.questions,
        images: this.addProductForm.value.images,
        price: this.addProductForm.value.price,
        discountedPrice: this.addProductForm.value.discountedPrice,
        stock: this.addProductForm.value.stock
      };

      if (product.name) {
        this.productService
          .addProduct$(product)
          .pipe(
            tap(() => {
              this.toastr.success(`${product.name} hozzáadva`);
              this.dialogRef.close();
            })
          )
          .subscribe();
      } else {
        this.toastr.info('Kérlek adj meg egy termék nevet');
      }
    } else {
      this.toastr.error('Kérlek töltsd ki az összes mezőt');
    }
  }
}
