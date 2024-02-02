import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { Observable, map, tap } from 'rxjs';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';

import { Category } from '@core/models/category.model';
import { CategoryType } from '@core/enums/category-type.enum';
import { CategoryService } from '@core/services/category.service';
import { ToastrService } from '@core/services/toastr.service';
import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'nyk-add-category',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SpinnerComponent,
    DividerModule,
    InputSwitchModule,
    DropdownModule
  ],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCategoryComponent implements OnInit {
  @HostBinding('class') class = 'nyk-add-category';

  @ViewChild('imagePicker', { static: false })
  imagePicker: ElementRef<HTMLInputElement>;

  mainCategories$: Observable<Category[]>;
  imagePreview: string;
  isLoading = false;

  addCategoryForm = this.fb.group({
    type: [CategoryType.PRODUCT_CATEGORY, Validators.required],
    isSubCategory: [false],
    mainCategory: [''],
    name: ['', Validators.required],
    image: ['', Validators.required],
    description: ['']
  });

  readonly CategoryType = CategoryType;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mainCategories$ = this.categoryService
      .getCategories$()
      .pipe(
        map((categories) =>
          categories
            .filter(
              (category) => category.type === this.addCategoryForm.value.type
            )
            .filter((category) => category.isSubCategory === false)
        )
      );
  }

  async onImagePicked(event: Event): Promise<void> {
    this.imagePreview = await addImageToFormAndSetPreview(
      event,
      this.addCategoryForm
    );
    this.changeDetectorRef.markForCheck();
  }

  onImageClear(imageInput: HTMLInputElement): void {
    this.imagePreview = removeImageFromFormAndInputAndClearPreview(
      this.addCategoryForm,
      imageInput
    );
  }

  onAddCategory(): void {
    if (this.addCategoryForm.valid) {
      const category: Category = {
        type: this.addCategoryForm.value.type,
        isSubCategory: this.addCategoryForm.value.isSubCategory,
        mainCategory: this.addCategoryForm.value.isSubCategory
          ? this.addCategoryForm.value.mainCategory
          : '',
        name: this.addCategoryForm.value.name.trim(),
        image: this.addCategoryForm.value.image,
        description: this.addCategoryForm.value.description.trim()
      };

      if (category.isSubCategory && !category.mainCategory) {
        this.toastr.info('Kérlek válassz egy főkategóriát');
        return;
      }

      if (category.name) {
        this.isLoading = true;
        this.categoryService
          .addCategory$(category)
          .pipe(
            tap(() => {
              this.isLoading = false;
              this.changeDetectorRef.markForCheck();
              this.toastr.success(`${category.name} hozzáadva`);
              this.router.navigate(['/admin/categories']);
            })
          )
          .subscribe();
      } else {
        this.toastr.info('Kérlek adj meg egy kategória nevet');
      }
    } else {
      this.toastr.info('Kérlek töltsd ki az összes mezőt');
    }
  }
}
