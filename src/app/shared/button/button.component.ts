import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation
} from '@angular/core';

export type ButtonType = 'basic' | 'outlined' | 'underline';
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'danger';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[nyk-button], a[nyk-button]',
    standalone: true,
    imports: [],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
    @HostBinding('class')
    get buttonClasses(): string {
        return `nyk-button nyk-button-${this.color} nyk-button-${this.type} interactive`;
    }

    @Input() color: ButtonColor = 'primary';
    @Input() type: ButtonType = 'basic';
}
