import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';

import { ToastrService } from '@core/services/toastr.service';
import {
    addImageToFormAndSetPreview,
    removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Category } from '@core/store/category/category.model';
import { Material } from '@core/store/material/material.model';
import { CategorySelector } from '@core/store/category';
import { MaterialAction } from '@core/store/material';

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
        InputTextModule,
        InputSwitchModule,
        InputNumberModule
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

    addMaterialForm: FormGroup;
    imagePreview: string;

    private readonly store = inject(Store);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly toastr = inject(ToastrService);

    ngOnInit(): void {
        this.addMaterialForm = this.fb.group({
            name: ['', Validators.required],
            category: ['', Validators.required],
            image: ['', Validators.required],
            extraPrice: [0, Validators.required],
            isAvailable: [true, Validators.required]
        });

        this.categories$ = this.store.select(CategorySelector.selectMaterialCategories());
    }

    async onImagePicked(event: Event): Promise<void> {
        this.imagePreview = await addImageToFormAndSetPreview(event, this.addMaterialForm);
        this.changeDetectorRef.detectChanges();
    }

    onImageClear(imageInput: HTMLInputElement): void {
        this.imagePreview = removeImageFromFormAndInputAndClearPreview(
            this.addMaterialForm,
            imageInput
        );
    }

    onAddMaterial(): void {
        if (!this.addMaterialForm.valid) {
            this.toastr.error('Kérlek töltsd ki az összes mezőt.');

            return;
        }

        const material = this.addMaterialForm.value as Material;

        this.store.dispatch(MaterialAction.addMaterial({ material }));
        this.router.navigate(['/admin/materials']);
    }
}
