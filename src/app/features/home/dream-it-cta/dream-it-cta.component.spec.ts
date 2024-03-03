import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DreamItCtaComponent } from './dream-it-cta.component';

describe('DreamItCtaComponent', () => {
  let component: DreamItCtaComponent;
  let fixture: ComponentFixture<DreamItCtaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DreamItCtaComponent]
    });
    fixture = TestBed.createComponent(DreamItCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
