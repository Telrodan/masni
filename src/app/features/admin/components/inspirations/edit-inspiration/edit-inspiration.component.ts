import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Observable, combineLatest, filter, map, switchMap, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

import { InspirationCategory } from '@core/models/category.model';
import {
    Inspiration,
    BackendInspiration
} from '@core/models/inspiration.model';
import { ToastrService } from '@core/services/toastr.service';
import { InspirationService } from '@core/services/inspiration.service';
import {
    addImageToFormAndSetPreview,
    removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { CategoryService } from '@core/services/category.service';
import { LogService } from '@core/services/log.service';
import { Log } from '@core/models/log.model';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

interface InspirationData extends Inspiration {
    logs: Log[];
}

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
        InputTextModule
    ],
    templateUrl: './edit-inspiration.component.html',
    styleUrls: ['./edit-inspiration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditInspirationComponent implements OnInit {
    @HostBinding('class') hostClass = 'nyk-edit-inspiration';

    inspiration$: Observable<InspirationData>;
    inspirationId: string;
    categories$: Observable<InspirationCategory[]>;
    isLoading = false;

    editInspirationForm: FormGroup;

    imagePreview: string;

    constructor(
        private inspirationService: InspirationService,
        private categoryService: CategoryService,
        private logService: LogService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.inspiration$ = this.route.params.pipe(
            switchMap((params) =>
                combineLatest([
                    this.inspirationService.getInspirationById$(params['id']),
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
            filter((inspiration) => !!inspiration),
            map(([inspiration, logs]) => ({
                ...inspiration,
                logs
            })),
            tap((inspiration) => {
                this.inspirationId = inspiration.id;
                this.editInspirationForm = this.fb.group({
                    name: [inspiration.name, Validators.required],
                    categoryId: [inspiration.category.id, Validators.required],
                    image: [inspiration.image, Validators.required]
                });

                this.imagePreview = inspiration.image;
            })
        );

        this.categories$ = this.categoryService.getInspirationCategories$();
    }

    async onImagePicked(event: Event): Promise<void> {
        this.imagePreview = await addImageToFormAndSetPreview(
            event,
            this.editInspirationForm
        );
        this.changeDetectorRef.detectChanges();
    }

    onImageClear(imageInput: HTMLInputElement): void {
        this.imagePreview = removeImageFromFormAndInputAndClearPreview(
            this.editInspirationForm,
            imageInput
        );
    }

    onEditInspiration(): void {
        if (this.editInspirationForm.valid) {
            const inspiration: BackendInspiration = {
                name: this.editInspirationForm.value.name.trim(),
                categoryId: this.editInspirationForm.value.categoryId,
                image: this.editInspirationForm.value.image
            };

            if (inspiration.name) {
                this.isLoading = true;
                this.inspirationService
                    .updateInspiration$(inspiration, this.inspirationId)
                    .pipe(
                        tap((inspiration) => {
                            this.isLoading = false;
                            this.toastr.success(
                                `${inspiration.name} inspiráció módosítva`
                            );
                            this.router.navigate(['/admin/inspirations']);
                        })
                    )
                    .subscribe();
            } else {
                this.toastr.error('Kérlek add meg az inspiráció nevét');
            }
        } else {
            this.toastr.error('Kérlek töltsd ki az összes mezőt');
        }
    }
}
