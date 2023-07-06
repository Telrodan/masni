import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspirationsComponent } from './inspirations.component';

describe('InspirationsComponent', () => {
  let component: InspirationsComponent;
  let fixture: ComponentFixture<InspirationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspirationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspirationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
