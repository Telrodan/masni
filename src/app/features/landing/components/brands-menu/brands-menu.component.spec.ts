import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingBrandsComponent } from './landing-brands.component';

describe('LandingBrandsComponent', () => {
  let component: LandingBrandsComponent;
  let fixture: ComponentFixture<LandingBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingBrandsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
