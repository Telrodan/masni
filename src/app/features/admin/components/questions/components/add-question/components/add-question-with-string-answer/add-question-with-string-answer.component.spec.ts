import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionWithStringAnswerComponent } from './add-question-with-string-answer.component';

describe('AddQuestionWithStringAnswerComponent', () => {
  let component: AddQuestionWithStringAnswerComponent;
  let fixture: ComponentFixture<AddQuestionWithStringAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddQuestionWithStringAnswerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddQuestionWithStringAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
