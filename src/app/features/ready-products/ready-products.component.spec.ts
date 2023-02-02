import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyProductsComponent } from './ready-products.component';

describe('ReadyProductsComponent', () => {
  let component: ReadyProductsComponent;
  let fixture: ComponentFixture<ReadyProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadyProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadyProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
