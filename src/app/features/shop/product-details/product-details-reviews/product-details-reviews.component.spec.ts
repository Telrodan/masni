import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsReviewsComponent } from './product-details-reviews.component';

describe('ProductDetailsReviewsComponent', () => {
  let component: ProductDetailsReviewsComponent;
  let fixture: ComponentFixture<ProductDetailsReviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductDetailsReviewsComponent]
    });
    fixture = TestBed.createComponent(ProductDetailsReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
