import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    ViewEncapsulation
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'nyk-doll-dress-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, RouterModule],
    templateUrl: './doll-dress-dialog.component.html',
    styleUrls: ['./doll-dress-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DollDressDialogComponent {
    @HostBinding('class') hostClass = 'nyk-doll-dress-dialog';
}
