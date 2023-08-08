import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselWithHeadingAndButtonComponent } from './carousel-with-heading-and-button.component';

describe('CarouselWithHeadingAndButtonComponent', () => {
  let component: CarouselWithHeadingAndButtonComponent;
  let fixture: ComponentFixture<CarouselWithHeadingAndButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselWithHeadingAndButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselWithHeadingAndButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
