import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { Observable, tap } from 'rxjs';

import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { Category } from '@core/models/category.model';
import { BackendMaterial } from '@core/models/material.model';
import {
    addImageToFormAndSetPreview,
    removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryService } from '@core/services/category.service';
import { Router } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
    selector: 'nyk-add-material',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        DropdownModule,
        RadioButtonModule,
        ButtonModule,
        SpinnerComponent,
        DividerModule,
        InputTextModule,
        InputSwitchModule
    ],
    templateUrl: './add-material.component.html',
    styleUrls: ['./add-material.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class AddMaterialComponent implements OnInit {
    @HostBinding('class') class = 'nyk-add-material';

    categories$: Observable<Category[]>;
    isLoading = false;

    addMaterialForm = this.fb.group({
        name: ['', Validators.required],
        category: ['', Validators.required],
        image: ['', Validators.required],
        extraPrice: [0, Validators.required],
        isAvailable: [true, Validators.required]
    });

    imagePreview: string;

    constructor(
        private materialService: MaterialService,
        private categoryService: CategoryService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.categories$ = this.categoryService.getMaterialCategories$();
    }

    async onImagePicked(event: Event): Promise<void> {
        this.imagePreview = await addImageToFormAndSetPreview(
            event,
            this.addMaterialForm
        );
        this.changeDetectorRef.detectChanges();
    }

    onImageClear(imageInput: HTMLInputElement): void {
        this.imagePreview = removeImageFromFormAndInputAndClearPreview(
            this.addMaterialForm,
            imageInput
        );
    }

    onAddMaterial(): void {
        if (this.addMaterialForm.valid) {
            const material: BackendMaterial = {
                name: this.addMaterialForm.value.name.trim(),
                categoryId: this.addMaterialForm.value.category,
                image: this.addMaterialForm.value.image,
                extraPrice: this.addMaterialForm.value.extraPrice,
                isAvailable: this.addMaterialForm.value.isAvailable
            };

            if (material.name) {
                this.isLoading = true;
                this.materialService
                    .addMaterial$(material)
                    .pipe(
                        tap(() => {
                            this.isLoading = false;
                            this.toastr.success(`${material.name} hozzáadva`);
                            this.router.navigate(['/admin/materials']);
                        })
                    )
                    .subscribe();
            } else {
                this.toastr.error('Kérlek adj meg egy minta nevet');
            }
        } else {
            this.toastr.error('Kérlek töltsd ki az összes mezőt');
        }
    }
}
