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
import { Product } from '@core/models/product.model';
import { AuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';
import { BackendReview, Review } from '@core/models/review.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReviewService } from '@core/services/review.service';
import { ToastrService } from '@core/services/toastr.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

interface RatingStatistics {
    averageRating: number;
    ratingStatistics: {
        rating: number;
        count: number;
        percentage: string;
    }[];
}

@Component({
    selector: 'nyk-product-details-reviews',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextareaModule,
        SpinnerComponent
    ],
    templateUrl: './product-details-reviews.component.html',
    styleUrls: ['./product-details-reviews.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsReviewsComponent implements OnInit, OnChanges {
    @HostBinding('class.nyk-product-details-reviews') hostClass = true;

    @Input() product: Product;

    @Output() reviewProduct = new EventEmitter<BackendReview>();

    isAuthenticated$: Observable<boolean>;

    ratingStatistics: RatingStatistics;
    reviews: Review[];
    showAllReviews = false;
    reviewForm = this.fb.group({
        rating: [1, Validators.required],
        description: ['', Validators.required]
    });
    isReviewFormVisible = false;
    isLoading = false;

    constructor(
        private authService: AuthService,
        private reviewService: ReviewService,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.isAuthenticated$ = this.authService.getAuthStatus$();
    }

    ngOnChanges(changes: { product: SimpleChange }): void {
        if (changes.product) {
            this.product.reviews.reverse();
            this.ratingStatistics = this.calculateRatingStatistics(
                this.product.reviews
            );
            this.reviews = [...this.product.reviews];
            this.reviews = this.reviews.slice(0, 3);

            console.log(this.ratingStatistics);
        }
    }

    onToggleReviews(): void {
        this.showAllReviews = !this.showAllReviews;

        if (this.showAllReviews) {
            this.reviews = [...this.product.reviews];
        } else {
            this.reviews = this.reviews.slice(0, 3);
        }
    }

    onSelectRating(rating: number): void {
        this.reviewForm.patchValue({ rating });
    }

    onShareReview(): void {
        this.isReviewFormVisible = !this.isReviewFormVisible;
    }

    onSubmitReviewForm(): void {
        if (this.reviewForm.valid) {
            this.isLoading = true;

            const review: BackendReview = {
                product: this.product.id,
                rating: this.reviewForm.value.rating,
                description: this.reviewForm.value.description
            };

            this.reviewProduct.emit(review);
        } else {
            this.toastr.info('Kérlek töltsd ki az értékelést!');
        }
    }

    private calculateRatingStatistics(reviews: Review[]): RatingStatistics {
        if (!reviews.length) {
            // No reviews, return default statistics with all ratings at 0
            return {
                averageRating: 0,
                ratingStatistics: Array.from({ length: 5 }, (_, i) => i + 1)
                    .map((rating) => ({
                        rating,
                        count: 0,
                        percentage: '0%'
                    }))
                    .reverse()
            };
        }

        let totalRating = 0;
        const ratingCounts = {};
        const totalReviews = reviews.length;

        reviews.forEach((review) => {
            const rating = review.rating;
            totalRating += rating;
            ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
        });

        // Ensure all ratings from 1 to 5 have a count (even if 0)
        const allRatings = Array.from({ length: 5 }, (_, i) => i + 1);
        const completeRatingCounts = allRatings.reduce((acc, rating) => {
            acc[rating] = acc[rating] || 0;
            acc[rating] += ratingCounts[rating] || 0;
            return acc;
        }, {});

        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        const ratingStatistics = Object.keys(completeRatingCounts).map(
            (rating) => {
                const count = completeRatingCounts[rating];
                const percentage = (count / totalReviews) * 100;
                return {
                    rating: parseInt(rating),
                    count,
                    percentage: Math.ceil(percentage) + '%'
                };
            }
        );

        return {
            averageRating: Math.ceil(averageRating),
            ratingStatistics: ratingStatistics.reverse()
        };
    }
}
