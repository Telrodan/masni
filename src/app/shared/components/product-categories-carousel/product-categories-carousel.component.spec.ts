import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoriesCarouselComponent } from './product-categories-carousel.component';

describe('ProductCategoriesCarouselComponent', () => {
  let component: ProductCategoriesCarouselComponent;
  let fixture: ComponentFixture<ProductCategoriesCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCategoriesCarouselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCategoriesCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
