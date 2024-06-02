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

import { Store } from '@ngrx/store';
import { Observable, map, switchMap, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { ToastrService } from '@core/services/toastr.service';
import { CategoryAction, CategorySelector } from '@core/store/category';
import {
    addImageToFormAndSetPreview,
    removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Category, CategoryType } from '@core/store/category/category.model';
import { Log } from '@core/store/log/log.model';
import { LogSelector } from '@core/store/log/log.selectors';
import { ItemHistoryComponent } from '@shared/item-history/item-history.component';

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
        TableModule,
        ItemHistoryComponent
    ],
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCategoryComponent implements OnInit {
    @HostBinding('class') class = 'nyk-edit-category';

    category$: Observable<Category>;
    logs$: Observable<Log[]>;

    editCategoryForm: FormGroup;
    imagePreview: string;

    readonly CategoryType = CategoryType;

    private readonly store = inject(Store);
    private readonly toastr = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly router = inject(Router);

    ngOnInit(): void {
        const categoryId$ = this.route.params.pipe(map((params: { id: string }) => params.id));

        this.category$ = categoryId$.pipe(
            switchMap((id) => this.store.select(CategorySelector.selectCategoryById(id))),
            tap((category) => {
                this.editCategoryForm = this.fb.group({
                    id: [category.id],
                    type: [category.type, Validators.required],
                    name: [category.name, Validators.required],
                    image: [category.image, Validators.required],
                    description: [category.description]
                });

                this.imagePreview = category.image;
            })
        );

        this.logs$ = categoryId$.pipe(
            switchMap((id) => this.store.select(LogSelector.selectLogsByItemId(id)))
        );
    }

    async onImagePicked(event: Event): Promise<void> {
        this.imagePreview = await addImageToFormAndSetPreview(event, this.editCategoryForm);
        this.changeDetectorRef.detectChanges();
    }

    onImageClear(imageInput: HTMLInputElement): void {
        this.imagePreview = removeImageFromFormAndInputAndClearPreview(
            this.editCategoryForm,
            imageInput
        );
    }

    onEditCategory(): void {
        if (!this.editCategoryForm.valid) {
            this.toastr.info('Kérlek töltsd ki az összes mezőt.');

            return;
        }

        const category = this.editCategoryForm.value as Category;

        this.store.dispatch(CategoryAction.updateCategory({ category }));
        this.router.navigate(['/admin/categories']);
    }
}
