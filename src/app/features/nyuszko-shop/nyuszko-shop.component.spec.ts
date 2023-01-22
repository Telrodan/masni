import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NyuszkoShopComponent } from './nyuszko-shop.component';

describe('NyuszkoKuckoComponent', () => {
  let component: NyuszkoShopComponent;
  let fixture: ComponentFixture<NyuszkoShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NyuszkoShopComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NyuszkoShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
