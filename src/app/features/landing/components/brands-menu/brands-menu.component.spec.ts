import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsMenuComponent } from './brands-menu.component';

describe('LandingBrandsComponent', () => {
  let component: BrandsMenuComponent;
  let fixture: ComponentFixture<BrandsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandsMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
