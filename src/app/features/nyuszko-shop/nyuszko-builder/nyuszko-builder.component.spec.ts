import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NyuszkoBuilderComponent } from './nyuszko-builder.component';

describe('NyuszkoBuilderComponent', () => {
  let component: NyuszkoBuilderComponent;
  let fixture: ComponentFixture<NyuszkoBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NyuszkoBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NyuszkoBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
