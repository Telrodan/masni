import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MackoSzundikendoBuilderComponent } from './macko-szundikendo-builder.component';

describe('MackoSzundikendoBuilderComponent', () => {
  let component: MackoSzundikendoBuilderComponent;
  let fixture: ComponentFixture<MackoSzundikendoBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MackoSzundikendoBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MackoSzundikendoBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
