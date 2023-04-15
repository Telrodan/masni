import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MackoBuilderComponent } from './macko-builder.component';

describe('MackoBuilderComponent', () => {
  let component: MackoBuilderComponent;
  let fixture: ComponentFixture<MackoBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MackoBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MackoBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
