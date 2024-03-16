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

import { Observable, tap, filter, switchMap, map, combineLatest } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Category } from '@core/models/category.model';
import { Material, BackendMaterial } from '@core/models/material.model';
import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
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
import { TableModule } from 'primeng/table';
import { Log } from '@core/models/log.model';
import { LogService } from '@core/services/log.service';

interface MaterialData extends Material {
    logs: Log[];
}

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
        InputSwitchModule,
        TableModule
    ],
    templateUrl: './edit-material.component.html',
    styleUrls: ['./edit-material.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class EditMaterialComponent implements OnInit {
    @HostBinding('class') class = 'nyk-edit-material';

    material$: Observable<MaterialData>;
    categories$: Observable<Category[]>;
    materialId: string;
    isLoading = false;
    editMaterialForm: FormGroup;
    imagePreview: string;

    constructor(
        private materialService: MaterialService,
        private categoryService: CategoryService,
        private logService: LogService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.material$ = this.route.params.pipe(
            switchMap((params) =>
                combineLatest([
                    this.materialService.getMaterialById$(params['id']),
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
            filter((material) => !!material),
            map(([material, logs]) => ({ ...material, logs })),
            tap((material) => {
                console.log(material);
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
            const material: BackendMaterial = {
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
                            this.toastr.success(
                                `${material.name} minta módosítva`
                            );
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
