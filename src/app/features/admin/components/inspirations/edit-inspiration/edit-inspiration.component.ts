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
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Store } from '@ngrx/store';
import { Observable, map, switchMap, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

import { ToastrService } from '@core/services/toastr.service';
import {
    addImageToFormAndSetPreview,
    removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InspirationCategory } from '@core/store/category/category.model';
import { Inspiration } from '@core/store/inspiration/inspiration.model';
import { InspirationAction, InspirationSelector } from '@core/store/inspiration';
import { CategorySelector } from '@core/store/category';
import { Log, LogSelector } from '@core/store/log';
import { ItemHistoryComponent } from '@shared/item-history/item-history.component';

@Component({
    selector: 'nyk-edit-inspiration',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        DividerModule,
        DropdownModule,
        SpinnerComponent,
        TableModule,
        InputTextModule,
        ItemHistoryComponent
    ],
    templateUrl: './edit-inspiration.component.html',
    styleUrls: ['./edit-inspiration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditInspirationComponent implements OnInit {
    @HostBinding('class') hostClass = 'nyk-edit-inspiration';

    inspiration$: Observable<Inspiration>;
    categories$: Observable<InspirationCategory[]>;
    logs$: Observable<Log[]>;

    editInspirationForm: FormGroup;
    imagePreview: string;

    private readonly store = inject(Store);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly toastr = inject(ToastrService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    ngOnInit(): void {
        const inspirationId$ = this.route.params.pipe(map((params: { id: string }) => params.id));

        this.inspiration$ = inspirationId$.pipe(
            switchMap((id) => this.store.select(InspirationSelector.selectInspirationById(id))),
            tap((inspiration) => {
                this.editInspirationForm = this.fb.group({
                    id: [inspiration.id, Validators.required],
                    name: [inspiration.name, Validators.required],
                    category: [inspiration.category.id, Validators.required],
                    image: [inspiration.image, Validators.required]
                });

                this.imagePreview = inspiration.image;
            })
        );

        this.categories$ = this.store.select(CategorySelector.selectInspirationCategories());

        this.logs$ = inspirationId$.pipe(
            switchMap((id) => this.store.select(LogSelector.selectLogsByItemId(id)))
        );
    }

    async onImagePicked(event: Event): Promise<void> {
        this.imagePreview = await addImageToFormAndSetPreview(event, this.editInspirationForm);
        this.changeDetectorRef.detectChanges();
    }

    onImageClear(imageInput: HTMLInputElement): void {
        this.imagePreview = removeImageFromFormAndInputAndClearPreview(
            this.editInspirationForm,
            imageInput
        );
    }

    onEditInspiration(): void {
        if (!this.editInspirationForm.valid) {
            this.toastr.info('Kérlek töltsd ki az összes mezőt.');

            return;
        }

        const inspiration = this.editInspirationForm.value as Inspiration;

        this.store.dispatch(InspirationAction.updateInspiration({ inspiration }));
        this.router.navigate(['/admin/inspirations']);
    }
}
