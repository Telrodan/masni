import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Input,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@shared/button/button.component';

export interface ProductSubCategoriesData {
    label: string;
    image: string;
    routerLink: string;
    count: number;
}

@Component({
    selector: 'nyk-categories',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonComponent],
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent {
    @HostBinding('class.nyk-categories') hostClass = true;

    @ViewChild('container', { static: false }) container: ElementRef;

    @Input() productSubCategoriesData: ProductSubCategoriesData[];

    displayNumber = 2;
    buttonLabel = 'Összes mutatása';

    trackByLabel(index: number, item: ProductSubCategoriesData): string {
        return item.label;
    }

    onShowAll(): void {
        if (this.displayNumber === this.productSubCategoriesData.length) {
            this.displayNumber = 2;
            this.buttonLabel = 'Összes mutatása';
            this.container.nativeElement.scrollIntoView({ behavior: 'smooth' });

            return;
        }

        this.buttonLabel = 'Kevesebb mutatása';
        this.displayNumber = this.productSubCategoriesData.length;
    }
}
