import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollableImageWithTitleComponent } from './scrollable-image-with-title.component';

describe('ScrollableImageWithTitleComponent', () => {
  let component: ScrollableImageWithTitleComponent;
  let fixture: ComponentFixture<ScrollableImageWithTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollableImageWithTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollableImageWithTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
