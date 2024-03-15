import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Product } from '@core/models/product.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'mhd-doll-dress-dialog',
    standalone: true,
    templateUrl: './doll-dress-dialog.component.html',
    styleUrls: ['./doll-dress-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DollDressDialogComponent implements OnInit {
    products$: Observable<Product[]>;

    ngOnInit(): void {
        // this.products$ = this.store$.select(selectDollDresses);
    }
}
