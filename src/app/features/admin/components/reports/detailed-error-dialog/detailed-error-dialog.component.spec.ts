import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedErrorDialogComponent } from './detailed-error-dialog.component';

describe('DetailedErrorDialogComponent', () => {
  let component: DetailedErrorDialogComponent;
  let fixture: ComponentFixture<DetailedErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedErrorDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
