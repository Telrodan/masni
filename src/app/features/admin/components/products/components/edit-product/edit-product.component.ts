import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable, filter, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Product, RawProduct } from '@core/models/product.model';
import { Category } from '@core/models/category.model';
import { Question } from '@core/models/question.model';
import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import { selectAllQuestion, selectProductCategories } from '@core/store';
import {
  addImagesToFormAndSetPreview,
  removeImagesFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';

@UntilDestroy()
@Component({
  selector: 'mhd-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
      categoryId: [this.data.category.id, Validators.required],
      shortDescription: [this.data.shortDescription, Validators.required],
      description: [this.data.description, Validators.required],
      isCustom: [this.data.isCustom, Validators.required],
      isDollDress: [this.data.isDollDress, Validators.required],
      isDressable: [this.data.isDressable, Validators.required],
      isFeatured: [this.data.isFeatured, Validators.required],
      isNameEmbroideryAvailable: [
        this.data.isNameEmbroideryAvailable,
        Validators.required
      ],
      selectedQuestion: [null],
      questions: this.fb.array<string>(this.data.questions.map((q) => q.id)),
      images: [this.data.images, Validators.required],
      price: [this.data.price, Validators.required],
      discountedPrice: [this.data.discountedPrice, Validators.required],
      stock: [this.data.stock, Validators.required]
    });

    this.imagesPreview = this.data.images;
  }

  ngOnInit(): void {
    this.categories$ = this.store$.select(selectProductCategories).pipe(
      filter((categories) => !!categories),
      untilDestroyed(this)
    );

    this.store$
      .select(selectAllQuestion)
      .pipe(
        tap((questions) => {
          this.questions = questions;
          this.data.questions.forEach((question) => {
            console.log(this.editProductForm.value.questions);
            if (
              this.editProductForm.value.questions.find(
                (id: string) => id === question.id
              )
            ) {
              this.selectedQuestions.push(question);
            }
          });
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  addQuestion(): void {
    const id = this.editProductForm.value.selectedQuestion;
    if (id) {
      this.editProductForm.value.questions.push(id);
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
    this.editProductForm.value.questions =
      this.editProductForm.value.questions.filter(
        (questionId: string) => questionId !== id
      );
    this.selectedQuestions.splice(index, 1);
    this.editProductForm.markAsDirty();
    this.toastr.success('Kérdés törölve');
  }

  onImagePicked(event: Event): void {
    this.imagesPreview = addImagesToFormAndSetPreview(
      event,
      this.editProductForm
    );
  }

  onImageClear(imageInput: HTMLInputElement): void {
    this.imagesPreview = removeImagesFromFormAndInputAndClearPreview(
      this.editProductForm,
      imageInput
    );
  }

  onEditProduct(): void {
    if (this.editProductForm.valid) {
      const product: RawProduct = {
        categoryId: this.editProductForm.value.categoryId,
        name: this.editProductForm.value.name,
        shortDescription: this.editProductForm.value.shortDescription,
        description: this.editProductForm.value.description,
        questions: this.editProductForm.value.questions,
        isCustom: this.editProductForm.value.isCustom,
        isDollDress: this.editProductForm.value.isDollDress,
        isDressable: this.editProductForm.value.isDressable,
        isFeatured: this.editProductForm.value.isFeatured,
        isNameEmbroideryAvailable:
          this.editProductForm.value.isNameEmbroideryAvailable,
        images: this.editProductForm.value.images,
        price: this.editProductForm.value.price,
        discountedPrice: this.editProductForm.value.discountedPrice,
        stock: this.editProductForm.value.stock
      };
      if (product.name) {
        this.productService
          .updateProduct$(product, this.data.id)
          .pipe(
            tap((product) => {
              this.toastr.success(`${product.name} termék módosítva`);
              this.dialogRef.close();
            })
          )
          .subscribe();
      } else {
        this.toastr.info('Kérlek adj meg egy termék nevet');
      }
    } else {
      this.toastr.info('Kérlek töltsd ki az összes mezőt');
    }
  }
}
