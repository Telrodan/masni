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
import { Observable, filter } from 'rxjs';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from 'primeng/badge';

import { CategoryAction, CategorySelector } from '@core/store/category';
import { ToastrService } from '@core/services/toastr.service';
import {
    addImageToFormAndSetPreview,
    removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { Category, CategoryType } from '@core/store/category/category.model';

@Component({
    selector: 'nyk-add-category',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RadioButtonModule,
        InputTextareaModule,
        ButtonModule,
        InputTextModule,
        InputSwitchModule,
        DropdownModule,
        BadgeModule
    ],
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCategoryComponent implements OnInit {
    @HostBinding('class') class = 'nyk-add-category';

    productMainCategories$: Observable<Category[]>;

    addCategoryForm: FormGroup;
    imagePreview: string;

    readonly CategoryType = CategoryType;

    private readonly store = inject(Store);
    private readonly fb = inject(FormBuilder);
    private readonly toastr = inject(ToastrService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly router = inject(Router);

    ngOnInit(): void {
        this.productMainCategories$ = this.store
            .select(CategorySelector.selectMainProductCategories())
            .pipe(filter((categories) => !!categories));

        this.addCategoryForm = this.fb.group({
            type: [CategoryType.Product, Validators.required],
            name: [undefined, Validators.required],
            image: [undefined],
            description: [undefined],
            isMainCategory: [true, Validators.required],
            parentCategory: [undefined]
        });
    }

    async onImagePicked(event: Event): Promise<void> {
        this.imagePreview = await addImageToFormAndSetPreview(event, this.addCategoryForm);
        this.changeDetectorRef.detectChanges();
    }

    onImageClear(imageInput: HTMLInputElement): void {
        this.imagePreview = removeImageFromFormAndInputAndClearPreview(
            this.addCategoryForm,
            imageInput
        );
    }

    onAddCategory(): void {
        if (!this.addCategoryForm.valid) {
            this.toastr.info('Kérlek töltsd ki az összes mezőt.');

            return;
        }

        const category = this.addCategoryForm.value as Category;

        // if (!category.isMainCategory && !category.parentCategory) {
        //     this.toastr.info('Kérlek válassz egy főkategóriát.');

        //     return;
        // }

        this.store.dispatch(CategoryAction.addCategory({ category }));
        this.router.navigate(['/admin/categories']);
    }
}
