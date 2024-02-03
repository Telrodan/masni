import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Observable, combineLatest, filter, map, switchMap, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { Category } from '@core/models/category.model';
import { CategoryType } from '@core/enums/category-type.enum';
import { CategoryService } from '@core/services/category.service';
import { ToastrService } from '@core/services/toastr.service';
import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { Log } from '@core/models/log.model';
import { LogService } from '@core/services/log.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

interface CategoryData extends Category {
  logs: Log[];
}

@Component({
  selector: 'nyk-edit-category',
  standalone: true,
  imports: [
    CommonModule,
    DividerModule,
    ReactiveFormsModule,
    BadgeModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    SpinnerComponent,
    TableModule
  ],
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCategoryComponent implements OnInit {
  @HostBinding('class') class = 'nyk-edit-category';

  editCategoryForm: FormGroup;
  categoryId: string;
  category$: Observable<CategoryData>;
  categoryLogs$: Observable<Log[]>;
  imagePreview: string;
  isLoading = false;

  readonly CategoryType = CategoryType;

  constructor(
    private categoryService: CategoryService,
    private logService: LogService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.category$ = this.route.params.pipe(
      switchMap((params) =>
        combineLatest([
          this.categoryService.getCategoryById$(params['id']),
          this.logService
            .getItemLogsByItemId$(params['id'])
            .pipe(
              map((logs) =>
                logs.sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                )
              )
            )
        ])
      ),
      filter((category) => !!category),
      map(([category, logs]) => ({
        ...category,
        logs
      })),
      tap((category) => {
        this.categoryId = category.id;
        this.editCategoryForm = this.fb.group({
          type: [category.type, Validators.required],
          name: [category.name, Validators.required],
          image: [category.image, Validators.required],
          description: [category.description]
        });

        this.imagePreview = category.image;
      })
    );
  }

  async onImagePicked(event: Event): Promise<void> {
    this.imagePreview = await addImageToFormAndSetPreview(
      event,
      this.editCategoryForm
    );
    this.changeDetectorRef.detectChanges();
  }

  onImageClear(imageInput: HTMLInputElement): void {
    this.imagePreview = removeImageFromFormAndInputAndClearPreview(
      this.editCategoryForm,
      imageInput
    );
  }

  onEditCategory(): void {
    if (this.editCategoryForm.valid) {
      const category: Category = {
        type: this.editCategoryForm.value.type,
        name: this.editCategoryForm.value.name,
        image: this.editCategoryForm.value.image,
        description: this.editCategoryForm.value.description
      };

      if (category.name) {
        this.isLoading = true;
        this.categoryService
          .updateCategory$(category, this.categoryId)
          .pipe(
            tap(() => {
              this.isLoading = false;
              this.toastr.success(`${category.name} módosítva`);
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
