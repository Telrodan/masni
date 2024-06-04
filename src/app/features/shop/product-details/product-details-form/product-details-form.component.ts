import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { startWith, map } from 'rxjs';
import { Product } from '@core/store/product/product.model';

@Component({
    selector: 'nyk-product-details-form',
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        ReactiveFormsModule,
        DropdownModule,
        InputTextareaModule
    ],
    templateUrl: './product-details-form.component.html',
    styleUrls: ['./product-details-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsFormComponent implements OnInit, OnChanges {
    @HostBinding('class') hostClass = 'nyk-product-details-form';

    @Input() product: Product;

    @Output() priceChange = new EventEmitter<number>();

    productDetailsForm: FormGroup;
    price: number;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.productDetailsForm.valueChanges
            .pipe(
                startWith(this.productDetailsForm.value),
                map((changes) => {
                    this.price = this.product.discountedPrice
                        ? this.product.discountedPrice
                        : this.product.price;
                    if (changes.nameEmbroidery) {
                        this.price += 500;
                    }
                    for (const key of Object.keys(changes.questions)) {
                        const value = changes.questions[key];
                        if (value) {
                            this.product.questions.forEach((question) => {
                                if (question.id === key) {
                                    question.options.forEach((option) => {
                                        // if (option._id === changes.questions[key]) {
                                        //     this.price += option.extraPrice;
                                        // }
                                    });
                                }
                            });
                        }
                    }
                    this.priceChange.emit(this.price);
                })
            )
            .subscribe();
    }

    ngOnChanges(changes: { product: SimpleChange }): void {
        if (changes.product) {
            const formControls = {};
            this.product.questions.forEach((question) => {
                formControls[question.id] = ['', Validators.required];
            });

            this.productDetailsForm = this.fb.group({
                comment: [''],
                nameEmbroidery: [''],
                questions: this.fb.group({
                    ...formControls
                })
            });
        }
    }
}
