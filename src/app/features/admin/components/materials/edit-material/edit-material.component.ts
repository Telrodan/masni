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
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable, tap, switchMap, map } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';

import { ToastrService } from '@core/services/toastr.service';
import {
    addImageToFormAndSetPreview,
    removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Category } from '@core/store/category/category.model';
import { Material } from '@core/store/material/material.model';
import { MaterialSelector } from '@core/store/material/material.selectors';
import { CategorySelector } from '@core/store/category';
import { Log, LogSelector } from '@core/store/log';
import { ItemHistoryComponent } from '@shared/item-history/item-history.component';
import { MaterialAction } from '@core/store/material';

@Component({
    selector: 'nyk-edit-material',
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
        TableModule,
        InputNumberModule,
        ItemHistoryComponent
    ],
    templateUrl: './edit-material.component.html',
    styleUrls: ['./edit-material.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class EditMaterialComponent implements OnInit {
    @HostBinding('class') class = 'nyk-edit-material';

    material$: Observable<Material>;
    materialCategories$: Observable<Category[]>;
    logs$: Observable<Log[]>;

    editMaterialForm: FormGroup;
    imagePreview: string;

    private readonly store = inject(Store);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly toastr = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    ngOnInit(): void {
        const materialId$ = this.route.params.pipe(map((params: { id: string }) => params.id));

        this.material$ = materialId$.pipe(
            switchMap((id) => this.store.select(MaterialSelector.selectMaterialById(id))),
            tap((material) => {
                this.editMaterialForm = this.fb.group({
                    id: [material.id, Validators.required],
                    name: [material.name, Validators.required],
                    category: [material.category.id, Validators.required],
                    image: [material.image, Validators.required],
                    extraPrice: [material.extraPrice, Validators.required],
                    isAvailable: [material.isAvailable, Validators.required]
                });

                this.imagePreview = material.image;
            })
        );

        this.materialCategories$ = this.store.select(CategorySelector.selectMaterialCategories());

        this.logs$ = materialId$.pipe(
            switchMap((id) => this.store.select(LogSelector.selectLogsByItemId(id)))
        );
    }

    async onImagePicked(event: Event): Promise<void> {
        this.imagePreview = await addImageToFormAndSetPreview(event, this.editMaterialForm);
        this.changeDetectorRef.detectChanges();
    }

    onImageClear(imageInput: HTMLInputElement): void {
        this.imagePreview = removeImageFromFormAndInputAndClearPreview(
            this.editMaterialForm,
            imageInput
        );
    }

    onEditMaterial(): void {
        if (!this.editMaterialForm.valid) {
            this.toastr.info('Kérlek töltsd ki az összes mezőt!');
            return;
        }

        const material = this.editMaterialForm.value as Material;

        this.store.dispatch(MaterialAction.updateMaterial({ material }));
        this.router.navigate(['/admin/materials']);
    }
}
