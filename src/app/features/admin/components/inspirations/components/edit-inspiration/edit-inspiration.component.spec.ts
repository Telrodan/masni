import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInspirationComponent } from './edit-inspiration.component';

describe('EditInspirationComponent', () => {
  let component: EditInspirationComponent;
  let fixture: ComponentFixture<EditInspirationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInspirationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInspirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
