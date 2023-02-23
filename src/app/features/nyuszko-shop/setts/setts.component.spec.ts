import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettsComponent } from './setts.component';

describe('SettsComponent', () => {
  let component: SettsComponent;
  let fixture: ComponentFixture<SettsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
