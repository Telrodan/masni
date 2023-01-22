import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasniShopComponent } from './masni-shop.component';

describe('MasniShopComponent', () => {
  let component: MasniShopComponent;
  let fixture: ComponentFixture<MasniShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasniShopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasniShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
