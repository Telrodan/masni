import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NyuszkoSzundikendoBuilderComponent } from './nyuszko-szundikendo-builder.component';

describe('NyuszkoSzundikendoBuilderComponent', () => {
  let component: NyuszkoSzundikendoBuilderComponent;
  let fixture: ComponentFixture<NyuszkoSzundikendoBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NyuszkoSzundikendoBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NyuszkoSzundikendoBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
