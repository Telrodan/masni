import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { Observable, tap, filter, switchMap, map } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { Category } from '@core/models/category.model';
import { Material, RawMaterial } from '@core/models/material.model';
import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { selectMaterialCategories } from '@core/store';
import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '@core/services/category.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';

@UntilDestroy()
@Component({
  selector: 'nyk-edit-material',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    DropdownModule,
    RadioButtonModule,
    DividerModule,
    ButtonModule,
    SpinnerComponent,
    InputTextModule,
    InputSwitchModule
  ],
  templateUrl: './edit-material.component.html',
  styleUrls: ['./edit-material.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EditMaterialComponent implements OnInit {
  @HostBinding('class') class = 'nyk-edit-material';

  material$: Observable<Material>;
  materialId: string;

  isLoading = false;

  categories$: Observable<Category[]>;
  editMaterialForm: FormGroup;

  imagePreview: string;

  constructor(
    private materialService: MaterialService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.material$ = this.route.params.pipe(
      switchMap((params) =>
        this.materialService.getMaterialById$(params['id'])
      ),
      tap((material) => {
        this.materialId = material.id;
        this.editMaterialForm = this.fb.group({
          name: [material.name, Validators.required],
          categoryId: [material.category.id, Validators.required],
          image: [material.image, Validators.required],
          extraPrice: [material.extraPrice, Validators.required],
          isAvailable: [material.isAvailable, Validators.required]
        });

        this.imagePreview = material.image;
      })
    );
    this.categories$ = this.categoryService.getMaterialCategories$();
  }

  async onImagePicked(event: Event): Promise<void> {
    this.imagePreview = await addImageToFormAndSetPreview(
      event,
      this.editMaterialForm
    );
    this.changeDetectorRef.detectChanges();
  }

  onImageClear(imageInput: HTMLInputElement): void {
    this.imagePreview = removeImageFromFormAndInputAndClearPreview(
      this.editMaterialForm,
      imageInput
    );
  }

  onEditMaterial(): void {
    if (this.editMaterialForm.valid) {
      const material: RawMaterial = {
        name: this.editMaterialForm.value.name.trim(),
        categoryId: this.editMaterialForm.value.categoryId,
        image: this.editMaterialForm.value.image,
        extraPrice: this.editMaterialForm.value.extraPrice,
        isAvailable: this.editMaterialForm.value.isAvailable
      };

      if (material.name) {
        this.isLoading = true;
        this.materialService
          .updateMaterial$(material, this.materialId)
          .pipe(
            tap((material) => {
              this.isLoading = false;
              this.toastr.success(`${material.name} minta módosítva`);
              this.router.navigate(['/admin/materials']);
            })
          )
          .subscribe();
      } else {
        this.toastr.info('Kérlek adj meg egy minta nevet');
      }
    } else {
      this.toastr.info('Kérlek töltsd ki az összes mezőt');
    }
  }
}
