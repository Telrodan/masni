import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Observable, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';

import { InspirationService } from '@core/services/inspiration.service';
import { ToastrService } from '@core/services/toastr.service';
import { Category } from '@core/models/category.model';
import { BackendInspiration } from '@core/models/inspiration.model';
import { CategoryService } from '@core/services/category.service';
import {
    addImageToFormAndSetPreview,
    removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
    selector: 'nyk-add-inspiration',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        SpinnerComponent,
        DividerModule
    ],
    templateUrl: './add-inspiration.component.html',
    styleUrls: ['./add-inspiration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddInspirationComponent implements OnInit {
    @HostBinding('class') hostClass = 'nyk-add-inspiration';

    categories$: Observable<Category[]>;
    isLoading = false;

    addInspirationForm = this.fb.group({
        name: ['', Validators.required],
        categoryId: ['', Validators.required],
        image: ['', Validators.required]
    });

    imagePreview: string;

    constructor(
        private inspirationService: InspirationService,
        private categoryService: CategoryService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private toastr: ToastrService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.categories$ = this.categoryService.getInspirationCategories$();
    }

    async onImagePicked(event: Event): Promise<void> {
        this.imagePreview = await addImageToFormAndSetPreview(
            event,
            this.addInspirationForm
        );
        this.changeDetectorRef.detectChanges();
    }

    onImageClear(imageInput: HTMLInputElement): void {
        this.imagePreview = removeImageFromFormAndInputAndClearPreview(
            this.addInspirationForm,
            imageInput
        );
    }

    onAddInspiration(): void {
        if (this.addInspirationForm.valid) {
            const inspiration: BackendInspiration = {
                name: this.addInspirationForm.value.name.trim(),
                categoryId: this.addInspirationForm.value.categoryId,
                image: this.addInspirationForm.value.image
            };

            if (inspiration.name) {
                this.isLoading = true;
                this.inspirationService
                    .addInspiration$(inspiration)
                    .pipe(
                        tap(() => {
                            this.isLoading = false;
                            this.toastr.success('Inspiráció hozzáadva');
                            this.router.navigate(['/admin/inspirations']);
                        })
                    )
                    .subscribe();
            } else {
                this.toastr.error('Kérlek adj meg egy inspiráció nevet');
            }
        } else {
            this.toastr.error('Kérlek töltsd ki az összes mezőt');
        }
    }
}
