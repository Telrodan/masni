import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { CarouselModule } from 'primeng/carousel';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';

import { ImageCompositionComponent } from './components/image-composition/image-composition.component';
import { ScrollableImageWithTitleComponent } from './components/scrollable-image-with-title/scrollable-image-with-title.component';
import { MaterialCarouselComponent } from './components/material-carousel/material-carousel.component';

const PRIME_NG = [CarouselModule, RippleModule, ButtonModule, SkeletonModule];

@NgModule({
    declarations: [
        ImageCompositionComponent,
        ScrollableImageWithTitleComponent,
        MaterialCarouselComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        ...PRIME_NG
    ],
    exports: [
        ImageCompositionComponent,
        ScrollableImageWithTitleComponent,
        MaterialCarouselComponent
    ]
})
export class SharedModule {}
