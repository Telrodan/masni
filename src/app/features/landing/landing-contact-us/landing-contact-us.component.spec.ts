import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingContactUsComponent } from './landing-contact-us.component';

describe('LandingContactUsComponent', () => {
  let component: LandingContactUsComponent;
  let fixture: ComponentFixture<LandingContactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingContactUsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
