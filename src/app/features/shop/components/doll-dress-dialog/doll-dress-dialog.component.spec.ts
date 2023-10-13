import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DollDressDialogComponent } from './doll-dress-dialog.component';

describe('DollDressDialogComponent', () => {
  let component: DollDressDialogComponent;
  let fixture: ComponentFixture<DollDressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DollDressDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DollDressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
