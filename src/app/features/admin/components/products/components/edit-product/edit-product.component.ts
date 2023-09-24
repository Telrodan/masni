import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable, filter, tap } from 'rxjs';

import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import { Category } from '@core/models/category.model';
import { Product } from '@core/models/product.model';
import { selectAllCategories, selectAllQuestion } from '@core/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Question } from '@core/models/question.model';
import { addImagesToFormAndSetPreview } from '@shared/util/image-upload-helpers';

@UntilDestroy()
@Component({
  selector: 'mhd-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  categories$: Observable<Category[]>;

  questions: Question[];
  selectedQuestions: Question[] = [];

  editProductForm: FormGroup;
  imagesPreview: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private store$: Store,
    private dialogRef: MatDialogRef<EditProductComponent>,
    private productService: ProductService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.editProductForm = this.fb.group({
      name: [this.data.name, Validators.required],
      categoryId: [this.data.categoryId, Validators.required],
      shortDescription: [this.data.shortDescription, Validators.required],
      description: [this.data.description, Validators.required],
      isCustom: [this.data.isCustom, Validators.required],
      isNameEmbroideryAvailable: [
        this.data.isNameEmbroideryAvailable,
        Validators.required
      ],
      selectedQuestion: [null],
      questionIds: this.fb.array<string>(this.data.questionIds),
      images: [this.data.images, Validators.required],
      price: [this.data.price, Validators.required],
      discountedPrice: [this.data.discountedPrice, Validators.required],
      stock: [this.data.stock, Validators.required]
    });

    this.imagesPreview = this.data.images;
  }

  ngOnInit(): void {
    this.categories$ = this.store$.select(selectAllCategories).pipe(
      filter((categories) => !!categories),
      untilDestroyed(this)
    );

    this.store$
      .select(selectAllQuestion)
      .pipe(
        tap((questions) => {
          this.questions = questions;
          this.data.questionIds.forEach((id) => {
            const selectedQuestion = this.questions.find(
              (question) => question.id === id
            );
            this.selectedQuestions.push(selectedQuestion);
          });
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  addQuestion(): void {
    const id = this.editProductForm.value.selectedQuestion;
    if (id) {
      this.editProductForm.value.questionIds.push(id);
      const selectedQuestion = this.questions.find(
        (question) => question.id === id
      );
      this.selectedQuestions.push(selectedQuestion);
      this.toastr.success('Kérdés hozzáadva');
      this.editProductForm.get('selectedQuestion').patchValue('');
    } else {
      this.toastr.info('Válassz egy kérdést');
    }
  }

  deleteQuestion(id: string, index: number): void {
    const filteredQuestions = this.editProductForm.value.questionIds.filter(
      (questionId: string) => questionId !== id
    );
    this.selectedQuestions.splice(index, 1);
    this.editProductForm.value.questionIds = filteredQuestions;
    this.editProductForm.markAsDirty();
    this.toastr.success('Kérdés törölve');
  }

  onImagePicked(event: Event): void {
    this.imagesPreview = addImagesToFormAndSetPreview(
      event,
      this.editProductForm
    );
  }

  onImageClear(): void {
    this.imagesPreview = [];
    this.editProductForm.value.images = null;
    this.editProductForm.patchValue({ images: null });
    this.editProductForm.get('images').updateValueAndValidity();
  }

  onEditProduct(): void {
    if (this.editProductForm.valid) {
      const product: Product = {
        id: this.data.id,
        categoryId: this.editProductForm.value.categoryId,
        name: this.editProductForm.value.name,
        shortDescription: this.editProductForm.value.shortDescription,
        description: this.editProductForm.value.description,
        questionIds: this.editProductForm.value.questionIds,
        isCustom: this.editProductForm.value.isCustom,
        isNameEmbroideryAvailable:
          this.editProductForm.value.isNameEmbroideryAvailable,
        images: this.editProductForm.value.images,
        price: this.editProductForm.value.price,
        discountedPrice: this.editProductForm.value.discountedPrice,
        stock: this.editProductForm.value.stock
      };
      const productFormData = new FormData();
      productFormData.append('product', JSON.stringify(product));
      product.images.forEach((image: string) => {
        productFormData.append('images', image);
      });

      this.productService
        .updateProduct$(productFormData, product.id)
        .pipe(
          tap((product) => {
            this.toastr.success(`${product.name} termék módosítva`);
            this.dialogRef.close();
          })
        )
        .subscribe();
    }
  }
}
