import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnChanges,
    SimpleChange,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';

import { Product } from '@core/models/product.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'nyk-product-details-form',
    standalone: true,
    imports: [CommonModule, InputTextModule, ReactiveFormsModule],
    templateUrl: './product-details-form.component.html',
    styleUrls: ['./product-details-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsFormComponent implements OnChanges {
    @HostBinding('class') hostClass = 'nyk-product-details-form';

    @Input() product: Product;

    productDetailsForm: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnChanges(changes: { product: SimpleChange }): void {
        if (changes.product) {
            console.log('product', this.product);
            this.productDetailsForm = this.fb.group({
                nameEmbroidery: ['']
            });
        }
    }
}
