import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    inject
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';

import { ToastrService } from '@core/services/toastr.service';
import {
    addImageToFormAndSetPreview,
    removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Category } from '@core/store/category/category.model';
import { Inspiration } from '@core/store/inspiration/inspiration.model';
import { CategorySelector } from '@core/store/category';
import { InspirationAction } from '@core/store/inspiration';

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

    inspirationCategories$: Observable<Category[]>;
    addInspirationForm: FormGroup;
    imagePreview: string;

    private readonly store = inject(Store);
    private readonly fb = inject(FormBuilder);
    private readonly toastr = inject(ToastrService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly router = inject(Router);

    ngOnInit(): void {
        this.inspirationCategories$ = this.store.select(
            CategorySelector.selectInspirationCategories()
        );
        this.addInspirationForm = this.fb.group({
            name: [undefined, Validators.required],
            category: [undefined, Validators.required],
            image: [undefined, Validators.required]
        });
    }

    async onImagePicked(event: Event): Promise<void> {
        this.imagePreview = await addImageToFormAndSetPreview(event, this.addInspirationForm);
        this.changeDetectorRef.detectChanges();
    }

    onImageClear(imageInput: HTMLInputElement): void {
        this.imagePreview = removeImageFromFormAndInputAndClearPreview(
            this.addInspirationForm,
            imageInput
        );
    }

    onAddInspiration(): void {
        if (!this.addInspirationForm.valid) {
            this.toastr.info('Kérlek töltsd ki az összes mezőt.');

            return;
        }

        const inspiration = this.addInspirationForm.value as Inspiration;

        this.store.dispatch(InspirationAction.addInspiration({ inspiration }));
        this.router.navigate(['/admin/inspirations']);
    }
}
